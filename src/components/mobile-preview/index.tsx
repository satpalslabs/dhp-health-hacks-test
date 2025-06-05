"use client";

import React, { useEffect, useState } from "react";
import {
  Article,
  Collection,
  DetailedSection,
  DetailedSubSection,
  Icon,
  SubSection,
} from "@/types";
import "swiper/css";
import $ from "jquery";
import MobileHeader from "@/components/mobile-preview-sidebar/mobile-header";
import {
  CollectionType,
  SectionType,
  SubSectionType,
  viewSectionData,
} from "@/lib/view-section-data";
import ActiveView from "./screens";
import { CollectionViewForMainPage } from "./collection-view";
import { SectionWithSubSections } from "./sub-section-view";
import GridSectionComponent from "./grid-section-view(epilepsy)";
import { ContentContainerSkeleton } from "./content-container";

export interface activeData {
  type: "collection" | "sub-section" | "article";
  collection?: CollectionType;
  section?: {
    section_name: string;
    section_icon?: Icon;
  };
  sub_section?: SubSectionType;
  bg_color?: string | null;
  article?: Article;
}

interface Data {
  sections: SectionType[];
  collections: CollectionType[];
  sub_sections?: DetailedSubSection[];
}

interface initialData extends Omit<Data, "sections"> {
  sections: DetailedSection[];
}

type Props = {
  articles?: Article[];
  activeData?: activeData;
  initialData?: initialData;
  loading?: boolean;
};

const DetailedMobilePreview = ({
  articles = [],
  loading: showLoading = false,
  activeData: initialActiveData = {
    type: "collection",
  },
  initialData,
}: Props) => {
  const [data, setData] = useState<Data>({
    sections: [],
    collections: [],
  });

  const [activeData, setActiveData] = useState<activeData[]>(
    initialActiveData ? [initialActiveData] : []
  );
  const [loading, setLoading] = useState(showLoading);

  useEffect(() => {
    if (!showLoading) {
      setLoading(true);
      const _data = viewSectionData(
        articles.sort(
          (a, b) =>
            (a.createdAt
              ? new Date(a.createdAt ?? 0).getTime()
              : Number.MAX_SAFE_INTEGER) -
            (b.createdAt
              ? new Date(b.createdAt ?? 0).getTime()
              : Number.MAX_SAFE_INTEGER)
        )
      );
      setData(_data);
      setTimeout(() => {
        setLoading(false);
      }, 50);
    }

    setActiveData([]);
    if (initialData) {
      setLoading(true);
      let data: Data = {
        sections: [],
        collections: [],
        sub_sections: [],
      };
      if (initialData.collections.length > 0) {
        data = getViewDataFromCollections(initialData.collections);
      } else if (
        initialData.sub_sections &&
        initialData.sub_sections.length > 0
      ) {
        data = getViewDataFromSubSection(initialData.sub_sections);
      } else if (initialData.sections.length > 0) {
        data = getViewDataFromSection(initialData.sections);
      }
      if (!showLoading) {
        setLoading(false);
      }
      setData(data);
    }
  }, [articles, initialData, showLoading]);

  useEffect(() => {
    $(`.no-scrollbar`).animate({ scrollTop: 0 }, 10);
  }, [activeData]);

  const firstSection = data.sections.find((i) => i.position == 0);

  return (
    <div className="relative grid grid-rows-[min-content_auto] shrink-0 font-poppins  w-full h-full">
      <div
        className={`px-[25px] text-white  -mt-[8px]`}
        style={{
          backgroundColor:
            activeData.length > 0 && activeData[activeData.length - 1].bg_color
              ? activeData[activeData.length - 1].bg_color ??
                "bg-mobile-primary"
              : "hsl(var(--mobile-primary))",
        }}
      >
        <MobileHeader />
      </div>
      <div className={`relative w-full overflow-hidden grow   `}>
        <div
          className="flex transition-transform h-full"
          style={{
            transform: `translateX(calc(-${activeData.length * 100}% ))`,
          }}
        >
          <div className="w-full shrink-0 overflow-y-auto no-scrollbar">
            <div className="sticky -top-0 py-[17px] z-20 bg-mobile-primary w-full text-lg text-center font-mulish font-semibold text-white">
              <div>Health Hacks</div>
            </div>

            {!loading ? (
              <span>
                {firstSection && (
                  <div className="mt-[25px]">
                    <GridSectionComponent
                      section={firstSection}
                      setActiveData={setActiveData}
                    />
                  </div>
                )}

                <div className="mt-8">
                  <CollectionViewForMainPage
                    collection={data.collections.find((i) => i.position == 0)}
                    setActiveData={setActiveData}
                  />
                </div>
                <div className="mt-[25px] flex flex-col gap-4">
                  {data.sections
                    .sort((a, b) => {
                      // Add MAX_SAFE_INTEGER if position is undefined this will show undefined position section on last
                      const posA = a?.position ?? Number.MAX_SAFE_INTEGER;
                      const posB = b?.position ?? Number.MAX_SAFE_INTEGER;
                      return posA - posB;
                    })
                    .map((section, ix) => {
                      if (section.position === 0) return;
                      return (
                        <span key={ix}>
                          {section.collections_data.length > 0 && (
                            <GridSectionComponent
                              section={section}
                              setActiveData={setActiveData}
                            />
                          )}
                          {section.sub_sections_data.length > 0 && (
                            <SectionWithSubSections
                              section={section}
                              setActiveData={setActiveData}
                            />
                          )}
                        </span>
                      );
                    })}
                </div>
                <div className="mt-8 flex flex-col gap-4">
                  {data.collections
                    .sort(
                      (a, b) =>
                        (a?.position ?? Number.MAX_SAFE_INTEGER) -
                        (b?.position ?? Number.MAX_SAFE_INTEGER)
                    )
                    .map((collection, ix) => {
                      if (collection.position == 0) return;
                      return (
                        <CollectionViewForMainPage
                          collection={collection}
                          key={ix}
                          setActiveData={setActiveData}
                        />
                      );
                    })}
                </div>
              </span>
            ) : (
              <div className="grid grid-rows-2 px-4 mt-8 w-full gap-2  grid-cols-2">
                <ContentContainerSkeleton className="w-full animate-pulse min-h-[140px] bg-muted " />
                <ContentContainerSkeleton className="w-full animate-pulse min-h-[140px] bg-muted " />
                <ContentContainerSkeleton className="w-full animate-pulse min-h-[140px] bg-muted " />
                <ContentContainerSkeleton className="w-full animate-pulse min-h-[140px] bg-muted " />
              </div>
            )}
          </div>
          {activeData.map((active, ix) => (
            <ActiveView
              key={ix}
              activeData={active}
              setActiveData={setActiveData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedMobilePreview;

const getViewDataFromCollections = (collections: Collection[]) => {
  const data: Data = {
    collections: [],
    sections: [],
  };
  collections.map((_collection) => {
    const collection = {
      ..._collection,
      articles_data: [..._collection.articles, ..._collection.videos],
    };
    if (collection.articles_data.length > 0) {
      if (collection.section) {
        const prevSection = data.sections.findIndex(
          (i) => i.id == collection.section?.id
        );
        if (
          "section_type" in collection.section
            ? collection.section.section_type == "health hacks"
            : true
        ) {
          if (prevSection !== -1) {
            data.sections[prevSection].collections_data.push(collection);
          } else {
            data.sections.push({
              ...collection.section,
              collections: collection.id !== null ? [collection.id] : [],
              sub_sections: [],
              collections_data: [collection],
              sub_sections_data: [],
            });
          }
        }
      } else if (collection.sub_section && collection.sub_section.section) {
        const prevSection = data.sections.findIndex(
          (i) => i.id == collection.sub_section?.section?.id
        );
        if (
          "section_type" in collection.sub_section.section
            ? collection.sub_section.section.section_type == "health hacks"
            : true
        ) {
          if (prevSection == -1) {
            data.sections.push({
              ...collection.sub_section.section,
              collections: [],
              sub_sections: [],
              collections_data: [],
              sub_sections_data: [
                { ...collection.sub_section, collections_data: [collection] },
              ],
            });
          } else {
            const prevSubSection = data.sections[
              prevSection
            ].sub_sections_data.findIndex(
              (i) => i.id == collection.sub_section?.id
            );
            if (prevSubSection == -1) {
              data.sections[prevSection].sub_sections_data.push({
                ...collection.sub_section,
                collections_data: [collection],
              });
            } else {
              data.sections[prevSection].sub_sections_data[
                prevSubSection
              ].collections_data?.push(collection);
            }
          }
        }
      } else {
        data.collections.push(collection);
      }
    }
  });
  return data;
};

const getViewDataFromSubSection = (sub_sections: DetailedSubSection[]) => {
  const data: Data = {
    collections: [],
    sections: [],
  };
  sub_sections.map((_sub_section) => {
    const sub_section: SubSectionType = {
      ..._sub_section,
      collections: _sub_section.collections
        .map((i) => i.id)
        .filter((i) => i != undefined),
      collections_data: [
        ..._sub_section.collections.map((item) => {
          return {
            ...item,
            articles_data: [...item.articles, ...item.videos],
          };
        }),
      ],
    };
    if (sub_section.section) {
      const prevSection = data.sections.findIndex(
        (i) => i.id == _sub_section.section?.id
      );
      if (
        "section_type" in sub_section.section
          ? sub_section.section.section_type == "health hacks"
          : true
      ) {
        if (prevSection !== -1) {
          data.sections[prevSection].sub_sections_data.push(sub_section);
        } else {
          data.sections.push({
            ...sub_section.section,
            collections: [],
            sub_sections: [sub_section],
            collections_data: [],
            sub_sections_data: [sub_section],
          });
        }
      }
    }
  });
  return data;
};

const getViewDataFromSection = (sections: DetailedSection[]) => {
  const data: Data = {
    collections: [],
    sections: [],
  };
  sections.map((_section) => {
    const section: SectionType = {
      ..._section,
      collections: _section.collections
        .map((i) => i.id)
        .filter((i) => i != undefined),
      collections_data: [
        ..._section.collections.map((item) => {
          return {
            ...item,
            articles_data: [...item.articles, ...item.videos].map((_item) => {
              return {
                ..._item,
                collection: {
                  ...item,
                  section: {
                    ..._section,
                    collections: [],
                    sub_sections: [],
                  },
                },
              };
            }),
          };
        }),
      ],
      sub_sections: _section.sub_sections as unknown as SubSection[],
      sub_sections_data: _section.sub_sections.map((sub_section) => {
        return {
          ...sub_section,
          collections: sub_section.collections
            .map((i) => i.id)
            .filter((i) => i != null),
          collections_data: [
            ...sub_section.collections.map((item) => {
              return {
                ...item,
                articles_data: [...item.articles, ...item.videos].map(
                  (_item) => {
                    return {
                      ..._item,
                      collection: {
                        ...item,
                        section: {
                          ..._section,
                          collections: [],
                          sub_sections: [],
                        },
                      },
                    };
                  }
                ),
              };
            }),
          ],
          associated_conditions: sub_section.associated_conditions,
        };
      }),
    };
    data.sections.push(section);
  });
  return data;
};
