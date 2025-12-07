// Jenkinsfile - corrected declarative pipeline
// - No hardcoded secret values; credential IDs read from environment variables.
// - Detects git tags (dev/*) and falls back to branch-shortsha
// - Optional FORCE_REDEPLOY param to trigger redeploy for testing

properties([
  parameters([
    string(name: 'FORCE_REDEPLOY', defaultValue: 'false', description: 'Set to true to force DEV redeploy even without dev/* tag')
  ])
])

pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '50'))
  }

  triggers {
    githubPush()
  }

  environment {
    // Non-sensitive repo-specific values (change per repo if needed)
    PROJECT_NAME = 'orias-studio-fe'
    IMAGE_NAME   = 'orias-studio-fe'
    IMAGE_ORG    = 'oriasteknologi'
    IMAGE_REPO   = "${IMAGE_ORG}/${IMAGE_NAME}"
    DOCKER_COMPOSE_FILE = 'docker-compose.yaml'
    WORKLOAD_DEV     = 'deployment:orias-studio:orias-studio-fe'
    RANCHER_BASE_URL = 'https://dev-kube.oriasteknologi.com'
    RANCHER_PROJECT  = 'local:p-xf4jv'

    // ---- Credential IDs (SET THESE in Job / Folder / Global) ----
    // Put the Jenkins credential ID here in job/folder/global config (not the secret itself)
    DOCKER_REGISTRY_CREDENTIALS = 'dockerhub-qtn'
    ENV_FILE_CREDENTIAL         = 'env-orias-studio-fe'
    RANCHER_TOKEN_CREDENTIAL    = 'rancher-matrix-api'
    SLACK_WEBHOOK_CREDENTIAL    = ''   // optional
    // optional: default runtime PORT if needed by compose (override in job)
    PORT = ''
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        // ensure tags are available in workspace for git describe
        sh 'git fetch --tags --force || true'
        script {
          env.SHORT_SHA = sh(script: "git rev-parse --short=8 HEAD", returnStdout: true).trim()
          echo "Branch: ${env.BRANCH_NAME} | Short SHA: ${env.SHORT_SHA}"
        }
      }
    }

    stage('Detect Tag & Version') {
      steps {
        script {
          // Try git describe first (exact tag on this commit)
          def gitTag = sh(script: "git describe --exact-match --tags 2>/dev/null || true", returnStdout: true).trim()
          def branchName = env.BRANCH_NAME ?: ''
          if (!gitTag && branchName && branchName.startsWith('dev/')) {
            gitTag = branchName
          }

          if (gitTag) {
            echo "Found tag: ${gitTag}"
            if (gitTag.startsWith('dev/')) {
              env.IMAGE_VERSION = "dev-${gitTag.tokenize('/')[1]}"
              env.IS_TAG = gitTag
            } else if (gitTag.startsWith('v') || gitTag.startsWith('release/')) {
              env.IMAGE_VERSION = gitTag.replaceFirst(/^v/, '').replaceFirst(/^release\\//, '')
              env.IS_TAG = gitTag
            } else {
              env.IMAGE_VERSION = gitTag.replaceAll('[^A-Za-z0-9_.-]', '-')
              env.IS_TAG = gitTag
            }
          } else {
            def branchSafe = (branchName ?: 'branch').replaceAll('[^A-Za-z0-9_.-]','-')
            env.IMAGE_VERSION = "${branchSafe}-${env.SHORT_SHA}"
            env.IS_TAG = ''
          }

          echo "IS_TAG='${env.IS_TAG ?: 'none'}' IMAGE_VERSION='${env.IMAGE_VERSION}'"
          echo "RANCHER_TOKEN_CREDENTIAL (id): ${env.RANCHER_TOKEN_CREDENTIAL ?: 'not-set'}"
        }
      }
    }

    stage('Prepare .env (optional)') {
      steps {
        script {
          if (env.ENV_FILE_CREDENTIAL?.trim()) {
            withCredentials([file(credentialsId: env.ENV_FILE_CREDENTIAL, variable: 'ENV_FILE')]) {
              sh 'cp "$ENV_FILE" .env && echo ".env copied"'
            }
          } else {
            echo "ENV_FILE_CREDENTIAL not provided; skipping .env copy"
          }
        }
      }
    }

    stage('Build & Tag') {
      steps {
        script {
          // Ensure PORT fallback in env for docker-compose substitution if desired
          if (!env.PORT?.trim()) {
            // do not enforce; docker-compose may have default or use the compose fallback syntax
            echo "PORT not set in environment; ensure compose uses fallback if needed."
          }
          sh """
            echo "Building ${IMAGE_REPO}:${IMAGE_VERSION}"
            docker compose -f ${DOCKER_COMPOSE_FILE} build --pull
            # Tag compose-built image; assumes compose image in file is ${IMAGE_REPO}:latest
            docker tag ${IMAGE_REPO}:latest ${IMAGE_REPO}:${IMAGE_VERSION} || true
          """
        }
      }
    }

    stage('Push (optional)') {
      steps {
        script {
          if (env.DOCKER_REGISTRY_CREDENTIALS?.trim()) {
            retry(2) {
              withDockerRegistry([credentialsId: env.DOCKER_REGISTRY_CREDENTIALS, url: '']) {
                sh "docker push ${IMAGE_REPO}:${IMAGE_VERSION}"
              }
            }
          } else {
            echo "DOCKER_REGISTRY_CREDENTIALS not set; skipping docker push"
          }
        }
      }
    }

    stage('DEV Redeploy (optional)') {
      when {
        expression {
          // run when a dev/* tag is present OR the FORCE_REDEPLOY parameter set to true
          return ((env.IS_TAG && env.IS_TAG.startsWith('dev/')) || (params.FORCE_REDEPLOY?.toLowerCase() == 'true'))
        }
      }
      steps {
        script {
          if (!env.RANCHER_TOKEN_CREDENTIAL?.trim()) {
            error "RANCHER_TOKEN_CREDENTIAL is not configured in Job/Folder/Global"
          }
          withCredentials([usernamePassword(credentialsId: env.RANCHER_TOKEN_CREDENTIAL, usernameVariable: 'RANCHER_USER', passwordVariable: 'RANCHER_PASS')]) {
            sh "curl -s -k -u $RANCHER_USER:$RANCHER_PASS -X POST \"${RANCHER_BASE_URL}/v3/project/${RANCHER_PROJECT}/workloads/${WORKLOAD_DEV}?action=redeploy\""
          }
        }
      }
    }

    stage('Cleanup') {
      steps {
        sh """
          docker rmi ${IMAGE_REPO}:${IMAGE_VERSION} || true
          docker image prune -f || true
        """
      }
    }
  } // end stages

  post {
    success {
      echo "SUCCESS ${IMAGE_REPO}:${IMAGE_VERSION}"
      script {
        if (env.SLACK_WEBHOOK_CREDENTIAL?.trim()) {
          withCredentials([string(credentialsId: env.SLACK_WEBHOOK_CREDENTIAL, variable: 'SLACK_WEBHOOK')]) {
            sh "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"✅ ${PROJECT_NAME} built: ${IMAGE_REPO}:${IMAGE_VERSION} (${BUILD_URL})\"}' $SLACK_WEBHOOK || true"
          }
        } else {
          echo "No Slack webhook credential configured"
        }
      }
    }

    failure {
      echo "FAILED ${PROJECT_NAME} - see ${BUILD_URL}"
      script {
        if (env.SLACK_WEBHOOK_CREDENTIAL?.trim()) {
          withCredentials([string(credentialsId: env.SLACK_WEBHOOK_CREDENTIAL, variable: 'SLACK_WEBHOOK')]) {
            sh "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"❌ ${PROJECT_NAME} failed: ${IMAGE_REPO}:${IMAGE_VERSION} (${BUILD_URL})\"}' $SLACK_WEBHOOK || true"
          }
        }
      }
    }

    always {
      sh '[ -f .env ] && rm -f .env || true'
    }
  }
}