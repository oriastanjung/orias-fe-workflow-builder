import React, {
  createContext,
  useContext,
  type ReactNode,
  useCallback,
} from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  ReactFlowProvider,
} from "@xyflow/react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import type { WorkflowNode } from "../types/Workflow";

interface WorkflowContextType {
  nodes: WorkflowNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error(
      "useWorkflowContext must be used within a WorkflowProvider"
    );
  }
  return context;
};

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges as Edge[]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <WorkflowContext.Provider
        value={{
          nodes: nodes as WorkflowNode[],
          edges,
          onNodesChange,
          onEdgesChange,
          onConnect,
          setNodes: setNodes as React.Dispatch<
            React.SetStateAction<WorkflowNode[]>
          >,
          setEdges,
        }}
      >
        {children}
      </WorkflowContext.Provider>
    </ReactFlowProvider>
  );
};
