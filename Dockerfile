## Multi-stage build for frontend (Vite + Bun in monorepo)

# Build stage with Bun to leverage workspace and speed
FROM oven/bun:1 AS builder
WORKDIR /app


# Copy package.json only (no bun.lock as requested)
COPY frontend/package.json ./

# Install all workspace deps with frozen lockfile
RUN echo "VITE_BACKEND_URL=PLACEHOLDER_API_URL" > .env
RUN bun install

# Copy the rest of the repo
# Copy the rest of the repo
COPY . .

# Create .env in frontend directory and build
RUN echo "VITE_BACKEND_URL=PLACEHOLDER_API_URL" > frontend/.env
RUN cd frontend && bun run build

# Runtime stage using Node to statically serve built assets
FROM node:22-alpine AS runner
WORKDIR /app

# Copy build output
COPY --from=builder /app/frontend/dist ./dist

# Copy entrypoint to inject env at runtime
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
 && npm install -g serve

EXPOSE 5173

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "5173"]