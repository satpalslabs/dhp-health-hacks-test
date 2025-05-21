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

