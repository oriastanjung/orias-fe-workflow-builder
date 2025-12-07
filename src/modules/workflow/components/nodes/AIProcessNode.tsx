import { Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNode, AIProcessNodeData } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { Bot } from "lucide-react";

export const AIProcessNode = ({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) => {
  const aiData = data as AIProcessNodeData;

  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="AI Process"
      icon={Bot}
      handles={{ source: [Position.Right], target: [Position.Left] }}
      className="border-purple-500/50 bg-purple-50/10"
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "ai_process" },
          })
        )
      }
    >
      <div className="flex flex-col gap-1">
        <div className="text-xs bg-muted p-2 rounded truncate max-w-[200px]">
          {aiData.prompt || "No prompt..."}
        </div>
        {aiData.schema && Object.keys(aiData.schema).length > 0 && (
          <div className="text-[10px] text-muted-foreground mt-1">
            Output: {Object.keys(aiData.schema).length} fields
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};
