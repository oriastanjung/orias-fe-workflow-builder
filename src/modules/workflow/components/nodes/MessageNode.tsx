import type { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import type { WorkflowNode, MessageNodeData } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { MessageSquare } from "lucide-react";

export const MessageNode = ({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) => {
  const msgData = data as MessageNodeData;

  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="Send Message"
      icon={MessageSquare}
      handles={{ source: [Position.Right], target: [Position.Left] }}
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "message" },
          })
        )
      }
    >
      <div className="bg-muted p-2 rounded-md italic truncate">
        "{msgData.message || "No message set"}"
      </div>
    </NodeWrapper>
  );
};
