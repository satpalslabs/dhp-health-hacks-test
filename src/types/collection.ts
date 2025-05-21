import { Article, commonFields, HealthCondition, SubSection, Section, Icon } from ".";

interface Collection extends commonFields {
    collection_name: string,
    collection_description: string | null;
    _status?: 'published' | 'draft' | 'unpublished';
    bg_color?: string | null,
    position?: number | null;
    collection_icon: Icon | null;
    section: Section | null;
    sub_section: SubSection | null;
    title_color?: string | null,
    articles: Article[];
    videos: Article[];
    associated_conditions: HealthCondition[];
    view_type: "grid" | "horizontal" | "vertical" | null;
}
interface ApiBodyCollection extends commonFields {
    collection_name: string,
    collection_description?: string | null;
    _status?: 'published' | 'draft' | 'unpublished';
    bg_color?: string | null,
    title_color?: string | null,
    position?: number | null;
    collection_icon: number | null;
    section?: number | null;
    sub_section?: number | null;
    view_type: "grid" | "horizontal" | "vertical" | null;
    articles: number[];
    videos: number[];
    associated_conditions?: number[];
}
export type { ApiBodyCollection, Collection }