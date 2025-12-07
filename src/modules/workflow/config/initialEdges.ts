import type { WorkflowEdge } from "../types/Workflow";

export const initialEdges: WorkflowEdge[] = [
  // Trigger -> Condition
  { id: "e1-2", source: "1", target: "2" },

  // Condition (False) -> General Message
  { id: "e2-3", source: "2", target: "3", sourceHandle: "false" },

  // Condition (True) -> API Request
  { id: "e2-4", source: "2", target: "4", sourceHandle: "true" },

  // API Request -> AI Process
  { id: "e4-5", source: "4", target: "5" },

  // AI Process -> Display Result Message
  { id: "e5-6", source: "5", target: "6" },

  // General Message -> End
  { id: "e3-7", source: "3", target: "7" },

  // Display Result -> End
  { id: "e6-7", source: "6", target: "7" },
];
