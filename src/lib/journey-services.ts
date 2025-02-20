"use server"
import data from "@/lib/static-data/journey-data.json";
import videoStepsData from "@/lib/static-data/videos.json";
import articleStepsData from "@/lib/static-data/articles.json";
import stepSections from "@/lib/static-data/sections.json";
import subSections from "@/lib/static-data/sub-sections.json";
import collections from "@/lib/static-data/collections.json"
import sources from "@/lib/static-data/sources.json"
import multiSelectStepsData from "@/lib/static-data/multi-select.json"
import singleSelectStepsData from "@/lib/static-data/single-select.json";
import pairs from "@/lib/static-data/pairs.json";
import { filterValues } from "@/components/journey/journey-sections/journey-unit/step-modal";

export interface JourneyData {
  id: number;
  title: string;
  _status: "published" | "draft" | "unpublished";
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
  collection: number[]
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
  source: string;
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

export interface StepSection {
  id: number
  section_name: string;
  section_description: string;
}
export interface StepSource {
  id: number
  name: string;
  website_url: string;
}

export interface StepSubSection {
  id: number
  subsection_name: string;
  section: number[];
  subsection_description: string;
}
export interface StepCollection {
  id: number
  collection_name: string;
  section: number[];
  sub_section: number[];
  collection_description: string;
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


export async function getVideos(): Promise<VideoStep[]> {
  return videoStepsData as VideoStep[];
}

export async function getArticles(): Promise<ArticleStep[]> {
  return articleStepsData as ArticleStep[];
}

export async function getMultiSelect(): Promise<MultiSelectStep[]> {
  return multiSelectStepsData as MultiSelectStep[];
}

export async function getSingleSelect(): Promise<SingleSelectStep[]> {
  return singleSelectStepsData as SingleSelectStep[];
}
export async function getPairs(): Promise<PairStep[]> {
  return pairs as PairStep[];
}

export async function getSections(): Promise<StepSection[]> {
  return stepSections as StepSection[];
}
export async function getSectionById(id: number): Promise<StepSection | undefined> {
  return stepSections.find(section => section.id == id);
}

export async function getSubSections(): Promise<StepSubSection[]> {
  return subSections as StepSubSection[];
}

export async function getSubSectionById(id: number): Promise<StepSubSection | undefined> {
  return subSections.find(sub_section => sub_section.id == id)
}

export async function getCollections(): Promise<StepCollection[]> {
  return collections as StepCollection[];
}
export async function getCollectionById(id: number): Promise<StepCollection | undefined> {
  return collections.find(collection => collection.id == id);
}
export async function getSources(): Promise<StepSource[]> {
  return sources as StepSource[];
}

export async function getFilteredSteps(
  filters: filterValues,
  filterOnType: "videos" | "articles" | "pairs" | "multi-select" | "single-select" | undefined
): Promise<JourneyStep[]> {

  // Fetch data based on type
  const list = await (async () => {
    switch (filterOnType) {
      case "videos": return getVideos();
      case "articles": return getArticles();
      case "multi-select": return getMultiSelect();
      case "single-select": return getSingleSelect();
      case "pairs": return getPairs();
      default: return [];
    }
  })();

  if (!filters.section && !filters.sub_section && !filters.collection && !filters.source) {
    return list; // No filters applied, return full list
  }

  const filteredData: JourneyStep[] = [];

  // Process filtering
  for (const item of list) {
    let includeItem = false;

    // Fetch all collection details in parallel
    const collections = await Promise.all(item.collection.map(getCollectionById));

    for (const collection of collections) {
      if (!collection) continue;

      // SECTION FILTERING
      if (filters.section) {
        includeItem =
          collection.section.includes(filters.section.id) ||
          (await Promise.all(
            collection.sub_section.map(getSubSectionById)
          )).some(sub => sub?.section.includes(filters.section!.id));

      }

      // SUB-SECTION FILTERING
      if (filters.sub_section) {
        includeItem = collection.sub_section.includes(filters.sub_section.id);
      }

      // COLLECTION FILTERING
      if (filters.collection) {
        includeItem = item.collection.includes(filters.collection.id);
      }

    }
    // SOURCE FILTERING
    if (filters.source && "source" in item) {
      includeItem = filters.source.name === item.source; // Keep item if source matches
    }

    if (includeItem) filteredData.push(item);
  }

  return filteredData;
}

