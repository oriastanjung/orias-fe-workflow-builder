import React from "react";
import { MessageSquare, Zap, Split, Globe, Square, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowNodeType } from "../types/Workflow";

export const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card className="w-64 h-full border-r rounded-none shrink-0 overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
          Nodes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-xs font-bold text-muted-foreground mt-2 mb-1">
          Essentials
        </div>
        <DraggableNode
          type="trigger"
          label="Trigger"
          icon={Zap}
          onDragStart={onDragStart}
        />
        <DraggableNode
          type="end"
          label="End"
          icon={Square}
          onDragStart={onDragStart}
        />

        <div className="text-xs font-bold text-muted-foreground mt-4 mb-1">
          Actions
        </div>
        <DraggableNode
          type="message"
          label="Send Message"
          icon={MessageSquare}
          onDragStart={onDragStart}
        />
        <DraggableNode
          type="ai_process"
          label="AI Process"
          icon={Bot}
          onDragStart={onDragStart}
        />

        <div className="text-xs font-bold text-muted-foreground mt-4 mb-1">
          Logic
        </div>
        <DraggableNode
          type="condition"
          label="Condition"
          icon={Split}
          onDragStart={onDragStart}
        />
        <DraggableNode
          type="api_request"
          label="API Request"
          icon={Globe}
          onDragStart={onDragStart}
        />
      </CardContent>
    </Card>
  );
};

interface DraggableNodeProps {
  type: WorkflowNodeType;
  label: string;
  icon: React.ElementType;
  onDragStart: (event: React.DragEvent, nodeType: WorkflowNodeType) => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  label,
  icon: Icon,
  onDragStart,
}) => {
  return (
    <div
      className="flex items-center gap-2 p-3 text-sm bg-background border rounded-md cursor-grab hover:bg-muted transition-colors shadow-sm"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{label}</span>
    </div>
  );
};
