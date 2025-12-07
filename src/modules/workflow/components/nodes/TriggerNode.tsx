import { Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { Zap } from "lucide-react";

export const TriggerNode = ({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) => {
  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="Trigger"
      icon={Zap}
      handles={{ source: [Position.Right], target: [] }}
      className="border-yellow-500/50"
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "trigger" },
          })
        )
      }
    >
      <p>Flow starts here</p>
    </NodeWrapper>
  );
};
