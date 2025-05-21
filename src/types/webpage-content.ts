import { Icon } from ".";

type webPageExpandableGroup = {
    __component: "webpage.accordion-group";
    title: string;
    default_open: boolean;
    group_id: string | null;
    group_content?: WebpageComponent[]
    description: string | null;
}

type webPageExpandableSection = {
    __component: "webpage.expandable-sections";
    title: string;
    content: string;
    accordion_group_id: string | null
}

type webPageShortText = {
    __component: "webpage.short-text";
    text: string;
    accordion_group_id: string | null
}

type webPageRichText = {
    __component: "webpage.rich-text";
    text: string;
    accordion_group_id: string | null
}

type webPageTextBlock = {
    __component: "webpage.text-block";
    title?: string;
    content?: string;
    accordion_group_id: string | null
}

type webPageQuote = {
    __component: "webpage.quote";
    user_name: string;
    quote: string;
    accordion_group_id: string | null
}

type webPageQuoteSection = {
    __component: "webpage.quote-section";
    title: string;
    description: string | null;
    accordion_group_id: string | null;
    Quotes: {
        user_name: string;
        quote: string;
        accordion_group_id: string | null
    }[]
}

type webPageDivider = {
    __component: "webpage.divider";
    // alignment: "center" | "left" | "right" | null;
    color: string;
    type: string | null;
    accordion_group_id: string | null

}

type webPageImage = {
    __component: "webpage.image";
    image: Icon | null;
    caption: string;
    accordion_group_id: string | null;
}

type webPageVideo = {
    __component: "webpage.video";
    title: string;
    src: "Others" | "YouTube" | null;
    url: string | null;
    video: Icon | null;
    accordion_group_id: string | null;
}

type WebpageSections = {
    __component: "webpage.sections";
    title: string;
    content: string;
    accordion_group_id: string | null;
}

type webpageImageSection = {
    __component: "webpage.image-section";
    title: string;
    image: Icon | null;
    caption: string;
    accordion_group_id: string | null;
}


type webPageVideoTestimonial = {
    __component: "webpage.video-testimonials";
    url: string | null;
    testimonial: string;
    video_src: "Others" | null | "YouTube";
    title: string;
    video: Icon | null;
    accordion_group_id: string | null;

}
type webPageCard = {
    __component: "webpage.card";
    title: string;
    url: string | null;
    bg_image: Icon | null;
    description: string | null;
    accordion_group_id: string | null;
}
type webPageStoryCard = {
    __component: "webpage.story-card";
    web_url: string | null;
    title: string;
    user_name: string;
    bg_image: Icon | null;
    description: string | null;
    accordion_group_id: string | null;
}
type webPageReviewCard = {
    __component: "webpage.review-card";
    title: string;
    user_name: string;
    summary: string;
    web_url: string | null;
    user_photo: Icon | null;
    accordion_group_id: string | null;
}
type webPageReviewSection = {
    __component: "webpage.review-section";
    title: string;
    description: string | null;
    accordion_group_id: string | null;
    reviews: {
        title: string;
        user_name: string;
        summary: string;
        user_photo: Icon | null;
        web_url: string | null;
        accordion_group_id: string | null;

    }[]
}
type webPageCategoryCard = {
    __component: "webpage.category-card";
    name: string;
    accordion_group_id: string | null;
    icon: Icon | null;
}
type webPagePercentageCard = {
    __component: "webpage.percentage-card";
    title: string;
    description: string | null;
    percentage: number;
    accordion_group_id: string | null;
    icon: Icon | null;
}
type webPagePercentageCardsSection = {
    __component: "webpage.percentage-card-section";
    title: string;
    description: string | null;
    accordion_group_id: string | null;
    percentage_cards: {
        title: string;
        description: string | null;
        percentage: number;
        accordion_group_id: string | null;
        icon: Icon | null;
    }[]
}
type webPageGuideLines = {
    __component: "webpage.guidelines";
    title: string;
    do_instructions: string;
    dont_do_instructions: string;
    accordion_group_id: string | null
}
type webPageHelpLine = {
    __component: "webpage.help-line";
    title: string;
    description: string | null;
    type: string;
    phone_number: null | string;
    website_url: string | null;
    email: string | null;
    accordion_group_id: string | null
}
type webPageButton = {
    __component: "webpage.button";
    title: string;
    url: string | null;
    type: string;
    accordion_group_id: string | null

}

type WebpageComponent =
    | webPageExpandableGroup
    | webPageExpandableSection
    | webPageShortText
    | webPageRichText
    | webPageQuote
    | webPageQuoteSection
    | webPageDivider
    | webPageImage
    | webPageVideo
    | webpageImageSection
    | WebpageSections
    | webPageVideoTestimonial
    | webPageStoryCard
    | webPageCard
    | webPageReviewCard
    | webPageReviewSection
    | webPageCategoryCard
    | webPagePercentageCard
    | webPagePercentageCardsSection
    | webPageGuideLines
    | webPageHelpLine
    | webPageButton


export type {
    webPageExpandableGroup, webPageExpandableSection, webPageShortText, webPageRichText, webPageTextBlock, webPageQuote, webPageQuoteSection, webPageDivider, webPageImage, webPageVideo, WebpageSections, webpageImageSection, webPageVideoTestimonial, webPageCard, webPageStoryCard, webPageReviewCard, webPageReviewSection, webPageCategoryCard, webPagePercentageCard, webPagePercentageCardsSection, webPageGuideLines, webPageHelpLine, webPageButton, WebpageComponent
}