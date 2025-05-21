"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview, {
  ThemeSwitching,
} from "@/components/mobile-preview-sidebar/mobile";
import ArticleMobilePreview from "@/components/cms/articles/mobile-preview";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkMinus, Box, FileText, FolderClosed } from "lucide-react";
import { z } from "zod";
import {
  ContentContainer,
  ButtonGroup,
  CardBanner,
} from "../mobile-preview/content-container";
import { formSchema } from "./form-schema";
import ArticleForm, { FormAccordionGroupContent } from "./article-form";
import { Article } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollectionContext } from "@/context/collection-data-provider";
import ContentComponent from "../mobile-preview/webpage-content-components";

interface ArticleData extends Article {
  section_data?: {
    section_name?: string;
    section_icon?: string;
  };
}

export const getFormContentValues = (article: Article) => {
  const content: FormAccordionGroupContent[] = [];
  article.content.map((item) => {
    const _content: FormAccordionGroupContent = item;
    if (item.__component == "webpage.accordion-group") {
      _content["group_content"] = article.content
        ? article.content.filter(
            (i) =>
              "accordion_group_id" in i && i.accordion_group_id == item.group_id
          )
        : [];
      content.push(_content);
    } else if (
      "accordion_group_id" in item &&
      item.accordion_group_id == null
    ) {
      content.push(_content);
    }
  });
  return content;
};

export default function AddArticle({
  editArticle,
  defaultData,
  redirectTo,
}: {
  editArticle?: Article;
  defaultData?: {
    collection?: number | null;
    section?: number | null;
    sub_section?: number | null;
  };
  redirectTo: string;
}) {
  const { collections } = useContext(CollectionContext);
  const [formData, setFormData] = useState<
    z.infer<typeof formSchema> | undefined
  >({
    content_type: editArticle
      ? (editArticle?.content_type?.type as "content-video" | "content-page")
      : "content-page",
    old_id: null,
    title: editArticle?.title ?? "",
    description: editArticle?.description ?? "",
    url: editArticle?.url ?? "",
    section: editArticle
      ? editArticle?.collection?.section?.id ||
        editArticle?.collection?.sub_section?.section?.id ||
        null
      : defaultData?.section ?? null,
    sub_section: editArticle
      ? editArticle?.collection?.sub_section?.id ?? null
      : defaultData?.sub_section ?? null,
    quiz: editArticle?.quiz
      ? editArticle?.quiz.map((i) => i.id).filter((i) => i != undefined)
      : [],
    content: editArticle?.content ? getFormContentValues(editArticle) : [],
    tips: editArticle?.tips ?? [],
    thumbnail_icon: editArticle?.thumbnail_icon ?? null,
    collection: editArticle?.collection?.id ?? null,
    source: editArticle?.source?.id ?? null,
    cover_image: editArticle?.cover_image ?? null,
    video_duration: editArticle?.video_duration ?? null,
    key_points: editArticle?.key_points,
  } as z.infer<typeof formSchema>);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);

  const [activeTab, setActiveTab] = useState<
    "article" | "section" | "sub-section" | "collection"
  >("article");

  const _articleData = useDeferredValue(articleData);

  useEffect(() => {
    const collection = collections.find(
      (_coll) => _coll.id == formData?.collection
    );
    setArticleData({
      ...formData,
      content_type: {
        type: formData?.content_type ?? "content-video",
      },
      section_data: {
        section_name:
          collection?.section?.section_name ||
          collection?.sub_section?.section?.section_name,
        section_icon:
          collection?.section?.section_icon ||
          collection?.sub_section?.section?.section_icon,
      },
    } as ArticleData);
  }, [formData, collections]);
  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <ArticleForm
          setPreviewData={setFormData}
          editArticle={editArticle}
          defaultValues={defaultData}
          redirectTo={redirectTo}
        />
      </SidebarInset>
      <PreviewSidebar>
        <Tabs
          className="p-6 pb-[9px]"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as "article" | "section" | "sub-section" | "collection"
            )
          }
        >
          <TabsList className="w-full gap-2 items-center [&_svg]:size-6 rounded-lg justify-between">
            {["article", "section", "sub-section", "collection"].map(
              (value) => (
                <TooltipProvider key={value}>
                  <Tooltip>
                    <TabsTrigger
                      className="!text-foreground rounded-lg px-[29px] dark:data-[state=active]:bg-background
"
                      value={value}
                    >
                      <TooltipTrigger asChild>
                        {value === "article" ? (
                          <FileText />
                        ) : value === "section" ? (
                          <FolderClosed />
                        ) : value === "sub-section" ? (
                          <BookmarkMinus />
                        ) : (
                          <Box />
                        )}
                      </TooltipTrigger>
                    </TabsTrigger>
                    <TooltipContent>
                      <p className="capitalize">{value}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
          </TabsList>
        </Tabs>
        {activeTab === "article" ? (
          <ThemeSwitching>
            {formData?.content_type == "content-webpage" && articleData ? (
              <div className="flex flex-col gap-[63px] w-full  ">
                <div
                  className="w-full rounded-[10px] overflow-hidden bg-white group-data-[mode='dark']:bg-mobile-dark-article flex flex-col gap-4 pb-6"
                  style={{
                    boxShadow: "var(--mobile-card-shadow)",
                  }}
                >
                  <>
                    <div className="w-full group-data-[align='horizontal']:h-full bg-mobile-primary [&_a]:w-12 [&_a]:h-12 [&_a]:!p-3 h-[192px] ">
                      <CardBanner
                        article={
                          {
                            ..._articleData,
                            content_type: {
                              type: "content-webpage",
                            },
                          } as Article
                        }
                      />
                    </div>
                    <ButtonGroup article={_articleData as Article} />
                  </>

                  <div className="flex flex-col gap-2  text-mobile-text-heading group-data-[mode='dark']:text-white px-4">
                    <div className="font-poppins font-semibold text-lg leading-5">
                      {_articleData?.title}
                    </div>
                    <div className="font-mulish text-sm font-normal text-text-darkGray">
                      {_articleData?.section_data?.section_name}
                    </div>
                    <ContentComponent article={articleData} />
                  </div>
                </div>
              </div>
            ) : (
              <ContentContainer
                className="mx-auto mt-4 bg-white"
                article={
                  {
                    ...formData,
                    content_type: {
                      type:
                        formData?.content_type != null
                          ? formData?.content_type
                          : "content-page",
                    },
                  } as Article
                }
              />
            )}
          </ThemeSwitching>
        ) : (
          <MobilePreview>
            <ArticleMobilePreview
              articles={[]}
              // articles={articles.length > 1 ? articles : data}
              activeData={{ type: "collection" }}
            />
          </MobilePreview>
        )}
      </PreviewSidebar>
    </>
  );
}
