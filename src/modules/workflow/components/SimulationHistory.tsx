import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExecutionLog } from "../services/ExecutionEngine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimulationHistoryProps {
  logs: ExecutionLog[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimulationHistory: React.FC<SimulationHistoryProps> = ({
  logs,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px] sm:w-[600px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Simulation History</SheetTitle>
          <SheetDescription>
            Step-by-step execution logs of the latest run.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] px-6 pb-6">
          <div className="space-y-6 mt-4">
            {logs.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-10">
                No logs available. Run a simulation first.
              </div>
            )}

            {logs.map((log, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-sm bg-card"
              >
                <div className="bg-muted/50 p-3 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        log.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : log.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : log.status === "running"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-sm font-medium">{log.nodeId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-3 space-y-3">
                  {log.message && (
                    <div className="text-sm text-foreground font-medium">
                      {log.message}
                    </div>
                  )}

                  {log.ioData && (log.ioData.input || log.ioData.output) && (
                    <Tabs defaultValue="output" className="w-full">
                      <TabsList className="h-6 w-full justify-start bg-transparent p-0 gap-2 border-b rounded-none mb-2">
                        <TabsTrigger
                          value="input"
                          className="h-6 text-xs px-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-t-sm"
                        >
                          Input
                        </TabsTrigger>
                        <TabsTrigger
                          value="output"
                          className="h-6 text-xs px-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-t-sm"
                        >
                          Output
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="input" className="mt-0">
                        <div className="bg-slate-950 text-slate-50 p-2 rounded-md text-[10px] font-mono overflow-auto max-h-[150px]">
                          <pre>{JSON.stringify(log.ioData.input, null, 2)}</pre>
                        </div>
                      </TabsContent>
                      <TabsContent value="output" className="mt-0">
                        <div className="bg-slate-950 text-slate-50 p-2 rounded-md text-[10px] font-mono overflow-auto max-h-[150px]">
                          <pre>
                            {JSON.stringify(log.ioData.output, null, 2)}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
