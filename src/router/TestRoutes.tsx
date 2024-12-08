// TestRouteComponent.tsx

import { Routes, Route } from "react-router-dom";
import { TestQuestionProvider } from "../context/TestQuestionProvider";
import { DoTestPage, TestDetailPage, TestPage } from "../pages/Index";



const TestRoutes: React.FC = () => {
  return (
    <TestQuestionProvider>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path=":id" element={<TestDetailPage />} />
        <Route path=":id/dotest/:time/:testType/:parts" element={<DoTestPage />} />
      </Routes>
    </TestQuestionProvider>
  );
};

export default TestRoutes;
