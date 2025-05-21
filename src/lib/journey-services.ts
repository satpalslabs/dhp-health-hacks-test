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
import { filterValues } from "@/components/cms/journey/journey-overview/journey-unit-view/step-modal";
import { ArticleStep, JourneyData, JourneyStep, MultiSelectStep, PairStep, SingleSelectStep, StepCollection, StepSection, StepSource, StepSubSection, VideoStep } from "@/types";

// Fetch a journey by its ID
export async function getJourneyById(id: number): Promise<JourneyData | undefined> {
  return data.find((item) => item.id === id) as JourneyData | undefined;
}

// Fetch all journeys
export async function getJourneys(): Promise<JourneyData[]> {
  return data as JourneyData[];
}

// Handle journey deletion by removing the item with the given ID
export async function handleJourneyDeletion(data: JourneyData[], id: number | null): Promise<JourneyData[]> {
  return data.filter((item) => item.id !== id); // More efficient than splicing
}

// Fetch all video steps
export async function getVideos(): Promise<VideoStep[]> {
  return videoStepsData as VideoStep[];
}

// Fetch all article steps
export async function getArticles(): Promise<ArticleStep[]> {
  return articleStepsData as ArticleStep[];
}

// Fetch all multi-select steps
export async function getMultiSelect(): Promise<MultiSelectStep[]> {
  return multiSelectStepsData as MultiSelectStep[];
}

// Fetch all single-select steps
export async function getSingleSelect(): Promise<SingleSelectStep[]> {
  return singleSelectStepsData as SingleSelectStep[];
}

// Fetch all pair steps
export async function getPairs(): Promise<PairStep[]> {
  return pairs as PairStep[];
}

// Fetch all step sections
export async function getSections(): Promise<StepSection[]> {
  return stepSections as StepSection[];
}

// Fetch a section by its ID
export async function getSectionById(id: number): Promise<StepSection | undefined> {
  return stepSections.find((section) => section.id === id);
}

// Fetch all sub-sections
export async function getSubSections(): Promise<StepSubSection[]> {
  return subSections as StepSubSection[];
}

// Fetch a sub-section by its ID
export async function getSubSectionById(id: number): Promise<StepSubSection | undefined> {
  return subSections.find((sub_section) => sub_section.id === id);
}

// Fetch all collections
export async function getCollections(): Promise<StepCollection[]> {
  return collections as StepCollection[];
}

// Fetch a collection by its ID
export async function getCollectionById(id: number): Promise<StepCollection | undefined> {
  return collections.find((collection) => collection.id === id);
}

// Fetch all sources
export async function getSources(): Promise<StepSource[]> {
  return sources as StepSource[];
}

//Fetch filtered steps 
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

