export const getConfigObject = (
    env: string
): { BASE_URL: string; STRAPI_BASE_URL: string; STRAPI_API_TOKEN: string } => {
    let configString = "{}";
    switch (env) {
        case "development":
            configString = process.env.DEV_CONFIG || "{}";
            break;
        case "staging":
            configString = process.env.STAGING_CONFIG || "{}";
            break;
        case "production":
            configString = process.env.PROD_CONFIG || "{}";
            break;
        default:
            configString = process.env.EXP_CONFIG || "{}";
    }
    try {
        return JSON.parse(configString);
    } catch (e) {
        console.error("Invalid config JSON:", configString, e);
        return {
            BASE_URL: "",
            STRAPI_BASE_URL: "",
            STRAPI_API_TOKEN: "",
        };
    }
};