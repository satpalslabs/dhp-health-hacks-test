import React, { useEffect, useState } from "react";
import { activeData } from ".";
import { SectionDetails } from "./screen-components";
import Link from "next/link";
import ContentComponent, { YouTubePlayer } from "./webpage-content-components";
import { ButtonGroup, CardBanner } from "./content-container";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAppData } from "@/lib/services/article-services";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { getFormContentValues } from "../cms/articles/add-edit-articles";
import StatusButton from "../ui/status-button";

const ArticleDetailView = ({ activeData }: { activeData: activeData }) => {
  return (
    <div className="flex mt-8 flex-col gap-[63px] w-full px-4">
      <GetDetailPage activeData={activeData} />
    </div>
  );
};

export default ArticleDetailView;

const GetDetailPage = ({ activeData }: { activeData: activeData }) => {
  if (activeData.article) {
    const article = {
      ...activeData.article,
      content: activeData.article.content
        ? getFormContentValues(activeData.article)
        : [],
    };

    switch (activeData.article.content_type?.type) {
      case "content-page":
        return <ContentPageArticleDetailView activeData={activeData} />;
      case "content-webpage":
        return (
          <>
            <div
              className="w-full rounded-[10px] overflow-hidden group-data-[mode='dark']:bg-mobile-dark-article flex flex-col gap-4 pb-6"
              style={{
                boxShadow: "var(--mobile-card-shadow)",
              }}
            >
              {activeData.article && (
                <>
                  <div className="w-full h-[184px] group-data-[align='horizontal']:h-full bg-white group-data-[mode='dark']:bg-mobile-dark-article">
                    <CardBanner article={activeData?.article} />
                  </div>
                  <div className="flex justify-between items-center px-3 ">
                    <ButtonGroup
                      article={activeData.article}
                      className="gap-2 justify-normal px-0 w-fit"
                    />
                    {article.status && article.status !== "Published" && (
                      <StatusButton status={article.status ?? ""} />
                    )}
                  </div>
                </>
              )}
              <div className="flex flex-col gap-2 text-mobile-text-heading group-data-[mode='dark']:text-white px-3">
                <div className="font-poppins font-semibold text-lg leading-[27px] tracking-[0]">
                  {activeData.article?.title}
                </div>
                <div className="font-mulish text-sm font-normal text-text-darkGray">
                  {activeData.section?.section_name}
                </div>
                <ContentComponent article={article} />
                {(article.quiz?.length ?? 0) > 0 && (
                  <div className=" border-t border-[#ededed] pt-3">
                    <Button className="w-full h-10 text-base text-white text-center flex items-center justify-center font-mulish font-semibold bg-gradient-mobile-button rounded-full">
                      Take The Quiz
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <SectionDetails activeData={activeData} />
          </>
        );
      case "content-video":
        return (
          <>
            <div
              className="w-full rounded-[10px] overflow-hidden group-data-[mode='dark']:bg-mobile-dark-article flex flex-col gap-4 pb-6"
              style={{
                boxShadow: "var(--mobile-card-shadow)",
              }}
            >
              {activeData.article && (
                <>
                  <div className="w-full h-[184px] group-data-[align='horizontal']:h-full bg-white group-data-[mode='dark']:bg-mobile-dark-article">
                    <YouTubePlayer url={article.url ?? ""} />
                  </div>
                  <div className="flex justify-between items-center px-3 ">
                    <ButtonGroup
                      article={activeData.article}
                      className="gap-2 justify-normal px-0 w-fit"
                    />
                    {article.status && article.status !== "Published" && (
                      <StatusButton status={article.status ?? ""} />
                    )}
                  </div>
                </>
              )}
              <div className="flex flex-col gap-2 text-mobile-text-heading group-data-[mode='dark']:text-white px-3">
                <div className="font-poppins font-semibold text-lg leading-[27px] tracking-[0]">
                  {activeData.article?.title}
                </div>
                <div className="font-mulish text-sm font-normal text-text-darkGray">
                  {activeData.section?.section_name}
                </div>
                {(article.quiz?.length ?? 0) > 0 && (
                  <div className=" border-t border-[#ededed] pt-3">
                    <Button className="w-full h-10 text-base text-white text-center flex items-center justify-center font-mulish font-semibold bg-gradient-mobile-button rounded-full">
                      Take The Quiz
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="-mt-7 flex flex-col gap-5">
              <Link
                target="_blank"
                href={article.url ?? ""}
                className="text-xs font-mulish  text-gray-500 "
              >
                Source: {article.url}
              </Link>
              <SectionDetails activeData={activeData} />
            </div>
          </>
        );
    }
  }
};

type ApiResponseAppData = {
  description: string;
  name: string;
  mainEntityOfPage: {
    text: string;
    headline: string;
    mainEntityOfPage: { text: string; headline: string }[];
  }[];
};
const ContentPageArticleDetailView = ({
  activeData,
}: {
  activeData: activeData;
}) => {
  const [loading, setLoading] = useState(true);
  const [articleData, setArticleData] = useState<ApiResponseAppData | null>(
    null
  );
  useEffect(() => {
    async function fetchData() {
      if (activeData.article?.article_pc_id) {
        const res: {
          meta: {
            data: ApiResponseAppData;
          };
        } = await getAppData(activeData.article?.article_pc_id);
        modifyData(res.meta.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeData]);

  const modifyData = (response: ApiResponseAppData) => {
    const query_data = response;
    const final_Data: ApiResponseAppData = {
      description: query_data.description,
      name: query_data.name,
      mainEntityOfPage: [],
    };
    query_data.mainEntityOfPage.map(
      (item: ApiResponseAppData["mainEntityOfPage"][0]) => {
        if (item.headline != "" && item.headline != undefined) {
          final_Data.mainEntityOfPage.push(item);
        }
      }
    );
    setArticleData(final_Data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!articleData) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col gap-5">
        {activeData.article && (
          <ButtonGroup
            article={activeData.article}
            className="justify-normal gap-2 px-0 "
          />
        )}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-poppins font-semibold">
            {articleData?.name}
          </p>
          <p className="font-mulish">{articleData?.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          {articleData?.mainEntityOfPage &&
            articleData.mainEntityOfPage.map((item, index) => (
              <Collapsible
                className="group"
                key={index}
                defaultOpen={index == 0}
              >
                <CollapsibleTrigger className="cursor-pointer flex justify-between w-full text-left">
                  <p className="break-words font-poppins text-base font-medium">
                    {item.headline}
                  </p>
                  <ChevronDown className="transition-all group-data-[state='open']:rotate-180 shrink-0" />
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full mt-2">
                  <div className="no-tailwind">
                    <div
                      className="font-poppins [&_p]:!text-sm  [&_li]:!text-sm [&_a]:!text-sm [&_p_*]:!text-sm [&_p]:!leading-[20px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px]"
                      dangerouslySetInnerHTML={{
                        __html: item.mainEntityOfPage[0].text ?? "",
                      }}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </div>
      </div>
      <div className="-mt-7 flex flex-col gap-5">
        <Link
          target="_blank"
          href={activeData.article?.url ?? ""}
          className="text-xs font-mulish  text-gray-500 "
        >
          Source: {activeData.article?.url}
        </Link>
        <SectionDetails activeData={activeData} />
      </div>
    </>
  );
};
