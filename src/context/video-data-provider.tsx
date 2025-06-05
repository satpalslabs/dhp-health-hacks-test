"use client";

import { Article } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface VideoContextType {
  videos: Article[];
  updateVideos: (e: Article[]) => void;
}

// Create context with an initial value of null
export const VideoContext = createContext<VideoContextType>({
  videos: [],
  updateVideos: () => {},
});

const VideoDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [videos, setVideos] = useState<Article[]>([]);

  function updateVideos(_videos: Article[]) {
    setVideos(_videos);
  }

  return (
    <VideoContext.Provider
      value={{
        videos,
        updateVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoDataProvider;
