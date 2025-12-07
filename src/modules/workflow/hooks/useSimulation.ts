import { useState, useCallback } from "react";
import {
  ExecutionEngine,
  type ExecutionLog,
} from "../services/ExecutionEngine";
import type { WorkflowNode } from "../types/Workflow";
import { useWorkflowContext } from "../context/WorkflowContext";

export const useSimulation = () => {
  const { nodes, edges, setNodes } = useWorkflowContext();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(
    async (message: string) => {
      // Reset statuses
      setNodes((nds) =>
        nds.map(
          (n) =>
            ({
              ...n,
              data: { ...n.data, executionStatus: undefined },
            } as WorkflowNode)
        )
      );

      const engine = new ExecutionEngine(nodes, edges, (nodeId, status) => {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === nodeId) {
              return {
                ...n,
                data: { ...n.data, executionStatus: status },
              } as WorkflowNode;
            }
            return n;
          })
        );
      });

      setIsRunning(true);
      setLogs([]);

      try {
        const resultLogs = await engine.run(message);
        setLogs(resultLogs);
      } catch (e) {
        console.error("Simulation error", e);
      } finally {
        setIsRunning(false);
      }
    },
    [nodes, edges, setNodes]
  );

  return { runSimulation, logs, isRunning };
};
