import React, { useState, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { WorkflowProvider } from "./context/WorkflowContext";
import { Sidebar } from "./components/Sidebar";
import { WorkflowCanvas } from "./components/WorkflowCanvas";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import type {
  WorkflowNode,
  MessageNodeData,
  ApiRequestNodeData,
  ConditionNodeData,
  AIProcessNodeData,
} from "./types/Workflow";
import { useWorkflowContext } from "./context/WorkflowContext";

export const WorkflowEditorPage: React.FC = () => {
  return (
    <WorkflowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 h-full relative">
          <WorkflowCanvas />
          <NodePropertiesSheet />
        </div>
      </div>
    </WorkflowProvider>
  );
};

const NodePropertiesSheet = () => {
  const { nodes: contextNodes, setNodes } = useWorkflowContext();
  const [currentNode, setCurrentNode] = useState<WorkflowNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event from NodeWrapper
  useEffect(() => {
    const handleOpenProperties = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; type: string }>;

      const node = contextNodes.find((n) => n.id === customEvent.detail.id);

      if (node) {
        setCurrentNode(node);
        setIsOpen(true);
      }
    };

    document.addEventListener("open-node-properties", handleOpenProperties);
    return () => {
      document.removeEventListener(
        "open-node-properties",
        handleOpenProperties
      );
    };
  }, [contextNodes]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNode) return;

    setNodes((nodes) =>
      nodes.map((n) => (n.id === currentNode!.id ? currentNode : n))
    );
    setIsOpen(false);
  };

  const updateData = (key: string, value: any) => {
    if (!currentNode) return;
    setCurrentNode({
      ...currentNode,
      data: {
        ...currentNode.data,
        [key]: value,
      },
    });
  };

  if (!currentNode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit {currentNode.data.label}</SheetTitle>
          <SheetDescription>
            Configure properties for {currentNode.type}.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={currentNode.data.label || ""}
              onChange={(e) => updateData("label", e.target.value)}
            />
          </div>

          {currentNode.type === "message" && (
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={(currentNode.data as MessageNodeData).message || ""}
                onChange={(e) => updateData("message", e.target.value)}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
          )}

          {currentNode.type === "condition" && (
            <div className="space-y-2">
              <Label>Condition (Contains)</Label>
              <Input
                value={(currentNode.data as ConditionNodeData).condition || ""}
                onChange={(e) => updateData("condition", e.target.value)}
                placeholder="e.g. 'hello'"
              />
              <p className="text-xs text-muted-foreground">
                Evaluates TRUE if user input contains this text.
              </p>
            </div>
          )}

          {currentNode.type === "api_request" && (
            <>
              <div className="space-y-2">
                <Label>Method</Label>
                <Select
                  value={
                    (currentNode.data as ApiRequestNodeData).method || "GET"
                  }
                  onValueChange={(val) => updateData("method", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={(currentNode.data as ApiRequestNodeData).url || ""}
                  onChange={(e) => updateData("url", e.target.value)}
                  placeholder="https://api.example.com/v1/..."
                />
              </div>
            </>
          )}

          {currentNode.type === "ai_process" && (
            <AIProperties
              data={currentNode.data as AIProcessNodeData}
              onChange={(newData) =>
                setCurrentNode({ ...currentNode, data: newData })
              }
            />
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const AIProperties = ({
  data,
  onChange,
}: {
  data: AIProcessNodeData;
  onChange: (d: AIProcessNodeData) => void;
}) => {
  const addSchemaField = () => {
    const newSchema = { ...data.schema, [`field_${Date.now()}`]: "string" };
    onChange({ ...data, schema: newSchema });
  };

  const removeSchemaField = (key: string) => {
    const newSchema = { ...data.schema };
    delete newSchema[key];
    onChange({ ...data, schema: newSchema });
  };

  const updateSchemaFieldKey = (oldKey: string, newKey: string) => {
    if (!newKey) return;
    const newSchema = { ...data.schema };
    const val = newSchema[oldKey];
    delete newSchema[oldKey];
    newSchema[newKey] = val;
    onChange({ ...data, schema: newSchema });
  };

  const updateSchemaFieldType = (key: string, type: string) => {
    const newSchema = { ...data.schema, [key]: type };
    onChange({ ...data, schema: newSchema });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={data.prompt || ""}
          onChange={(e) => onChange({ ...data, prompt: e.target.value })}
          placeholder="Describe what the AI should do..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Output Type</Label>
        <Select
          value={data.outputType || "text"}
          onValueChange={(val: any) => onChange({ ...data, outputType: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text (String)</SelectItem>
            <SelectItem value="json">Structured (JSON)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.outputType === "json" && (
        <div className="space-y-2 p-3 bg-muted rounded-md border">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase">Schema Fields</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 w-6"
              onClick={addSchemaField}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Separator />
          <div className="space-y-2 mt-2">
            {data.schema &&
              Object.entries(data.schema).map(([key, type]) => (
                <div key={key} className="flex gap-2 items-center">
                  <Input
                    className="h-8 text-xs"
                    value={key}
                    onChange={(e) => updateSchemaFieldKey(key, e.target.value)}
                    placeholder="Field name"
                  />
                  <Select
                    value={type}
                    onValueChange={(t) => updateSchemaFieldType(key, t)}
                  >
                    <SelectTrigger className="h-8 w-[100px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="array">Array</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0 text-destructive"
                    onClick={() => removeSchemaField(key)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            {(!data.schema || Object.keys(data.schema).length === 0) && (
              <p className="text-[10px] text-muted-foreground italic">
                No fields defined.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
