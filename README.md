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

## 🏛️ Technical Architecture (Backend Integration)

### 1. State Management (TypeScript Types)
When running a workflow, data is passed between nodes. The structure should be consistent:

```typescript
// The state of a single execution step
interface ExecutionLog {
  nodeId: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: number;
  ioData: {
      input: any;   // Data received from previous node
      output: any;  // Data produced by this node
  };
}

// Data passed between nodes
interface WorkflowContextData {
  userId?: string;
  chatHistory: string[];
  variables: Record<string, any>; // Global variables
}
```

### 2. Database Schema (Prisma)

Here are the detailed schema definitions.

#### Option A: PostgreSQL (Relational)
*Note: Prisma does not support Composite Types for PostgreSQL, so strictly typed Nodes are stored as `Json`. You should validate this against the TypeScript interfaces in your API controller.*

```prisma
// schema.prisma

model Workflow {
  id          String   @id @default(uuid())
  name        String
  description String?
  
  // Stored as JSON, but follows the Node/Edge interface structure
  nodes       Json     
  edges       Json     
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  executions  WorkflowExecution[]
}

model WorkflowExecution {
  id          String    @id @default(uuid())
  workflowId  String
  workflow    Workflow  @relation(fields: [workflowId], references: [id])
  status      String    @default("pending") // 'running', 'completed', 'failed'
  
  inputData   Json?     // Initial Trigger Data
  outputData  Json?     // Final End Node Data
  
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  
  logs        ExecutionLog[]
}

model ExecutionLog {
  id            String            @id @default(uuid())
  executionId   String
  execution     WorkflowExecution @relation(fields: [executionId], references: [id])
  
  nodeId        String
  status        String
  inputPayload  Json?
  outputPayload Json?
  errorMessage  String?
  
  createdAt     DateTime          @default(now())
}
```

#### Option B: MongoDB (Document - Recommended)
*MongoDB supports **Composite Attributes**, allowing us to define the strict structure of Nodes and Edges directly in the schema.*

```prisma
// schema.prisma

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --- Composite Types for Strict Structure ---

type WorkflowNode {
  id       String
  type     String    // 'trigger', 'message', 'condition', etc.
  position NodePosition
  data     Json      // Flexible data (label, message, url, etc.)
}

type NodePosition {
  x Float
  y Float
}

type WorkflowEdge {
  id           String
  source       String // Source Node ID
  target       String // Target Node ID
  sourceHandle String? // For Condition nodes ('true'/'false')
}

// --- Collections ---

model Workflow {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  
  nodes       WorkflowNode[] // Array of strictly typed nodes
  edges       WorkflowEdge[] // Array of strictly typed edges
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  executions  WorkflowExecution[]
}

model WorkflowExecution {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  workflowId  String    @db.ObjectId
  workflow    Workflow  @relation(fields: [workflowId], references: [id])
  status      String    @default("pending")
  
  inputData   Json?
  outputData  Json?
  
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  
  logs        ExecutionLog[]
}

model ExecutionLog {
  id            String            @id @default(auto()) @map("_id") @db.ObjectId
  executionId   String            @db.ObjectId
  execution     WorkflowExecution @relation(fields: [executionId], references: [id])
  
  nodeId        String
  status        String
  inputPayload  Json?
  outputPayload Json?
  errorMessage  String?
  
  createdAt     DateTime          @default(now())
}
```

### 3. Real-time Updates (WebSocket / SSE)

To achieve the "Working..." visual effect on the frontend while the backend processes:

**Protocol**: Server-Sent Events (SSE) or WebSockets (`socket.io`).

**Event Flow**:
1.  **Frontend**: Connects to `ws://api.example.com/workflows/:id/stream`.
2.  **Backend**: Begins processing the graph.
3.  **Backend**: Emits updates as each node runs.

**Event Payloads:**

**Node Started:**
```json
{
  "event": "node_update",
  "nodeId": "node-123",
  "status": "running"
}
```
*Frontend Action: Show Blue Loading Spinner.*

**Node Completed:**
```json
{
  "event": "node_update",
  "nodeId": "node-123",
  "status": "completed",
  "output": { "data": "Hello World" }
}
```
*Frontend Action: Show Green Checkmark & Update History Log.*

**Node Failed:**
```json
{
  "event": "node_update",
  "nodeId": "node-123",
  "status": "failed",
  "error": "API Timeout"
}
```
*Frontend Action: Show Red X & Error Message.*

---

## 📦 Tech Stack
-   **React 18** + **Vite**
-   **@xyflow/react** (React Flow)
-   **Tailwind CSS**
-   **Shadcn/UI** (Sheet, Cards, Forms)
-   **Lucide React** (Icons)
