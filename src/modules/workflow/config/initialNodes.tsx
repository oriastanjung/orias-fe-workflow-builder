import type { WorkflowNode } from "../types/Workflow";

export const initialNodes: WorkflowNode[] = [
  // 1. Trigger
  {
    id: "1",
    type: "trigger",
    position: { x: 50, y: 300 },
    data: { label: "Start Chat" },
  },

  // 2. Condition: is "business" or "bisnis"?
  {
    id: "2",
    type: "condition",
    position: { x: 300, y: 300 },
    data: {
      label: "Is Business?",
      condition: "bisnis",
    },
  },

  // 3. Message (False path): General Greeting
  {
    id: "3",
    type: "message",
    position: { x: 600, y: 100 },
    data: {
      label: "General Reply",
      message: "Just chilling! How are you today?",
    },
  },

  // 4. API Request (True path): Fetch Users
  {
    id: "4",
    type: "api_request",
    position: { x: 600, y: 450 },
    data: {
      label: "Fetch Random Users",
      url: "https://randomuser.me/api/?results=3",
      method: "GET",
    },
  },

  // 5. AI Process: Format User List
  {
    id: "5",
    type: "ai_process",
    position: { x: 900, y: 450 },
    data: {
      label: "Format User List",
      prompt: "Format the extracted user list into a readable string",
      outputType: "text",
    },
  },

  // 6. Message: Show Users
  {
    id: "6",
    type: "message",
    position: { x: 1200, y: 450 },
    data: {
      label: "Show Users",
      message: "Here are the users found:",
    },
  },

  // 7. End Node
  {
    id: "7",
    type: "end",
    position: { x: 1500, y: 300 },
    data: { label: "End Flow" },
  },
];
