import { Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { Square } from "lucide-react";

export const EndNode = ({ id, data, selected }: NodeProps<WorkflowNode>) => {
  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="End"
      icon={Square}
      handles={{ source: [], target: [Position.Left] }}
      className="border-red-500/50 bg-red-50/10"
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "end" },
          })
        )
      }
    >
      <p>Flow ends here</p>
    </NodeWrapper>
  );
};
