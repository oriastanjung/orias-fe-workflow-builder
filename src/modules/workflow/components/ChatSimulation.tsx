import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, Loader2, History } from "lucide-react";
import { useSimulation } from "../hooks/useSimulation";
import { SimulationHistory } from "./SimulationHistory";

export const ChatSimulation: React.FC = () => {
  const { runSimulation, logs, isRunning } = useSimulation();
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() || isRunning) return;
    runSimulation(input);
    setInput("");
  };

  // Auto scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <Card className="absolute bottom-4 right-4 w-80 h-96 flex flex-col shadow-xl z-50">
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Simulation</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowHistory(true)}
          >
            <History className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          {logs.length === 0 && !isRunning && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs p-4 text-center">
              Start a chat to test the flow.
            </div>
          )}
          <ScrollArea className="h-full p-3" ref={scrollRef}>
            <div className="space-y-2">
              {logs
                .filter((l) => l.message)
                .map((log, i) => (
                  <div
                    key={i}
                    className={`text-xs p-2 rounded mb-1 ${
                      log.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-muted"
                    }`}
                  >
                    <span className="font-bold mr-1">[{log.nodeId}]</span>
                    {log.message}
                  </div>
                ))}
              {isRunning && (
                <div className="flex justify-center p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-2 border-t flex gap-2">
          <Input
            placeholder="Type a message..."
            className="h-8 text-xs"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isRunning}
          />
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={handleSend}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <PlayCircle className="w-3 h-3" />
            )}
          </Button>
        </CardFooter>
      </Card>

      <SimulationHistory
        logs={logs}
        isOpen={showHistory}
        onOpenChange={setShowHistory}
      />
    </>
  );
};
