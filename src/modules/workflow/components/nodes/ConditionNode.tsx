import { Position, Handle, type NodeProps } from "@xyflow/react";
import type { WorkflowNode, ConditionNodeData } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { Split } from "lucide-react";

export const ConditionNode = ({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) => {
  const condData = data as ConditionNodeData;

  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="Condition"
      icon={Split}
      handles={{ source: [], target: [Position.Left] }} // Custom handles manually placed
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "condition" },
          })
        )
      }
    >
      <div className="bg-muted p-2 rounded-md font-mono text-xs mb-2 truncate">
        if ({condData.condition || "..."})
      </div>

      <div className="flex flex-col gap-4 absolute -right-3 top-4">
        <div className="relative">
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!bg-green-500 w-3 h-3 border-2 border-background"
            style={{ right: "-6px", top: "0" }}
          />
          <span className="absolute right-5 top-[-8px] text-[10px] text-green-600 font-bold">
            TRUE
          </span>
        </div>

        <div className="relative mt-6">
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!bg-red-500 w-3 h-3 border-2 border-background"
            style={{ right: "-6px", top: "0" }}
          />
          <span className="absolute right-5 top-[-6px] text-[10px] text-red-600 font-bold">
            FALSE
          </span>
        </div>
      </div>
    </NodeWrapper>
  );
};
