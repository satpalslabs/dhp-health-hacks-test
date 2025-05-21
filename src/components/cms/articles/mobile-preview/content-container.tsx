import ContentCard, {
  CardContentProps,
  cardVariants,
} from "@/components/ui/content-card";
import { Article } from "@/types";
import React, { useEffect, useState } from "react";
import NHS_Article from "@/nhs-article.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import youtube_parser from "@/lib/you-tube-thumbnail";
import { motion, PanInfo } from "framer-motion";
import Play from "@/play.svg";

interface ContentData extends CardContentProps {
  article: Article;
}

export const ContentContainer = React.forwardRef<HTMLDivElement, ContentData>(
  ({ className, article, align, ...props }, ref) => {
    if (article?.content_type?.type == "article-cards") {
      return <TinderCards cards={article.cards ?? []} article={article} />;
    } else {
      return (
        <ContentCard align={align} ref={ref} className={className} {...props}>
          <div
            className={`w-full h-[104px] group-data-[align='horizontal']:w-[122px] shrink-0 group-data-[align='horizontal']:h-full ${
              article.content_type?.type == "content-page"
                ? "bg-primary"
                : "bg-white group-data-[mode='dark']:bg-mobile-dark-article"
            } `}
          >
            <CardBanner article={article} />
          </div>
          <CardDetails article={article} />
        </ContentCard>
      );
    }
  }
);
ContentContainer.displayName = "content container";

export const ContentContainerSkeleton = ({
  className,
  ...props
}: { className?: string } & React.ComponentPropsWithoutRef<
  typeof Skeleton
>) => {
  return (
    <Skeleton
      className={cn(cardVariants({ align: "vertical", className }))}
      {...props}
    />
  );
};

export const CardBanner = ({ article }: { article: Article }) => {
  switch (article.content_type?.type) {
    case "content-page":
      return (
        <div className="[&_svg]:h-[29px] [&_svg]:w-[71px] h-full flex flex-col gap-3 items-center justify-center">
          {article.source ? (
            <Image
              src={article.source.logo?.url ?? "/nhs-article.svg"}
              height={400}
              width={400}
              alt="NHS article"
              className="w-[72px] h-[29px]"
            />
          ) : (
            <NHS_Article />
          )}
          <div className="text-xs text-white font-mulish font-semibold group-data-[align='horizontal']:text-[10px]">
            Supplied by the NHS
          </div>
        </div>
      );
    case "content-webpage":
      const sourceLogo = article.source?.logo;
      return (
        <div className=" w-full shrink-0 h-full relative flex items-center justify-center">
          {article.thumbnail_icon || sourceLogo ? (
            <Image
              src={
                article.thumbnail_icon
                  ? article.thumbnail_icon?.url
                  : sourceLogo?.url ?? ""
              }
              alt="article thumbnail icon"
              width={600}
              height={600}
              className={` bg-transparent ${
                sourceLogo && !article.thumbnail_icon
                  ? " w-[120px] h-fit object-center m-auto"
                  : " h-full w-full object-cover"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-mobile-primary"></div>
          )}
          <Link
            href={article?.url ?? ""}
            target="_blank"
            className={`bg-white absolute top-2 right-2 bg-opacity-65 text-mobile-primary p-1 rounded-full `}
          >
            <ExternalLink className="w-full h-auto" />
          </Link>
        </div>
      );
    case "content-video":
      // case undefined
      const youtube_thumbnail = article?.url ? youtube_parser(article.url) : "";
      return (
        <div className=" w-full shrink-0 h-full relative">
          {article.thumbnail_icon || youtube_thumbnail ? (
            <Image
              src={
                article.thumbnail_icon?.url
                  ? article.thumbnail_icon?.url
                  : youtube_thumbnail
                  ? youtube_thumbnail
                  : ""
              }
              alt="article thumbnail icon"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-mobile-primary"></div>
          )}
          <button className="absolute top-2 right-2 p-[6px] [&_svg]:size-[13px] rounded-full z-10 text-mobile-dark-article bg-white">
            <Play />
          </button>
        </div>
      );
  }
};

const CardDetails = ({ article }: { article: Article }) => (
  <div className="flex flex-col gap-3 group-data-[align='horizontal']:flex-col-reverse group-data-[align='horizontal']:my-auto w-full overflow-hidden">
    <ButtonGroup article={article} />
    <div className="mt-[1px] font-mulish text-base font-semibold px-4 leading-5 line-clamp-2 group-data-[mode='dark']:text-white ">
      {article.title}
    </div>
  </div>
);

export const ButtonGroup = ({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) => (
  <div
    className={cn(
      `flex gap-1 justify-between px-4 w-full font-mulish font-semibold text-sm ${
        className ? className : ""
      }`
    )}
  >
    <Button
      variant={"outline"}
      className={`h-[20px] !text-[11px] rounded-[10px] !bg-transparent  dark:border-[#71717A] border-[#71717A]   group-data-[mode='dark']:!border-button-filter-text hover:text-[#71717A] text-[#71717A] ${
        article?.content_type?.type == "content-webpage"
          ? "w-[62px]"
          : "w-[55px]"
      }`}
    >
      {article?.content_type?.type == "content-page"
        ? "Article"
        : article?.content_type?.type == "content-webpage"
        ? "Webpage"
        : "Video"}
    </Button>
    {article?.quiz && article.quiz.length > 0 && (
      <Button
        variant={"outline"}
        className="h-[20px] w-[55px] !text-[11px] rounded-[10px] !bg-transparent  dark:border-[#71717A] border-[#71717A]   group-data-[mode='dark']:!border-button-filter-text hover:text-[#71717A] text-[#71717A]"
      >
        Quiz
      </Button>
    )}
  </div>
);

const TinderCards = ({
  cards,
  article,
}: {
  cards: { title: string; description?: string }[];
  article: Article;
}) => {
  const [activeIndex, setActiveIndex] = useState(cards.length - 1); // Last card active

  useEffect(() => {
    setActiveIndex(cards.length - 1);
  }, [cards]);

  const handleNext = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  const handlePrev = () => {
    if (activeIndex < cards.length - 1) setActiveIndex((prev) => prev + 1);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      handleNext();
    }
  };

  return (
    <div className="bg-background  px-8 pt-6 flex flex-col gap-5 w-[355px] h-[558px] mx-auto rounded-xl shadow-lg">
      <p className="font-poppins font-semibold text-2xl h-[30px]">
        {article.title}
      </p>

      <div className="relative w-full grow pt-4">
        {cards
          .slice(Math.max(activeIndex - 4, 0), activeIndex + 1)
          .map((card, index, arr) => {
            const isActive = index === arr.length - 1;
            const scale = isActive ? 1 : 1 - (arr.length - 1 - index) * 0.05;
            const yOffset = (arr.length - 1 - index) * 16;

            return (
              <motion.div
                key={index}
                className="absolute w-full h-[439px] border-2 bg-white group-data-[mode='dark']:text-white group-data-[mode='dark']:bg-mobile-dark-background bg-background border-border rounded-lg overflow-y-auto no-scrollbar"
                style={{ transformOrigin: "center", zIndex: index }}
                initial={{ scale: 1, y: 0, opacity: 0.5 }}
                animate={{ scale, y: -yOffset, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }} // Exit animation when moving forward
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
              >
                <div className="px-[22px] py-4 flex flex-col gap-6">
                  <p className="font-poppins text-lg font-semibold">
                    {card.title}
                  </p>
                  <p className="font-mulish text-lg font-semibold">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        {cards.length > 0 && (
          <>
            {/* Left (Move Back) Button */}
            <button
              type="button"
              className="h-[30px] w-[30px] absolute top-1/2 left-0 z-20 -translate-x-1/2 -translate-y-1/2 bg-border flex items-center justify-center font-normal [&_svg]:size-4 rounded-full"
              onClick={handlePrev}
              disabled={activeIndex === cards.length - 1}
            >
              <ChevronLeft />
            </button>

            {/* Right (Next Card) Button */}
            <button
              type="button"
              className="h-[30px] w-[30px] absolute top-1/2 right-0 z-20 translate-x-1/2 -translate-y-1/2 bg-border flex items-center justify-center font-normal [&_svg]:size-4 rounded-full"
              onClick={handleNext}
              disabled={activeIndex === 0}
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
