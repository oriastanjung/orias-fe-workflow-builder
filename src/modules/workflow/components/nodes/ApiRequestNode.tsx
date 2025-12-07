import type { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import type { WorkflowNode, ApiRequestNodeData } from "../../types/Workflow";
import { NodeWrapper } from "./NodeWrapper";
import { Globe } from "lucide-react";

export const ApiRequestNode = ({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) => {
  const apiData = data as ApiRequestNodeData;

  return (
    <NodeWrapper
      id={id}
      data={data}
      selected={selected}
      title="API Request"
      icon={Globe}
      handles={{ source: [Position.Right], target: [Position.Left] }}
      onEdit={() =>
        document.dispatchEvent(
          new CustomEvent("open-node-properties", {
            detail: { id, type: "api_request" },
          })
        )
      }
    >
      <div className="flex bg-muted p-2 rounded-md text-xs gap-2 items-center">
        <span
          className={`font-bold ${
            apiData.method === "GET"
              ? "text-blue-500"
              : apiData.method === "POST"
              ? "text-green-500"
              : apiData.method === "DELETE"
              ? "text-red-500"
              : "text-orange-500"
          }`}
        >
          {apiData.method || "GET"}
        </span>
        <span className="truncate max-w-[150px]">
          {apiData.url || "/api/..."}
        </span>
      </div>
    </NodeWrapper>
  );
};
