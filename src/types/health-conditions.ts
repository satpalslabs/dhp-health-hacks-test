import { commonFields } from ".";

interface HealthCondition extends commonFields {
    name: string;
    description: string | null;
    tips: number[]
    tips_categories: number[]
};
export type { HealthCondition }