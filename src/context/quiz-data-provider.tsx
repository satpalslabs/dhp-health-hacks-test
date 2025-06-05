"use client";

import { Quiz } from "@/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

// Define the context type
export interface QuizContextType {
  quizzes: Quiz[];
  updateQuizzes: Dispatch<SetStateAction<Quiz[]>>;
}

// Create context with an initial value of null
export const QuizContext = createContext<QuizContextType>({
  quizzes: [],
  updateQuizzes: () => {},
});

const QuizDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        updateQuizzes: setQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizDataProvider;
