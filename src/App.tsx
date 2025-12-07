import { Navigate, Route, Routes } from "react-router-dom";
import { WorkflowEditorPage } from "@/modules/workflow";

import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/editor" />} />
        <Route path="/editor" element={<WorkflowEditorPage />} />
      </Routes>
    </>
  );
};

export default App;
