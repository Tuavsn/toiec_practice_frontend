// QuestionContext.tsx
import React, { createContext, useContext, useState } from 'react';

type TestQuestionContextType = {
  questions?: any[];
  setQuestions: (questions: any[]) => void;
};

const TestQuestionContext = createContext<TestQuestionContextType>({
  setQuestions: () => {},
});

export const TestQuestionProvider: React.FC<{children: React.ReactNode}> = ({ children }:{children: React.ReactNode}) => {
  const [questions, setQuestions] = useState<any[]>([]);

  return (
    <TestQuestionContext.Provider value={{ questions, setQuestions }}>
      {children}
    </TestQuestionContext.Provider>
  );
};

export const useQuestions = () => useContext(TestQuestionContext);
