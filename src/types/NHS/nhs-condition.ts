import { commonFields } from "..";

export interface NHSCondition extends commonFields {
    url: string;
    name: string;
    description: string;
    articleStatus: "published" | "draft" | "unpublished";
    genre: string[]

}