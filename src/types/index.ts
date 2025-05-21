// This file acts as a central export hub for all type definitions
// It allows other files to import types from a single location, improving maintainability and organization
export interface commonFields {
    id: number | null;
    createdAt?: string;
    updatedAt?: string;
}
export * from "./auth";    // Exporting all types related to authentication
export * from "./journey"; // Exporting all types related to journeys
export * from "./article"; // Exporting all types related to articles
export * from "./health-conditions"; // Exporting all types related to health conditions
export * from "./tips"; // Exporting all types related to tips
export * from "./NHS/nhs-condition"; // Exporting all types related to nhs Conditions
export * from "./section"; // Exporting all types related to section
export * from "./sub-section"; // Exporting all types related to sub-section
export * from "./collection"; // Exporting all types related to collection
export * from "./webpage-content"; // Exporting all types related to webpage-content
export * from "./app-settings"; // Exporting all types related to app-settings
