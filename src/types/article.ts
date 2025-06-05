import { Collection, commonFields, Tip, WebpageComponent } from ".";

type Answer = selectOption | pairOption

type selectOption = {
    id?: number;
    answer: string;
    is_correct_answer: boolean;
};
type pairOption = {
    id?: number;
    answer: string;
    match: string;
};

interface Icon extends commonFields {
    url: string;
    size: number;
    mime: string;
    height: number;
    width: number;
    name: string;
}

interface Quiz extends commonFields {
    question: string;
    type: "multi-select" | "single-select" | "pair"; // Assuming these are possible types
    answers: Answer[];
    videos?: number[];
    articles?: number[];
};

interface ContentProvider extends commonFields {
    name: string;
    website_url?: string | null;
    logo?: Icon | null
};

interface ContentType extends commonFields {
    type: "content-webpage" | "content-page" | "content-video" | "article-cards";
    description?: string;
};

interface AssociatedConditions extends commonFields {
    name: string;
    description: string;
    locale: string;
};

interface Article extends commonFields {
    old_id: number | null;
    status: 'Draft' | 'Rejected' | 'Submitted for Review' | "Approved" | "Published" | "Unpublished" | null;
    title?: string;
    description?: string;
    url?: string | null;
    article_pc_id?: string | null;
    quiz: Quiz[];
    tips: Tip[]
    content: WebpageComponent[]; // Assuming this might be an array of objects or strings
    thumbnail_icon?: Icon | null;
    cover_image?: Icon | null;
    content_type?: ContentType;
    collection: Collection | null;
    cards?: {
        title: string;
        description?: string;
    }[];
    video_duration?: string | null;
    source?: ContentProvider | null;
    key_points?: string | null;
    associated_conditions?: AssociatedConditions;
    sub_section?: number | null;
    section?: number | null;
    "background-color"?: string;
    "title-color"?: string;

};

type FormBodyContent = WebpageComponent & {
    icon?: number[] | null;
    user_photo?: number[] | null;
    video?: number[] | null;
    bg_image?: number[] | null;
    image?: number[] | null;
};

interface FormBodyArticle extends commonFields {
    old_id: number | null;
    status: 'Draft' | 'Rejected' | 'Submitted for Review' | "Approved" | "Published" | "Unpublished" | null;
    title: string;
    url?: string | null;
    article_pc_id?: string | null;
    quiz: number[];
    tips: number[]
    content: FormBodyContent[]; // Assuming this might be an array of objects or strings
    thumbnail_icon: number[] | null;
    cover_image?: Icon | null;
    content_type: "content-webpage" | "content-page" | "content-video" | "article-cards";
    description?: string | null;
    collection: number | null;
    key_points?: string;
    cards?: {
        title: string;
        description?: string;
    }[];
    video_duration?: string | null;
    source?: number | null;
    associated_conditions?: AssociatedConditions;
    // New fields
    sub_section?: number | null;
    section?: number | null;
    "background-color"?: string;
    "title-color"?: string;
}

export type { FormBodyArticle, FormBodyContent, Article, Answer, selectOption, pairOption, Icon, Quiz, ContentProvider, ContentType, AssociatedConditions }