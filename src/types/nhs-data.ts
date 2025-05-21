import { commonFields, NHSCondition } from ".";

export interface NHSApiResponse extends commonFields {
  meta: {
    data: DataType
  };
}

interface DataType extends NHSCondition {
  mainEntityOfPage: {
    "@type": string;
    dateModified: string;
    genre: string[];
  }
}