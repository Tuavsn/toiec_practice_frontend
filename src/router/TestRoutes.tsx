// TestRouteComponent.tsx

import React from "react";
import { Route, Routes } from "react-router-dom";
import { TestQuestionProvider } from "../context/TestQuestionProvider";
const DoTestPage = React.lazy(() => import("../pages/DoTestPage/DoTestPage"));
const TestDetailPage = React.lazy(() => import("../pages/TestDetailPage/TestDetailPage"));
const TestPage = React.lazy(() => import("../pages/TestPage/TestPage"));




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
