"use client";

import { Article } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface ArticleContextType {
  articles: Article[];
  updateArticles: (e: Article[]) => void;
}

// Create context with an initial value of null
export const ArticleContext = createContext<ArticleContextType>({
  articles: [],
  updateArticles: () => {},
});

const ArticleDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  function updateArticles(_articles: Article[]) {
    setArticles(_articles);
  }

  return (
    <ArticleContext.Provider
      value={{
        articles,
        updateArticles,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleDataProvider;
