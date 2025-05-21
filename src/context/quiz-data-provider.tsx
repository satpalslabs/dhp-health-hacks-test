"use client";

import { Quiz } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface QuizContextType {
  quizzes: Quiz[];
  updateQuizzes: (e: Quiz[]) => void;
}

// Create context with an initial value of null
export const QuizContext = createContext<QuizContextType>({
  quizzes: [],
  updateQuizzes: () => {},
});

const QuizDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  function updateQuizzes(_quizzes: Quiz[]) {
    setQuizzes(_quizzes);
  }

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        updateQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizDataProvider;
