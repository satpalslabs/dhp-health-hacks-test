import { Icon } from "./article";
import { commonFields } from ".";

type months = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

export interface Pack extends commonFields {
    id: number;
    name: string;
    description: string | null;
    tips: number[];
    quizzes: number[];
    icon: Icon | null;
    type: "tip-pack" | "quiz-pack";
    featured?: boolean,
    title_and_body_color?: string;
    category_and_button_color?: string;
    background_color?: string;
    months?: months[];
    _status: "published" | "draft" | "unpublished";
    collection: number;
    bg_image: Icon | null;
    associated_conditions?: number[]
};
export interface Tip extends commonFields {
    title: string;
    description?: string | null;
    tips_categories: number[]
    videos?: number[];
    articles?: number[];
    featured?: boolean;
    associated_conditions?: number[]
};