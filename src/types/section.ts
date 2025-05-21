import { Collection, commonFields, HealthCondition, Icon } from ".";
import { DetailedSubSection, SubSection } from "./sub-section";

interface Section extends commonFields {
    section_name: string
    section_description?: string | null;
    position?: number | null;
    _status?: 'published' | 'draft' | 'unpublished';
    section_icon?: Icon;
    view_type: "grid" | "horizontal" | "vertical" | null;
    section_type?: string,
    collections: number[];
    sub_sections: SubSection[]
    associated_conditions: HealthCondition[]
}

interface APIBodySection extends Omit<Section, 'associated_conditions' | "section_icon" | "sub_sections"> {
    associated_conditions: number[];
    sub_sections: number[];
    section_icon: number | null
}


interface DetailedSection extends Omit<Section, "collections" | "sub_sections"> {
    collections: Collection[];
    sub_sections: DetailedSubSection[]
}

export type { Section, APIBodySection, DetailedSection }