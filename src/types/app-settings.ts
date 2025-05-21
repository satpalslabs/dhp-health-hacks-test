import { commonFields } from "."

export interface AppSettings extends commonFields {
    name: string,
    description: string,
    appId: string;
    meta: {
        pages: {
            region: string;
            support: string;
            about_app: string;
            sheffield: string;
            manchester: string;
            privacy_policy: string;
            test_app_data_id: string;
            privacy_policy_v2: string;
            privacy_policy_v3: string;
            terms_and_conditions: string;
            terms_and_conditions_v2: string;
            terms_and_conditions_v3: string;
        },
        collections: {
            health_hacks: string;
            ics_schema_id: string;
            pdf_care_plan: string;
            health_hacks_v3: string;
            region_schema_id: string;
            support_schema_id: string;
            health_hacks_video: string;
            about_app_schema_id: string;
            changelog_schema_id: string;
            peak_flow_schema_id: string;
            questions_schema_id: string;
            s1_survey_schema_id: string;
            s2_survey_schema_id: string;
            health_hacks_article: string;
            ics_details_schema_id: string;
            medication_reordering: string;
            health_hacks_schema_id: string;
            request_data_schema_id: string;
            terms_of_use_schema_id: string;
            health_hacks_video_quiz: string;
            nhs_health_az_schema_id: string;
            testid_with_description: string;
            time_reminder_schema_id: string;
            privacy_policy_schema_id: string;
            custom_reminder_schema_id: string;
            feedback_survey_schema_id: string;
            health_hacks_quiz_article: string;
            pharmacy_search_schema_id: string;
            symptom_tracker_schema_id: string;
            tips_categories_schema_id: string;
            health_hacks_srt_schema_id: string;
            nhs_health_az_schema_id_v2: string;
            nhs_health_az_schema_id_v3: string;
            nhs_medicines_az_schema_id: string;
            health_hacks_tips_schema_id: string;
            location_reminder_Schema_id: string;
            nhs_health_az_api_schema_id: string;
            feedback_survey_schema_id_v2: string;
            test_schema_with_description: string;
            nhs_medicines_az_schema_id_v2: string;
            nhs_medicines_az_schema_id_v3: string;
            health_hacks_articles_schema_id: string;
            nhs_medication_az_api_schema_id: string;
            health_hacks_questions_schema_v2: string;
            custom_medication_reminder_schema_id: string;
            nhs_az_conditions_favorites_schema_id: string;
            nhs_az_medication_favorites_schema_id: string;
            nhs_medication_pages_az_api_schema_id: string;
        }
    }
}