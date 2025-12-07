# n8n-Style Workflow Builder (Chatbot Edition)

A powerful, visual workflow editor for designing chatbot interactions. Features drag-and-drop nodes, real-time simulation, and detailed execution logging.

![Workflow Editor Screenshot](./editor-screenshot.png) 
*(Please save a screenshot as `editor-screenshot.png` in the root folder if you have one)*

## 🚀 Features

- **Visual Editor**: Drag and drop nodes (Trigger, Message, Condition, API Request, AI Process, End).
- **Horizontal Flow**: Clean left-to-right connection layout.
- **Smart Validation**: Handles prevent invalid connections (e.g., outputs to inputs only).
- **Properties Panel**: Click the **Settings icon** on any node to edit its configuration (JSON schema builder for AI nodes).
- **Real-time Simulation**:
    - Test your flow instantly with the integrated Chat UI.
    - **Visual Feedback**: Nodes pulse blue (running), turn green (success), or red (failed).
    - **History Logs**: Inspect full JSON data (Input vs Output) for every step.

## 🛠️ Usage Guide

### 1. Creating a Flow
1.  **Start**: Every flow must begin with a **Trigger Node**.
2.  **Add Nodes**: Drag nodes from the Sidebar onto the Canvas.
3.  **Connect**: Drag from the **Right Handle** of one node to the **Left Handle** of another.
    - **Condition Nodes**: Have two outputs: `True` (Top) and `False` (Bottom).

### 2. Configuring Nodes
Click the **Gear Icon** on a node to open the Properties Sheet.
-   **Trigger**: No config needed.
-   **Message**: Enter the text response.
-   **Condition**: Enter the keyword to check (case-insensitive "contains" check).
-   **API Request**: Set Method (GET/POST) and URL.
-   **AI Process**:
    -   **Prompt**: Instructions for the AI.
    -   **Output Type**: Text or JSON.
    -   **Schema Builder**: If JSON, define expected keys and types (String, Number, etc.).

### 3. Simulation
1.  Open the **Simulation Card** (bottom-right).
2.  Type a message and hit **Play**.
3.  Watch the nodes light up as they execute.
4.  Click the **History Clock Icon** to view the `Input` and `Output` data passed between nodes.

---

## 🔌 Backend Integration Guide (Next Steps)

Currently, the workflow runs on a **Mock Execution Engine** purely in the browser. To integrate with a real Python/Node.js backend, follow these steps:

### 1. Data Structure
The workflow is stored as a JSON object containing `nodes` and `edges`. You can extract this via:
```typescript
const { nodes, edges } = useWorkflowContext();
const workflowJson = JSON.stringify({ nodes, edges });
```

### 2. Execution Engine Replacement
The core logic resides in `src/modules/workflow/services/ExecutionEngine.ts`. 

**Current Logic (Mock):**
```typescript
// Inside executeNode()
if (node.type === 'api_request') {
    // Returns fake data
    output = { users: [...] }; 
}
```

**Real Implementation (To-Do):**
You should move the execution logic to the backend. The frontend `ExecutionEngine` should primarily:
1.  Send the `inputMessage` + `workflowId` to the backend.
2.  Receive a stream of "events" (Node Started, Node Finished) via WebSocket or SSE.
3.  Update the UI based on these events.

**Recommended API Endpoints:**

#### `POST /api/workflows`
Save the workflow JSON.
```json
{
  "name": "My Chat Flow",
  "nodes": [...],
  "edges": [...]
}
```

#### `POST /api/workflows/:id/execute`
Run the workflow.
```json
{
  "input": "User message here"
}
```
**Response (Streaming/SSE):**
```json
{ "event": "node_start", "nodeId": "1" }
{ "event": "node_finish", "nodeId": "1", "output": {...} }
...
```

### 3. Where to Modify Code
-   **`ExecutionEngine.ts`**: Replace the `run()` method to call your API instead of traversing the graph locally.
-   **`AIProcessNode`**: Currently mocks AI responses. Connect this to OpenAI/Gemini API on your backend.
-   **`ApiRequestNode`**: Currently mocks `randomuser.me`. Ensure your backend acts as a proxy if you want to avoid CORS issues from the browser.

## 📦 Tech Stack
-   **React 18** + **Vite**
-   **@xyflow/react** (React Flow)
-   **Tailwind CSS**
-   **Shadcn/UI** (Sheet, Cards, Forms)
-   **Lucide React** (Icons)
