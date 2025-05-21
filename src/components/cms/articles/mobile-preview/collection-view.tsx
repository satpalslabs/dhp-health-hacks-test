import { Article, Icon } from "@/types";
import { activeData } from ".";
import { CollectionType, SubSectionType } from "@/lib/view-section-data";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentContainer } from "./content-container";
import { ScreenHeader, SectionDetails } from "./screen-components";
import { ChevronRight } from "lucide-react";
import { ArticleContext } from "@/context/article-data-provider";

export const CollectionViewForMainPage = ({
  collection,
  setActiveData,
  section,
  sub_section,
}: {
  collection: CollectionType | undefined;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
  section?: {
    section_name: string;
    section_icon?: Icon;
  };
  sub_section?: SubSectionType;
}) => {
  const swiperContainerRef = useRef<SwiperRef>(null);
  const [collectionData, setCollectionData] = useState<
    CollectionType | undefined
  >(collection);
  const { articles } = useContext(ArticleContext);

  // This useEffect is used to get the collections data for the sub-section if not available
  useEffect(() => {
    if (!collection?.articles_data) {
      const articles_data = articles.filter(
        (article) =>
          article.id && collection?.articles.some((i) => i.id == article.id)
      );
      if (collection) {
        setCollectionData({
          ...collection,
          articles_data,
        });
      }
    } else {
      setCollectionData(collection);
    }
  }, [collection]);

  if (!collection) return;
  return (
    <div className="overflow-hidden">
      <div className="flex justify-between w-full items-end px-5 font-poppins font-semibold text-mobile-text-heading group-data-[mode='dark']:text-white  overflow-hidden">
        <p className="break-words text-wrap grow line-clamp-2">
          {collectionData?.collection_name.split("_")[0]}
        </p>
        {(collectionData?.articles_data?.length ?? 0) > 1 && (
          <Button
            variant={"outline"}
            className="h-8 w-[96px] rounded-[20px] !bg-transparent text-sm font-mulish font-semibold !text-mobile-text-primary border-mobile-text-primary"
            onClick={() => {
              let nextComponentData: activeData;
              if (sub_section && section) {
                nextComponentData = {
                  type: "collection",
                  bg_color: sub_section.bg_color ?? "",
                  section,
                  sub_section,
                  collection: collectionData,
                };
              } else {
                nextComponentData = {
                  type: "collection",
                  bg_color: collection.bg_color ?? "",
                  collection: collectionData,
                };
              }
              setActiveData((prev) => [...prev, nextComponentData]);
            }}
          >
            View all
          </Button>
        )}
      </div>
      <Swiper
        ref={swiperContainerRef}
        slidesPerView={"auto"}
        spaceBetween={20}
        grabCursor={true}
        className="mt-4 !px-6  !cursor-grab"
      >
        {collectionData?.articles_data?.map(
          (article: Article, index: number) => (
            <SwiperSlide key={index} className="!h-fit mb-4 !w-fit">
              <ContentContainer
                article={article}
                onClick={() => {
                  let nextComponentData: activeData;
                  if (sub_section && section) {
                    nextComponentData = {
                      type: "article",
                      bg_color: sub_section.bg_color,
                      section,
                      sub_section,
                      article,
                    };
                  } else {
                    nextComponentData = {
                      type: "article",
                      bg_color: collection.bg_color,
                      article,
                    };
                  }
                  setActiveData((prev) => [...prev, nextComponentData]);
                }}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

const CollectionView = ({
  activeData,
  setActiveData,
}: {
  activeData: activeData;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  const [collectionData, setCollectionData] = useState<
    CollectionType | undefined
  >(activeData.collection);
  const { articles } = useContext(ArticleContext);

  // This useEffect is used to get the collections data for the sub-section if not available
  useEffect(() => {
    if (!activeData.collection?.articles_data) {
      const articles_data = articles.filter(
        (article) =>
          article.id &&
          activeData.collection?.articles.some((i) => i.id == article.id)
      );
      if (activeData.collection) {
        setCollectionData({
          ...activeData.collection,
          articles_data,
        });
      }
    }
  }, [activeData.collection]);

  return (
    <div className="w-full overflow-y-auto no-scrollbar h-full shrink-0 relative pb-5 ">
      <ScreenHeader activeData={activeData} setActiveData={setActiveData} />
      <div className="mt-9 flex flex-col justify-between gap-[63px] px-6 overflow-y-auto">
        <div className="flex flex-col gap-6 w-full pb-3">
          {activeData.sub_section && (
            <div className="-mb-1 flex items-center  font-mulish font-semibold leading-5">
              <p
                className="text-mobile-text-primary cursor-pointer line-clamp-1"
                onClick={() => {
                  setActiveData((prev) => {
                    prev.pop();
                    return [...prev];
                  });
                }}
              >
                {activeData.sub_section?.subsection_name}
              </p>
              <div className="flex gap-1 items-center [&_svg]:size-4">
                <ChevronRight />
                <span className=" line-clamp-1">
                  {activeData.collection?.collection_name.split("_")[0]}
                </span>
              </div>
            </div>
          )}
          <div className="font-poppins font-semibold text-2xl  text-mobile-text-heading group-data-[mode='dark']:text-white">
            {activeData.collection?.collection_name.split("_")[0]}
          </div>
          {collectionData?.articles_data?.map((article, ix) => (
            <ContentContainer
              align={"horizontal"}
              article={article}
              key={ix}
              onClick={() => {
                const nextComponentData: activeData = {
                  type: "article",
                  bg_color: activeData.collection?.bg_color,
                  section: activeData.section,
                  article,
                };
                setActiveData((prev) => [...prev, nextComponentData]);
              }}
            />
          ))}
        </div>
        <SectionDetails activeData={activeData} />
      </div>
    </div>
  );
};

export default CollectionView;
