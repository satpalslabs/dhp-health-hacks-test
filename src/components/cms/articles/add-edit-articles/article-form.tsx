"use client";

import { SpinnerButton } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { contentTypes, formSchema, WebpageSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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
} from "@/components/form-components";
import nProgress from "nprogress";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import {
  changeStatusOfArticleOrVideo,
  DeleteArticle,
  getArticles,
  PostArticle,
  PutArticle,
} from "@/lib/services/article-services";
import { getContentProviders } from "@/lib/services/content-provider-services";
import NHS_SelectField from "@/components/form-components/nhs-selectField";
import { DeleteVideo, getVideos } from "@/lib/services/video-services.";
import { ArticleContext } from "@/context/article-data-provider";
import { VideoContext } from "@/context/video-data-provider";
import { Trash2 } from "lucide-react";

const ArticleForm = ({
  setPreviewData,
  editArticle,
  defaultValues,
  redirectTo,
}: {
  setPreviewData: Dispatch<
    SetStateAction<z.infer<typeof formSchema> | undefined>
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
  const [loadingSources, setLoadingSources] = useState(true);
  const { updateArticles } = useContext(ArticleContext);
  const { updateVideos } = useContext(VideoContext);
  const [activeButton, setActiveButton] = useState<
    FormBodyArticle["status"] | "Delete" | null
  >(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(editArticle, defaultValues, pathname),
  });
  const formValues = form.watch();
  const isArticle = pathname.includes("articles");
  useEffect(() => {
    if (sources.length <= 0) {
      getContentProviders().then((res) => {
        setSources(res);
        setLoadingSources(false);
      });
    } else {
      setLoadingSources(false);
    }
  }, [sources]);

  const isEdited =
    JSON.stringify(getDefaultValues(editArticle, defaultValues, pathname)) !=
    JSON.stringify(form.getValues());

  const submitButtons = [
    {
      label: "Save Draft",
      status: "Draft",
      variant: "secondary",
      className: "px-[43px]",
      handleSubmit: () => handleSubmit("Draft"),
      visible:
        !editArticle ||
        !editArticle.status ||
        isEdited ||
        activeButton === "Draft",
    },
    {
      label: "Submit for Review",
      status: "Submitted for Review",
      variant: "default",
      className: "px-[43px]",
      handleSubmit: () => handleSubmit("Submitted for Review"),
      visible:
        !editArticle ||
        !editArticle.status ||
        isEdited ||
        activeButton === "Submitted for Review",
    },
    {
      label: "Reject",
      status: "Rejected",
      variant: "destructive",
      className:
        "px-[43px] text-button-status-rejectedButton bg-button-status-rejectedButton/10 hover:bg-button-status-rejectedButton/20",
      handleSubmit: () => handleButtonClick("Rejected"),
      visible:
        ((editArticle?.status === "Submitted for Review" ||
          editArticle?.status === "Approved") &&
          !isEdited) ||
        activeButton === "Rejected",
    },
    {
      label: "Approve",
      status: "Approved",
      variant: "default",
      className: "px-[43px]",
      handleSubmit: () => handleButtonClick("Approved"),
      visible:
        (editArticle?.status === "Submitted for Review" && !isEdited) ||
        activeButton === "Approved",
    },
    {
      label: "Publish",
      status: "Published",
      variant: "default",
      className: "px-[43px]",
      handleSubmit: () => handleButtonClick("Published"),
      visible:
        (editArticle?.status === "Approved" && !isEdited) ||
        activeButton === "Published",
    },
  ];

  const destructiveButtons = [
    {
      label: "Unpublish",
      handleSubmit: () => handleButtonClick("Unpublished"),
      visible: editArticle?.status === "Published",
    },
    {
      label: "Delete",
      handleSubmit: () => handleDelete(),
      visible: activeButton === "Delete" || editArticle?.status === "Rejected",
    },
  ];

  const handleButtonClick = async (status: FormBodyArticle["status"]) => {
    setLoading(true);
    setActiveButton(status);
    try {
      if (editArticle?.id) {
        await changeStatusOfArticleOrVideo("article", editArticle?.id, status);
        // Update state and show success toast
        onSuccess(formValues.content_type, false);
        toast({
          title: `${status} ${formValues.content_type}`,
          description: (
            <p>
              {status} {formValues.content_type} successfully
            </p>
          ),
        });
      }
    } catch (er) {
      setLoading(false);
      toast({
        title: `Something went Wrong!`,
        description: ` ${er}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setActiveButton("Delete");
    try {
      if (editArticle?.id) {
        if (isArticle) {
          await DeleteArticle(editArticle.id);
        } else {
          await DeleteVideo(editArticle.id);
        }
        // Update state and show success toast
        onSuccess(formValues.content_type, false);
        toast({
          title: `Delete ${formValues.content_type}`,
          description: (
            <p>You have Deleted your {formValues.content_type} successfully</p>
          ),
        });
      }
    } catch (er) {
      setLoading(false);
      toast({
        title: `Something went Wrong!`,
        description: ` ${er}`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (
    status: FormBodyArticle["status"] = "Submitted for Review"
  ) => {
    nProgress.start();
    setLoading(true);
    setActiveButton(status == "Draft" ? "Draft" : "Submitted for Review");
    try {
      const formValues = form.getValues();
      const article_data: FormBodyArticle = {
        ...(editArticle?.id ? editArticle : {}),
        ...formValues, // Spread form values directly
        status: status,
        source: "source" in formValues ? formValues.source : null,
        id: editArticle ? editArticle.id : null,
        key_points:
          "key_points" in formValues ? formValues.key_points ?? "" : undefined,
        thumbnail_icon:
          "thumbnail_icon" in formValues && formValues.thumbnail_icon?.id
            ? [formValues.thumbnail_icon.id]
            : null, // Ensure thumbnail_icon is either Icon or null
        quiz: "quiz" in formValues ? formValues.quiz ?? [] : [],
        tips: "tips" in formValues ? formValues.tips ?? [] : [],
        content:
          "content" in formValues
            ? getContentData(
                (formValues.content ?? []).map((item) =>
                  item.__component === "webpage.accordion-group"
                    ? { ...item, group_content: item.group_content ?? [] }
                    : item
                ),
                formValues.title
              )
            : [],
        old_id: "old_id" in formValues ? formValues.old_id : null, // Explicitly assign null if undefined
        description:
          "description" in formValues ? formValues.description : null, // Explicitly assign null if undefined
      };

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
        description: String(er),
        variant: "destructive",
      });
    }
  };

  const onSuccess = async (contentType: string, showToast: boolean = true) => {
    if (redirectTo.includes("articles")) {
      const res = await getArticles();
      updateArticles(res);
    } else {
      const res = await getVideos();
      updateVideos(res);
    }
    nProgress.done();
    setActiveButton(null);
    router.push(redirectTo);
    if (showToast) {
      toast({
        title: `Success`,
        description: (
          <p>
            <span className="capitalize">{contentType}</span>
            {editArticle ? " updated" : " created"} successfully
          </p>
        ),
      });
    }
  };

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
          const previousFormValues = JSON.stringify(
            getDefaultValues(editArticle, defaultValues, pathname)
          );
          if (
            editArticle &&
            editArticle.status === "Submitted for Review" &&
            previousFormValues === JSON.stringify(form.getValues())
          ) {
            // If the article is already submitted for review and no changes were made, approve it
            handleSubmit("Approved");
          } else {
            handleSubmit("Submitted for Review");
          }
        })}
        className="border border-border rounded-lg w-full h-full p-6 flex flex-col gap-6 relative"
      >
        <p className="w-full font-inter font-semibold text-lg">
          {editArticle
            ? isArticle
              ? "Edit Article"
              : "Edit Video"
            : isArticle
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
          <div className="flex items-center gap-2 ">
            {!loading && (
              <Link href="/articles" className="px-[25px]">
                Cancel
              </Link>
            )}
            {destructiveButtons
              .filter((btn) => btn.visible)
              .map((btn, ix) => (
                <SpinnerButton
                  key={ix}
                  type="button"
                  variant={"destructive"}
                  className="px-[25px] [&_span]:flex [&_span]:items-center [&_span]:gap-2 text-button-status-rejectedButton bg-button-status-rejectedButton/10 hover:bg-button-status-rejectedButton/20"
                  onClick={btn.handleSubmit}
                  disabled={loading}
                  loading={loading && activeButton === btn.label}
                >
                  {btn.label == "Delete" && <Trash2 />}
                  {btn.label}
                </SpinnerButton>
              ))}
          </div>
          <div className="flex gap-2">
            {submitButtons
              .filter((btn) => btn.visible)
              .map((btn) => (
                <SpinnerButton
                  key={btn.status}
                  type="button"
                  variant={
                    btn.variant as
                      | "link"
                      | "secondary"
                      | "destructive"
                      | "default"
                      | "outline"
                      | "ghost"
                  }
                  className={btn.className}
                  onClick={btn.handleSubmit}
                  disabled={
                    loading ||
                    (btn.status === "Draft" &&
                      JSON.stringify(
                        getDefaultValues(editArticle, defaultValues, pathname)
                      ) === JSON.stringify(form.getValues()))
                  }
                  loading={loading && activeButton === btn.status}
                >
                  {btn.label}
                </SpinnerButton>
              ))}
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
): z.infer<typeof formSchema> => {
  const content: FormAccordionGroupContent[] = [];

  editArticle?.content?.forEach((item) => {
    const isAccordionGroup = item.__component === "webpage.accordion-group";
    const isUngrouped =
      "accordion_group_id" in item && item.accordion_group_id == null;

    if (isAccordionGroup) {
      const groupContent = editArticle.content
        .filter(
          (i) =>
            "accordion_group_id" in i && i.accordion_group_id === item.group_id
        )
        .map((groupItem) => ({ ...groupItem }));

      content.push({ ...item, group_content: groupContent });
    } else if (isUngrouped) {
      content.push({ ...item });
    }
  });

  const content_type =
    (editArticle?.content_type?.type as
      | "content-webpage"
      | "content-page"
      | "content-video"
      | "article-cards"
      | undefined) ??
    (pathname.includes("article") ? "content-page" : "content-video");

  const collectionId =
    editArticle?.collection?.id ?? defaultValues?.collection ?? null;
  const sectionId =
    editArticle?.collection?.section?.id ??
    editArticle?.collection?.sub_section?.section?.id ??
    defaultValues?.section ??
    null;
  const subSectionId =
    editArticle?.collection?.sub_section?.id ??
    defaultValues?.sub_section ??
    null;
  const tips =
    editArticle?.tips
      ?.map((i) => i.id)
      .filter((id): id is number => id !== null) ?? [];
  const quiz =
    editArticle?.quiz
      ?.map((i) => i.id)
      .filter((id): id is number => id !== null) ?? [];

  const sharedFields = {
    title: editArticle?.title ?? "",
    old_id: editArticle?.old_id ?? null,
    collection: collectionId,
    section: sectionId,
    sub_section: subSectionId,
    tips,
    quiz,
    ...defaultValues,
  };

  switch (content_type) {
    case "content-webpage":
      return {
        content_type,
        description: editArticle?.description ?? "",
        thumbnail_icon: editArticle?.thumbnail_icon ?? null,
        cover_image: editArticle?.cover_image ?? null,
        source: editArticle?.source?.id ?? null,
        url: editArticle?.url ?? "",
        content: content.map((item) => ({
          ...item,
          group_content: (item.group_content ?? []).filter(
            (groupItem) => groupItem.__component !== "webpage.accordion-group"
          ),
        })),
        ...sharedFields,
      };

    case "content-page":
      return {
        content_type,
        description: editArticle?.description ?? "",
        cover_image: editArticle?.cover_image ?? null,
        source: editArticle?.source?.id ?? null,
        ...sharedFields,
      };

    case "content-video":
      return {
        content_type,
        thumbnail_icon: editArticle?.thumbnail_icon ?? null,
        video_duration: editArticle?.video_duration ?? null,
        description: editArticle?.description ?? "",
        source: editArticle?.source?.id ?? null,
        url: editArticle?.url ?? "",
        key_points: editArticle?.key_points ?? "",
        ...sharedFields,
      };

    case "article-cards":
      return {
        content_type,
        cover_image: editArticle?.cover_image ?? null,
        source: editArticle?.source?.id ?? null,
        cards: [],
        ...sharedFields,
      };

    default:
      return {} as z.infer<typeof formSchema>;
  }
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
        description: item.description ?? "",
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
