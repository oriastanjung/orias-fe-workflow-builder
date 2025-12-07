import type { NodeTypes } from "@xyflow/react";
import { TriggerNode } from "../components/nodes/TriggerNode";
import { MessageNode } from "../components/nodes/MessageNode";
import { ConditionNode } from "../components/nodes/ConditionNode";
import { ApiRequestNode } from "../components/nodes/ApiRequestNode";
import { EndNode } from "../components/nodes/EndNode";
import { AIProcessNode } from "../components/nodes/AIProcessNode";

export const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  api_request: ApiRequestNode,
  end: EndNode,
  ai_process: AIProcessNode,
};
