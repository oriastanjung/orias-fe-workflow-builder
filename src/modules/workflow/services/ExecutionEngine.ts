import type {
  WorkflowNode,
  WorkflowEdge,
  ConditionNodeData,
  MessageNodeData,
  AIProcessNodeData,
  ApiRequestNodeData,
} from "../types/Workflow";

export interface ExecutionLog {
  nodeId: string;
  status: "pending" | "running" | "completed" | "failed";
  message?: string;
  ioData?: {
    input: any;
    output: any;
  };
  timestamp: number;
}

export type ExecutionStatus = "idle" | "running" | "completed" | "failed";

type NodeStatusCallback = (
  nodeId: string,
  status: ExecutionLog["status"]
) => void;

export class ExecutionEngine {
  private nodes: WorkflowNode[];
  private edges: WorkflowEdge[];
  private logs: ExecutionLog[] = [];
  private onNodeStatusChange?: NodeStatusCallback;
  private delayMs: number = 1500;

  constructor(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    onNodeStatusChange?: NodeStatusCallback
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.onNodeStatusChange = onNodeStatusChange;
  }

  public getLogs() {
    return this.logs;
  }

  private addLog(
    nodeId: string,
    status: ExecutionLog["status"],
    message?: string,
    ioData?: { input: any; output: any }
  ) {
    this.logs.push({
      nodeId,
      status,
      message,
      ioData: ioData ? JSON.parse(JSON.stringify(ioData)) : undefined, // Deep copy to prevent ref mutation
      timestamp: Date.now(),
    });

    if (this.onNodeStatusChange && nodeId !== "system") {
      this.onNodeStatusChange(nodeId, status);
    }
  }

  public async run(inputMessage: string): Promise<ExecutionLog[]> {
    this.logs = [];

    // Find Trigger Node
    const startNode = this.nodes.find((n) => n.type === "trigger");
    if (!startNode) {
      this.addLog("system", "failed", "No Trigger Node found");
      return this.logs;
    }

    await this.executeNode(startNode, inputMessage);

    return this.logs;
  }

  private async executeNode(node: WorkflowNode, input: any) {
    // Log Start
    this.addLog(node.id, "running", `Executing ${node.type}`, {
      input,
      output: null,
    });

    // Explicit Delay for visualization
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));

    try {
      let nextNodeId: string | undefined;
      let output: any = input; // Default pass-through

      switch (node.type) {
        case "trigger":
          // Pass input as is
          this.addLog(node.id, "completed", "Flow triggered", {
            input,
            output,
          });
          nextNodeId = this.getNextNodeId(node.id);
          break;

        case "message":
          const msgData = node.data as MessageNodeData;
          // Output is the message text itself for downstream nodes? Or just pass through the input object?
          // Usually message nodes just side-effect (send message) and pass through, or output the sent message.
          // Let's pass through input to allow chaining context.
          this.addLog(node.id, "completed", `Sent: ${msgData.message}`, {
            input,
            output,
          });
          nextNodeId = this.getNextNodeId(node.id);
          break;

        case "api_request":
          const apiData = node.data as ApiRequestNodeData;
          // Mock API Call
          if (apiData.url.includes("randomuser.me")) {
            output = {
              users: [
                {
                  name: { first: "John", last: "Doe" },
                  email: "john@example.com",
                },
                {
                  name: { first: "Jane", last: "Smith" },
                  email: "jane@example.com",
                },
                {
                  name: { first: "Alice", last: "Johnson" },
                  email: "alice@example.com",
                },
              ],
            };
          } else {
            output = { status: 200, data: "Mock API Data" };
          }

          this.addLog(node.id, "completed", "API Request Success", {
            input,
            output,
          });
          nextNodeId = this.getNextNodeId(node.id);
          break;

        case "ai_process":
          const aiData = node.data as AIProcessNodeData;

          // Mock AI processing based on input
          if (aiData.outputType === "json") {
            output = {
              analysis: `Processed: ${JSON.stringify(input)}`,
              schema: aiData.schema,
            };
          } else {
            // String output mock
            if (typeof input === "object" && input.users) {
              output =
                "Here are the users I found:\n" +
                input.users
                  .map((u: any) => `- ${u.name.first} ${u.name.last}`)
                  .join("\n");
            } else {
              output = `AI Response to: ${JSON.stringify(input)}`;
            }
          }

          this.addLog(node.id, "completed", "AI Processed", { input, output });
          nextNodeId = this.getNextNodeId(node.id);
          break;

        case "condition":
          const condition = (node.data as ConditionNodeData).condition;
          if (!condition) throw new Error("Condition is missing");

          // Simple string check on input. If input is object, maybe check a specific field?
          // For now, let's assume input is the user message string IF it came from trigger.
          // If it came from API, this might fail. Rigid logic for demo.
          const checkString =
            typeof input === "string" ? input : JSON.stringify(input);

          const isTrue = checkString
            .toLowerCase()
            .includes(condition.toLowerCase());

          // Condition node output is boolean? Or just pass through input?
          // Condition nodes usually just route. They pass through input to the next node.
          output = input;

          this.addLog(node.id, "completed", `Condition is ${isTrue}`, {
            input,
            output,
          });

          const edge = this.edges.find(
            (e) =>
              e.source === node.id &&
              (isTrue ? e.sourceHandle === "true" : e.sourceHandle === "false")
          );

          if (edge) nextNodeId = edge.target;
          break;

        case "end":
          this.addLog(node.id, "completed", "Flow Finished", { input, output });
          return; // Stop execution

        default:
          this.addLog(node.id, "completed", "Passed through", {
            input,
            output,
          });
          nextNodeId = this.getNextNodeId(node.id);
      }

      if (nextNodeId) {
        const nextNode = this.nodes.find((n) => n.id === nextNodeId);
        if (nextNode) {
          await this.executeNode(nextNode, output);
        }
      } else {
        this.addLog(node.id, "completed", "End of branch", { input, output });
      }
    } catch (error: any) {
      this.addLog(node.id, "failed", error.message, { input, output: null });
    }
  }

  private getNextNodeId(nodeId: string): string | undefined {
    // For single-output nodes
    const edge = this.edges.find((e) => e.source === nodeId);
    return edge?.target;
  }
}
