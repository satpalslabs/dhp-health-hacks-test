"use client";

import { SpinnerButton } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { contentTypes, formSchema, WebpageSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Article,
  FormBodyArticle,
  FormBodyContent,
  ContentProvider,
  WebpageComponent,
} from "@/types";
import { Form } from "@/components/ui/form";
import {
  ArticleCards,
  ContentFields,
  GridFields,
  renderCommonFields,
  SelectField,
  CardSelectionField,
  TipsSection,
  QuizSection,
} from "./form-components";
import nProgress from "nprogress";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { PostArticle, PutArticle } from "@/lib/services/article-services";
import { getContentProviders } from "@/lib/services/content-provider-services";
import NHS_SelectField from "./form-components/nhs-selectField";

const ArticleForm = ({
  setPreviewData,
  editArticle,
  defaultValues,
  redirectTo,
}: {
  setPreviewData: React.Dispatch<
    React.SetStateAction<z.infer<typeof formSchema> | undefined>
  >;
  editArticle?: Article;
  defaultValues?: {
    collection?: number | null;
    section?: number | null;
    sub_section?: number | null;
  };
  redirectTo: string;
}) => {
  const [sources, setSources] = useState<ContentProvider[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<
    FormBodyArticle["status"] | null
  >(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(
      editArticle,
      defaultValues,
      pathname
    ) as z.infer<typeof formSchema>,
  });
  const [loadingSources, setLoadingSources] = useState(true);

  useEffect(() => {
    if (sources.length <= 0) {
      getContentProviders().then((res) => {
        setSources(res);
        setLoadingSources(false);
      });
    } else {
      setLoadingSources(false);
    }
  }, []);

  const handleSubmit = async (
    status: FormBodyArticle["status"] = "Submitted for Review"
  ) => {
    nProgress.start();
    setLoading(true);
    setActiveButton(status);

    try {
      const formValues = form.getValues();
      const article_data: FormBodyArticle = {
        ...(editArticle?.id ? editArticle : {}),
        ...formValues, // Spread form values directly
        status: status,
        source: "source" in formValues ? formValues.source : null,
        id: editArticle ? editArticle.id : null,
        thumbnail_icon:
          "thumbnail_icon" in formValues && formValues.thumbnail_icon?.id
            ? [formValues.thumbnail_icon.id]
            : null, // Ensure thumbnail_icon is either Icon or null
        quiz: "quiz" in formValues ? formValues.quiz ?? [] : [],
        tips: "tips" in formValues ? formValues.tips ?? [] : [],
        content:
          "content" in formValues
            ? getContentData(formValues.content ?? [], formValues.title)
            : [],
        old_id: "old_id" in formValues ? formValues.old_id : null, // Explicitly assign null if undefined
        description:
          "description" in formValues ? formValues.description : null, // Explicitly assign null if undefined
      };
      console.log(article_data);
      if (editArticle) {
        article_data.id = editArticle.id;
        await PutArticle(article_data);
        onSuccess(article_data.content_type.split("-")[1]);
      } else {
        await PostArticle(article_data);
        onSuccess(article_data.content_type.split("-")[1]);
      }
    } catch (er) {
      nProgress.done();
      setLoading(false);
      setActiveButton(null);
      toast({
        title: `Error`,
        description: JSON.stringify(er),
      });
    }
  };

  const onSuccess = (contentType: string) => {
    setLoading(false);
    nProgress.done();
    setActiveButton(null);
    router.push(redirectTo);
    toast({
      title: `Success`,
      description: (
        <p>
          <span className="capitalize">{contentType}</span>
          {editArticle ? " updated" : " created"} successfully
        </p>
      ),
    });
  };

  const formValues = form.watch();
  useEffect(() => {
    setPreviewData({ ...formValues } as z.infer<typeof formSchema>);
  }, [JSON.stringify(formValues)]);

  const isContentPage = form.getValues("content_type") === "content-page";
  const isWebPage = form.getValues("content_type") === "content-webpage";
  const isArticleCard = form.getValues("content_type") === "article-cards";

  const ableToSearchNHSArticle = isContentPage
    ? form.getValues("source")
    : !isArticleCard;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          handleSubmit("Submitted for Review");
        })}
        className="border border-border rounded-lg w-full h-full p-6 flex flex-col gap-6 relative"
      >
        <p className="w-full font-inter font-semibold text-lg">
          {editArticle
            ? pathname.includes("articles")
              ? "Edit Article"
              : "Edit Video"
            : pathname.includes("articles")
            ? "Add New Article"
            : "Add new Video"}
        </p>

        <div className="grow flex flex-col gap-4 overflow-y-auto h-fit px-[2px] pb-5">
          {/* Content Type Selection */}
          <CardSelectionField
            form={form}
            name="content_type"
            label="Content-type"
            options={contentTypes}
          />

          {isContentPage && (
            <NHS_SelectField
              form={form}
              sourceId={sources.find((i) => i.name == "NHS UK")?.id ?? null}
              ableToSearchNHSArticle={!!ableToSearchNHSArticle}
            />
          )}
          {editArticle && editArticle.old_id && (
            <FormFieldWrapper
              control={form.control}
              disable={true}
              name={`old_id`}
              label="Old Id <span class='mr-1'></span>"
              type="number"
              tooltip="Enter old ID"
              placeholder="Write old ID"
              component={Input}
            />
          )}

          {isArticleCard && (
            <FormFieldWrapper
              control={form.control}
              name="title"
              label="Title"
              required
              tooltip="Enter Title"
              className="min-h-0"
              placeholder="Write title here"
              component={Input}
            />
          )}
          {(isContentPage
            ? form.getValues("article_pc_id") || editArticle
            : true) && (
            <>
              <GridFields formControl={form.control} form={form} />
              {!isArticleCard ? (
                <>
                  {renderCommonFields(form, isContentPage)}
                  {!isContentPage && (
                    <SelectField
                      control={form.control}
                      name="source"
                      label="Source"
                      dataKey="name"
                      tooltip="Select Source"
                      placeholder="Select Source"
                      showLoader={loadingSources}
                      options={sources}
                      required
                    />
                  )}
                  {isWebPage && <ContentFields form={form} />}
                  {!isWebPage && (
                    <>
                      <TipsSection form={form} />
                      <QuizSection form={form} />
                    </>
                  )}
                </>
              ) : (
                <ArticleCards form={form} />
              )}
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className="w-full flex justify-between items-center font-inter relative z-10">
          <span>
            {!loading && (
              <Link href="/articles" className="px-3">
                Cancel
              </Link>
            )}
          </span>
          <div className="flex gap-2">
            {(!loading || activeButton == "Draft") && (
              <SpinnerButton
                type="button"
                variant="secondary"
                onClick={() => {
                  handleSubmit("Draft");
                }}
                className="px-[43px]"
                loading={loading}
              >
                Save Draft
              </SpinnerButton>
            )}
            {(!loading || activeButton == "Submitted for Review") && (
              <SpinnerButton
                type="submit"
                className="px-[43px]"
                loading={loading}
              >
                Submit for Review
              </SpinnerButton>
            )}
          </div>
        </div>
        {loading && (
          <div className="absolute top-0 left-0 w-full  h-full bg-background opacity-90 z-0 animate-pulse blur-xl"></div>
        )}
      </form>
    </Form>
  );
};

export default ArticleForm;

export type FormAccordionGroupContent = WebpageComponent & {
  group_content?: WebpageComponent[];
};

export const getDefaultValues = (
  editArticle: Article | undefined,
  defaultValues:
    | {
        collection?: number | null;
        section?: number | null;
        sub_section?: number | null;
      }
    | undefined,
  pathname: string
) => {
  const content: FormAccordionGroupContent[] = [];
  if (editArticle) {
    if (editArticle.content && editArticle.content.length > 0) {
      editArticle.content.map((item) => {
        const _content: FormAccordionGroupContent = item;
        if (item.__component == "webpage.accordion-group") {
          _content["group_content"] = editArticle.content
            ? editArticle.content.filter(
                (i) =>
                  "accordion_group_id" in i &&
                  i.accordion_group_id == item.group_id
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
    }
  }

  return {
    ...editArticle,
    collection: editArticle?.collection?.id ?? 0,
    ...defaultValues,
    content_type: (editArticle?.content_type?.type
      ? editArticle?.content_type?.type
      : pathname.includes("article")
      ? "content-page"
      : "content-video") as
      | "content-webpage"
      | "content-page"
      | "content-video",
    title: editArticle?.title ?? "",
    description: editArticle?.description ?? "",
    url: editArticle?.url ?? "",
    quiz: editArticle?.quiz.map((i) => i.id) ?? [],
    status: editArticle?.status ?? "Draft",
    thumbnail_icon: editArticle?.thumbnail_icon ?? null,
    cover_image: editArticle?.cover_image ?? null,
    old_id: editArticle?.old_id ?? null,
    source: editArticle?.source?.id ?? undefined,
    section: editArticle
      ? editArticle?.collection?.section?.id ||
        editArticle?.collection?.sub_section?.section?.id ||
        null
      : defaultValues?.section ?? null,
    sub_section: editArticle
      ? editArticle?.collection?.sub_section?.id ?? null
      : defaultValues?.sub_section ?? null,
    content: content.map((item) => ({
      ...item,
      group_content: item.group_content?.map((groupItem) => ({
        ...groupItem,
      })),
    })),
    tips: editArticle?.tips ?? [],
  };
};

const extractMediaFields = (
  item: WebpageComponent
): Partial<FormBodyContent> => {
  const result: Partial<FormBodyContent> = {};

  if ("icon" in item && item.icon?.id) result.icon = [item.icon.id];
  if ("bg_image" in item && item.bg_image?.id)
    result.bg_image = [item.bg_image.id];
  if ("user_photo" in item && item.user_photo?.id)
    result.user_photo = [item.user_photo.id];
  if ("image" in item && item.image?.id) result.image = [item.image.id];
  if ("video" in item && item.video?.id) result.video = [item.video.id];

  return result;
};

export const getContentData = (
  content: z.infer<typeof WebpageSchema>["content"],
  title: string
): FormBodyContent[] => {
  const contentData: FormBodyContent[] = [];

  content.forEach((item, ix) => {
    if (item.__component === "webpage.divider") {
      item.type = item.type ? item.type : "default";
    }
    if (item.__component === "webpage.accordion-group") {
      const id = `${title.replaceAll(" ", "_")}${ix + 1}`;

      contentData.push({
        __component: "webpage.accordion-group",
        default_open: item.default_open,
        description: item.description,
        group_id: id,
        title: item.title,
      });

      item.group_content.forEach((groupItem) => {
        if (groupItem.__component === "webpage.divider") {
          groupItem.type = groupItem.type ? groupItem.type : "default";
        }
        const data = {
          ...groupItem,
          accordion_group_id: id,
          ...extractMediaFields(groupItem),
        } as FormBodyContent;
        contentData.push(data);
      });
    } else {
      const data = {
        ...item,
        ...extractMediaFields(item),
      } as FormBodyContent;
      contentData.push(data);
    }
  });

  return contentData;
};
