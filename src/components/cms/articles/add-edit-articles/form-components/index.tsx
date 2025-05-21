import {
  Article,
  Collection,
  HealthCondition,
  Quiz,
  Section,
  ContentProvider,
  Tip,
  Pack,
  SubSection,
  NHSCondition,
} from "@/types";
import { Accept } from "react-dropzone";
import { Control } from "react-hook-form";
import { z } from "zod";

export { ArticleCards } from "./article-cards";
export { GridFields } from "./grid-fields";
export { QuizSection } from "./quiz-section";
export { TipsSection } from "./tip-section";
export { ViewTypSelection } from "./view-type-selection";
export { CardSelectionField } from "./card-selection-field";
export { renderCommonFields } from "./common-fields";
export { DraggableWrapper } from "./draggable-wrapper";
export { FileDropZone } from "./file-dropzone";
export { renderComponent } from "./render-webpage-component";
export { default as SelectField } from "./select-field";
export { ContentFields } from "./webpage-content-fields";

export interface commonProps {
  control: Control<z.infer<z.ZodType>>;
  name: string;
  label: string;
  tooltip: string;
  placeholder?: string;
  required?: boolean;
  accept?: Accept;
  maxSize?: number;
  fieldValue?: z.infer<z.ZodType>;
}

export interface SelectFieldWrapperProps extends commonProps {
  selectType?: "single-select" | "multi-select";
  options: (
    | ContentProvider
    | Section
    | SubSection
    | Collection
    | Article
    | HealthCondition
    | NHSCondition
    | Tip
    | Pack
    | Quiz
  )[];
  onSelect?: (id: number) => void;
  showLoader?: boolean;
}

export interface Option {
  id?: number | null;
  email?: string;
  section_name?: string;
  subsection_name?: string;
  collection_name?: string;
  title?: string;
  name?: string;
  question?: string;
}
