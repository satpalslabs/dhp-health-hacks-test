import { z } from "zod";
import {
    FileText,
    Layers,
    LinkIcon,
    Youtube,
} from "lucide-react";


export const iconSchema = z.object({
    id: z.number().nullable(),
    size: z.number(),
    mime: z.string(),
    height: z.number(),
    width: z.number(),
    name: z.string(),
    url: z.string(),
});

const webPageExpandableSectionsSchema = z.object({
    __component: z.literal("webpage.expandable-sections"),
    title: z.string().nonempty({ message: "This field is required" }),
    content: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageShortTextsSchema = z.object({
    __component: z.literal("webpage.short-text"),
    text: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageRichTextsSchema = z.object({
    __component: z.literal("webpage.rich-text"),
    text: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageQuotesSchema = z.object({
    __component: z.literal("webpage.quote"),
    user_name: z.string().nonempty({ message: "This field is required" }),
    quote: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageQuoteSectionsSchema = z.object({
    __component: z.literal("webpage.quote-section"),
    title: z.string().nonempty({ message: "This field is required" }),
    description: z.string().nullable(),
    Quotes: z.array(
        z.object({
            user_name: z.string().nonempty({ message: "This field is required" }),
            quote: z.string().nonempty({ message: "This field is required" }),
            accordion_group_id: z.string().nullable()
        })),
    accordion_group_id: z.string().nullable(),
});
const webPageDividerSchema = z.object({
    __component: z.literal("webpage.divider"),
    // alignment: z.enum(["center", "left", "right"]).nullable(),
    color: z.string().nonempty({ message: "This field is required" }),
    type: z.string().nullable(),
    accordion_group_id: z.string().nullable(),
});
const webPageImageSchema = z.object({
    __component: z.literal("webpage.image"),
    image: iconSchema.nullable(),
    caption: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageVideosSchema = z.object({
    __component: z.literal("webpage.video"),
    url: z.string().nullable(),
    src: z.enum(["Others", "YouTube"]).nullable(),
    title: z.string().nonempty({ message: "This field is required" }),
    video: iconSchema.nullable(),
    accordion_group_id: z.string().nullable(),
});
const webPageSectionsSchema = z.object({
    __component: z.literal("webpage.sections"),
    title: z.string().nonempty({ message: "This field is required" }),
    content: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageImageSectionsSchema = z.object({
    __component: z.literal("webpage.image-section"),
    title: z.string().nonempty({ message: "This field is required" }),
    image: iconSchema.nullable(),
    caption: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageVideoTestimonialsSchema = z.object({
    __component: z.literal("webpage.video-testimonials"),
    url: z.string().nullable(),
    testimonial: z.string().nonempty({ message: "This field is required" }),
    video_src: z.enum(["Others", "YouTube"]).nullable(),
    title: z.string().nonempty({ message: "This field is required" }),
    video: iconSchema.nullable(),
    accordion_group_id: z.string().nullable(),
});

const webPageCardSchema = z.object({
    __component: z.literal("webpage.card"),
    url: z.string().nullable(),
    title: z.string().nonempty({ message: "This field is required" }),
    description: z.string().nullable(),
    accordion_group_id: z.string().nullable(),
    bg_image: iconSchema.nullable(),
});

const webPageStoryCardSchema = z.object({
    __component: z.literal("webpage.story-card"),
    web_url: z.string().nullable(),
    title: z.string().nonempty({ message: "This field is required" }),
    user_name: z.string().nonempty({ message: "This field is required" }),
    bg_image: iconSchema.nullable(),
    description: z.string().nullable(),
    accordion_group_id: z.string().nullable(),
});

const webPageReviewCardSchema = z.object({
    __component: z.literal("webpage.review-card"),
    title: z.string().nonempty({ message: "This field is required" }),
    user_name: z.string().nonempty({ message: "This field is required" }),
    summary: z.string().nonempty({ message: "This field is required" }),
    web_url: z.string().nullable(),
    user_photo: iconSchema.nullable(),
    accordion_group_id: z.string().nullable(),
});

const webPageReviewSectionSchema = z.object({
    __component: z.literal("webpage.review-section"),
    title: z.string().nonempty({ message: "This field is required" }),
    description: z.string().nullable(),
    reviews: z.array(
        z.object({
            title: z.string().nonempty({ message: "This field is required" }),
            user_name: z.string().nonempty({ message: "This field is required" }),
            summary: z.string().nonempty({ message: "This field is required" }),
            web_url: z.string().nullable(),
            user_photo: iconSchema.nullable(),
            accordion_group_id: z.string().nullable(),
        })
    ),
    accordion_group_id: z.string().nullable(),
});

const webPageCategoryCardSchema = z.object({
    __component: z.literal("webpage.category-card"),
    name: z.string().nonempty({ message: "This field is required" }),
    icon: iconSchema.nullable(),
    accordion_group_id: z.string().nullable(),
});


const webPagePercentageCardSchema = z.object({
    __component: z.literal("webpage.percentage-card"),
    title: z.string().nonempty({ message: "This field is required" }),
    description: z.string().nullable(),
    percentage: z.number(),
    icon: iconSchema.nullable(),
    accordion_group_id: z.string().nullable(),
});
const webPagePercentageCardSectionsSchema = z.object({
    __component: z.literal("webpage.percentage-card-section"),
    title: z.string().nonempty({ message: "This field is required" }),
    description: z.string().nullable(),
    percentage_cards: z.array(
        z.object({
            title: z.string().nonempty({ message: "This field is required" }),
            description: z.string().nullable(),
            percentage: z.number(),
            icon: iconSchema.nullable(),
            accordion_group_id: z.string().nullable(),
        })
    ),
    accordion_group_id: z.string().nullable(),
});
const webPageGuidelinesSchema = z.object({
    __component: z.literal("webpage.guidelines"),
    title: z.string().nonempty({ message: "This field is required" }),
    do_instructions: z.string().nonempty({ message: "This field is required" }),
    dont_do_instructions: z.string().nonempty({ message: "This field is required" }),
    accordion_group_id: z.string().nullable(),
});
const webPageHelplinesSchema = z.object({
    __component: z.literal("webpage.help-line"),
    title: z.string(),
    description: z.string().nullable(),
    type: z.string(),
    phone_number: z.string().nullable(),
    website_url: z.string().nullable(),
    email: z.string().nullable(),
    accordion_group_id: z.string().nullable(),
});

const webPageButtonSchema = z.object({
    __component: z.literal("webpage.button"),
    title: z.string(),
    type: z.string(),
    url: z
        .string({ message: "URL is required" })
        .url({ message: "Invalid URL" }).nullable(),
    accordion_group_id: z.string().nullable(),
});

export const webPageAccordionGroupSchema = z.object({
    __component: z.literal("webpage.accordion-group"),
    title: z.string().nonempty({ message: "" }),
    default_open: z.boolean(),
    group_id: z.string().nullable(),
    description: z.string().nullable(),
    group_content: z.array(
        z.discriminatedUnion("__component", [
            webPageExpandableSectionsSchema,
            webPageShortTextsSchema,
            webPageRichTextsSchema,
            webPageQuotesSchema,
            webPageQuoteSectionsSchema,
            webPageDividerSchema,
            webPageImageSchema,
            webPageVideosSchema,
            webPageImageSectionsSchema,
            webPageSectionsSchema,
            webPageVideoTestimonialsSchema,
            webPageStoryCardSchema,
            webPageCardSchema,
            webPageReviewCardSchema,
            webPageReviewSectionSchema,
            webPageCategoryCardSchema,
            webPagePercentageCardSchema,
            webPagePercentageCardSectionsSchema,
            webPageGuidelinesSchema,
            webPageHelplinesSchema,
            webPageButtonSchema

        ])
    ),
});

export const WebpageSchema = z.object({
    content_type: z.literal("content-webpage"),
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string(),
    old_id: z.number().nullable(),
    section: z.number().nullable().optional(),
    sub_section: z.number().nullable().optional(),
    collection: z.number().nullable(),
    thumbnail_icon: iconSchema.nullable().optional(),
    source: z.number({
        message: "Source is required",
    }).nullable(),
    content: z.array(
        z.discriminatedUnion("__component", [
            webPageAccordionGroupSchema,
            webPageExpandableSectionsSchema,
            webPageShortTextsSchema,
            webPageRichTextsSchema,
            webPageQuotesSchema,
            webPageQuoteSectionsSchema,
            webPageDividerSchema,
            webPageImageSchema,
            webPageVideosSchema,
            webPageImageSectionsSchema,
            webPageSectionsSchema,
            webPageVideoTestimonialsSchema,
            webPageStoryCardSchema,
            webPageCardSchema,
            webPageReviewCardSchema,
            webPageReviewSectionSchema,
            webPageCategoryCardSchema,
            webPagePercentageCardSchema,
            webPagePercentageCardSectionsSchema,
            webPageGuidelinesSchema,
            webPageHelplinesSchema,
            webPageButtonSchema
        ])
    ),
    tips: z.any().array(),
    quiz: z.number().array(),
    url: z
        .string({ message: "URL is required" })
        .url({ message: "Invalid URL" }),
    cover_image: iconSchema.nullable(),


})

// Zod schema
export const formSchema = z.discriminatedUnion("content_type", [
    z.object({
        content_type: z.literal("content-video"),
        title: z.string().nonempty({ message: "Title is required" }),
        description: z.string(),
        old_id: z.number().nullable().readonly(),
        section: z.number().nullable().optional(),
        sub_section: z.number().nullable().optional(),
        collection: z.number().nullable(),
        thumbnail_icon: iconSchema.nullable().optional(),
        video_duration: z.string({ message: "This Field is required" }).nullable(),
        tips: z.any().array().optional(),
        key_points: z.string().nullable().optional(),
        quiz: z.number().array(),
        url: z
            .string({ message: "URL is required" })
            .url({ message: "Invalid URL" }),
        source: z.number().nullable(),
        article_pc_id: z.string().nullable().optional(),

    }),
    z.object({
        content_type: z.literal("content-page"),
        title: z.string().nonempty({ message: "Title is required" }),
        description: z.string(),
        old_id: z.number().nullable(),
        section: z.number().nullable().optional(),
        sub_section: z.number().nullable().optional(),
        collection: z.number().nullable(),
        source: z.number().nullable(),
        tips: z.any().array(),
        quiz: z.number().array(),
        url: z
            .string({ message: "URL is required" })
            .url({ message: "Invalid URL" })
            .optional(),
        cover_image: iconSchema.nullable(),

    }),
    WebpageSchema,
    z.object({
        content_type: z.literal("article-cards"),
        title: z.string().nonempty({ message: "Title is required" }),
        section: z.number().nullable().optional(),
        sub_section: z.number().nullable().optional(),
        collection: z.number().nullable(),
        source: z.number().nullable(),
        cards: z.object({
            title: z.string().nonempty({ message: "Card Title is required" }),
            description: z.string().nonempty().optional()
        }).array(),
        cover_image: iconSchema.nullable(),
    }),
]).superRefine((data, ctx) => {
    if (!data.collection) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Collection is required",
            path: ["collection"], // Show error on section
        });
    }
    if (!data.source) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Source is required",
            path: ["Source"], // Show error on section
        });
    }
});


export const contentTypes = [
    {
        value: "content-video",
        label: "Video Article",
        icon: Youtube,
    },
    {
        value: "content-page",
        label: "NHS Article",
        icon: FileText,
    },
    {
        value: "content-webpage",
        label: "Web Page",
        icon: LinkIcon,
    },
    {
        value: "article-cards",
        label: "Article Cards",
        icon: Layers,
    },
];




