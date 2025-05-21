import { Collection, commonFields, HealthCondition, Icon } from ".";
import { Section } from "./section";

interface SubSection extends commonFields {
    subsection_name: string
    subsection_description: string | null;
    collections: number[];
    _status?: 'published' | 'draft' | 'unpublished';
    section: Section | null;
    subsection_icon?: Icon | null;
    view_type: "grid" | "horizontal" | "vertical" | null;
    bg_color?: string | null,
    associated_conditions: HealthCondition[]
}
interface APIBodySubSection extends Omit<SubSection, 'associated_conditions' | 'section' | "subsection_icon"> {
    section: number | null;
    subsection_icon: number | null;
    associated_conditions: number[]
}

interface DetailedSubSection extends Omit<SubSection, 'associated_conditions' | 'collections'> {
    collections: Collection[];
    bg_color?: string | null,
    associated_conditions: HealthCondition[]
}

export type { SubSection, APIBodySubSection, DetailedSubSection }