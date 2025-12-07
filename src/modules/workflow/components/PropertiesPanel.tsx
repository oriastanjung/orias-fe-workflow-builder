import React from "react";

export const PropertiesPanel: React.FC = () => {
  return (
    <aside className="w-[300px] border-l bg-muted/20 p-4">
      <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Properties
      </div>
      <div className="text-sm text-muted-foreground italic">
        Select a node to edit its properties.
      </div>
    </aside>
  );
};
