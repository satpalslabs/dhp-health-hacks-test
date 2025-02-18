"use server"
import data from "@/lib/static-data/journey-data.json";

export interface JourneyData {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  "primary-color": string;
  "background-color": string;
  sections: JourneySection[];
}

export interface JourneySection {
  id: number;
  title: string;
  units: JourneyUnit[];
}

export interface JourneyUnit {
  id: number;
  title: string;
  "heart-points": number;
  gems: number;
  published: boolean;
  steps: JourneyStep[];
}

/** Common structure for all journey steps */
interface BaseStep {
  id: number;
  title: string;
  type: "video" | "article" | "pair" | "multi-select" | "single-select"; // Added 'multi-select' and 'single-select'
}

/** Different step types */
export interface VideoStep extends BaseStep {
  type: "video";
  source: string;
  url: string;
  description: string;
}

export interface ArticleStep extends BaseStep {
  type: "article";
  articles: {
    title: string;
    description: string;
  }[];
}

export interface PairStep extends BaseStep {
  type: "pair";
  pairs: { // Changed 'options' to 'pairs'
    id: number;
    option: string;
    match: string;
  }[];
}


export interface MultiSelectStep extends BaseStep {
  type: "multi-select";
  options: {
    text: string; // Changed 'option' to 'text'
    isCorrect: boolean;
  }[];
}

export interface SingleSelectStep extends BaseStep {
  type: "single-select";
  options: {
    text: string; // Changed 'option' to 'text'
    isCorrect: boolean;
  }[];
}

/** Union type for steps */
export type JourneyStep = VideoStep | ArticleStep | PairStep | MultiSelectStep | SingleSelectStep; // Added MultiSelectStep and SingleSelectStep


export async function getJourneyById(id: number): Promise<JourneyData | undefined> {
  const result: JourneyData | undefined = data.find((item) => item.id === id) as JourneyData;
  return result;

}

export async function getJourneys(): Promise<JourneyData[]> {
  return data as JourneyData[];
}


export async function handleJourneyDeletion(data: JourneyData[], id: number | null): Promise<JourneyData[]> {
  const selectedRowIndex = data.findIndex((item) => item.id === id);
  const newData = [...data];
  newData.splice(selectedRowIndex, 1);
  return newData;
}
