

import type { Article, Collection, Section, SubSection } from "@/types";

// Extended types to include collections and articles
export interface SectionType extends Section {
    collections_data: Collection[];
    sub_sections_data: SubSectionType[];
}
export interface CollectionType extends Collection {
    articles_data?: Article[];
}
export interface SubSectionType extends SubSection {
    collections_data?: CollectionType[];
}

/**
 * Processes articles and organizes them into sections, sub-sections, and collections.
 * @param {Article[]} items - List of articles to process.
 * @returns {Promise<{ sections: SectionType[]; collections: CollectionType[] }>} - Organized data.
 */
export const viewSectionData = (items: Article[]) => {
    const updatedData: { sections: SectionType[]; collections: CollectionType[] } = {
        sections: [],
        collections: [],
    };

    for (const article of items) {
        if (!article.collection) continue; // Skip articles without a collection

        let collectionData = article.collection;
        if (!collectionData) continue; // Skip if collection does not exist
        collectionData = { ...article.collection }
        // If the collection belongs to a section
        if (collectionData.section) {
            let section = updatedData.sections.find(sec => sec.id === collectionData.section?.id);

            if (!section) {
                // Fetch section details if not already present
                const fetchedSection = collectionData.section;
                if (fetchedSection) {
                    section = { ...fetchedSection, collections: [], sub_sections: [], collections_data: [], sub_sections_data: [] };
                    updatedData.sections.push(section);
                }
            }
            // Add collection to the section
            if (section) updateCollection(section.collections_data, { ...article.collection }, article);
        }
        // If the collection belongs to a sub-section
        else if (collectionData.sub_section) {
            const subSectionData = collectionData.sub_section;
            if (!subSectionData) continue; // Skip if sub-section does not exist
            let section = updatedData.sections.find((sec) => sec.id === subSectionData?.section?.id)
            if (!section) {
                // Fetch section details if not already present
                const fetchedSection = subSectionData.section;
                if (fetchedSection) {
                    section = { ...fetchedSection, collections: [], sub_sections: [], collections_data: [], sub_sections_data: [] };
                    updatedData.sections.push(section);
                }
            }
            if (!section) continue; // Ensure section exists

            // Check if sub-section already exists inside section
            let subSection = section.sub_sections_data.find(sub => sub.id === collectionData.sub_section?.id);

            // Fetch collections under the sub-section
            const collectionsData = [{
                ...article.collection, articles_data: [article]
            }]


            // If sub-section does not exist, create and add it
            if (!subSection) {
                subSection = { ...subSectionData, collections_data: collectionsData };
                section.sub_sections_data.push(subSection);
            }

            // Add collection data to the sub-section
            if (subSection.collections_data) {
                updateCollection(subSection.collections_data, collectionData, article);
            }
        }
        // If the collection does not belong to any section or sub-section
        else {
            updateCollection(updatedData.collections, collectionData, article);
        }
    }
    return updatedData;
};

/**
 * Updates a collection list by adding a new collection or updating an existing one with new articles.
 * @param {CollectionType[]} collectionList - The list of collections to update.
 * @param {CollectionType} collection - The collection being added/updated.
 * @param {Article} article - The article to associate with the collection.
 */
const updateCollection = (collectionList: CollectionType[], collection: CollectionType, article: Article) => {
    const existingCollection = collectionList.find((item) => item.id === collection.id);

    if (existingCollection) {
        // Ensure articles are unique using Set
        existingCollection.articles_data = [...new Set([...(existingCollection.articles_data ?? []), article])];
    } else {
        // Add new collection with the article
        collectionList.push({ ...collection, articles_data: [article] });
    }
};


