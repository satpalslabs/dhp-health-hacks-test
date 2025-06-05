import { Article, Icon, WebpageComponent } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Play from "@/play.svg";
import Pause from "@/pause.svg";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import YouTube, {
  YouTubeProps,
  YouTubePlayer as YouTubePlayerType,
} from "react-youtube";
import { getYouTubeVideoId } from "@/lib/you-tube-thumbnail";

export default function ContentComponent({
  article,
}: {
  article: Article | undefined;
}) {
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  function showComponents(item: WebpageComponent) {
    switch (item.__component) {
      case "webpage.short-text":
        return (
          <div className=" font-mulish leading-[20px] border-[#ededed] py-1  font-normal">
            {item.text}
          </div>
        );
      case "webpage.divider":
        return (
          <hr
            style={{
              borderColor: item.color,
            }}
          />
        );
      case "webpage.image":
      case "webpage.image-section":
        return (
          <div className="flex flex-col gap-[10px]">
            {"title" in item && (
              <div className="text-lg font-poppins font-medium leading-[22px] ">
                {item.title}
              </div>
            )}
            {item.image?.url && (
              <Image
                src={item.image?.url ?? ""}
                height={400}
                width={400}
                alt={item.image.name}
                className="h-[165px] object-cover w-full rounded-lg"
              />
            )}
            <div className="text-lg font-mulish leading-[22px] ">
              {item.caption}
            </div>
          </div>
        );

      case "webpage.quote":
        return <Quote quote={item} />;
      case "webpage.percentage-card":
        return <StatisticCard statistic_card={item} />;
      case "webpage.percentage-card-section":
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-poppins font-medium leading-[100%]">
                {item.title}
              </div>
              <div className="font-mulish leading-[21px]">
                {item.description}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {item.percentage_cards.map((_item, ix) => (
                <StatisticCard statistic_card={_item} key={ix} />
              ))}
            </div>
          </div>
        );
      case "webpage.card":
        return (
          <div
            className="w-full rounded-[10px] pb-[38px] overflow-hidden bg-mobile-gray group-data-[mode='dark']:bg-mobile-dark-article flex flex-col gap-2"
            style={{
              boxShadow: "var(--mobile-card-shadow)",
            }}
          >
            <div className="w-full h-[191px] group-data-[align='horizontal']:w-[122px] shrink-0 group-data-[align='horizontal']:h-full bg-mobile-primary ">
              <div className=" w-full shrink-0 h-full relative">
                {item.bg_image ? (
                  <Image
                    src={item.bg_image?.url ?? ""}
                    alt="article thumbnail icon"
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-mobile-primary"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 px-[14px]">
              <div className="flex items-center [&_svg]:size-6 text-mobile-text-firstSection">
                <div className="text-lg font-poppins font-medium leading-[100%]">
                  {item.title}
                </div>
                <ChevronRight />
              </div>
              <div className="text-[15px] font-mulish leading-[20px]">
                {item.description}
              </div>
            </div>
          </div>
        );
      case "webpage.category-card":
        return (
          <div className="flex flex-col items-center text-center gap-2 pt-[18px] pb-[13px] bg-mobile-gray group-data-[mode='dark']:bg-mobile-dark-card rounded-[10px]">
            {item.icon && (
              <Image
                src={item.icon?.url ?? ""}
                alt="article thumbnail icon"
                width={600}
                height={600}
                className="h-[100px] w-fit object-cover"
              />
            )}
            <div className="flex items-center [&_svg]:size-6 ">
              <div className="text-lg font-poppins font-medium leading-[100%]">
                {item.name}
              </div>
              <ChevronRight />
            </div>
          </div>
        );

      case "webpage.quote-section":
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-poppins font-medium leading-[100%]">
                {item.title}
              </div>
              <div className="font-mulish leading-[21px]">
                {item.description}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {item.Quotes.map((quote, ix) => (
                <Quote
                  quote={quote as { quote: string; user_name: string }}
                  key={ix}
                />
              ))}
            </div>
          </div>
        );
      case "webpage.guidelines":
        return (
          <div className="flex flex-col gap-3">
            <div className="text-lg font-poppins font-medium leading-[100%]">
              {item.title}
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-poppins font-medium leading-[100%]">
                Do:
              </div>
              <div className="no-tailwind ">
                <div
                  className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2]:!text-[20.1px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white [&_h2]:!text-white [&_h1]:!text-white [&_h3]:!text-white [&_h4]:!text-white"
                  dangerouslySetInnerHTML={{ __html: item.do_instructions }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="text-sm font-poppins font-medium leading-[100%]">
                Don’t:
              </div>
              <div className="no-tailwind ">
                <div
                  className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white"
                  dangerouslySetInnerHTML={{
                    __html: item.dont_do_instructions,
                  }}
                />
              </div>
            </div>
          </div>
        );
      case "webpage.rich-text":
        return (
          <div className="no-tailwind ">
            <div
              className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2]:!text-[20.1px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white [&_h2]:!text-white [&_h1]:!text-white [&_h3]:!text-white [&_h4]:!text-white"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          </div>
        );

      case "webpage.sections":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1 flex-col">
              <div className="font-[600] text-base">{item.title}</div>
              <div className="no-tailwind ">
                <div
                  className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2]:!text-[20.1px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white [&_h2]:!text-white [&_h1]:!text-white [&_h3]:!text-white [&_h4]:!text-white"
                  dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
                />
              </div>
            </div>
          </div>
        );

      case "webpage.expandable-sections":
        return (
          <Collapsible className="group">
            <CollapsibleTrigger className="cursor-pointer flex justify-between w-full text-left">
              <p className="break-words font-poppins text-sm font-medium">
                {item.title}
              </p>
              <ChevronDown className="transition-all group-data-[state='open']:rotate-180 shrink-0" />
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full mt-2">
              <div className="no-tailwind">
                <div
                  className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2]:!text-[20.1px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white [&_h2]:!text-white [&_h1]:!text-white [&_h3]:!text-white [&_h4]:!text-white"
                  dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      case "webpage.video":
        return (
          <div className="flex flex-col gap-2 ">
            <p className="italic font-poppins font-medium leading-[100%]">
              {item.title}
            </p>
            {item.video && item.src == "Others" ? (
              <div className="relative max-w-full h-[165px] bg-primary">
                <video
                  id="player2"
                  className="w-full object-cover h-full"
                  ref={videoRef}
                  onEnded={() => {
                    videoRef.current?.pause();
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                    setVideoIsPlaying(false);
                  }}
                >
                  <source
                    src={item.video ? item.video?.url + "&amp;controls=0" : ""}
                    type="video/mp4"
                  />
                </video>
                <button
                  onClick={() => {
                    if (videoIsPlaying) {
                      videoRef.current?.pause();
                      setVideoIsPlaying(false);
                    } else {
                      videoRef.current?.play();
                      setVideoIsPlaying(true);
                    }
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full z-10 text-mobile-dark-article bg-white  [&_svg]:size-6"
                >
                  {videoIsPlaying ? <Pause /> : <Play />}
                </button>
              </div>
            ) : (
              <>{item.url && <YouTubePlayer url={item.url} />}</>
            )}
          </div>
        );
      case "webpage.help-line":
        return (
          <div className="w-full rounded-[10px] overflow-hidden bg-mobile-gray group-data-[mode='dark']:bg-mobile-dark-card flex flex-col gap-2 px-3 py-[22px]">
            <div className=" font-poppins font-medium leading-[100%]">
              {item.title}
            </div>
            <div
              className=" font-mulish [&_p]:!text-sm [&_p_*]:!text-sm [&_p]:!leading-[20px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px]"
              dangerouslySetInnerHTML={{ __html: item.description ?? "" }}
            />
            <div className="w-full h-10 text-base text-white text-center flex items-center justify-center font-mulish font-semibold bg-gradient-mobile-button rounded-full">
              Find out more
            </div>
          </div>
        );
      case "webpage.review-card":
        return <ReviewCard review={item} />;
      case "webpage.accordion-group":
        const content =
          "group_content" in item
            ? (item.group_content as WebpageComponent[])
            : [];
        return (
          <Collapsible defaultOpen={item.default_open} className="group">
            <CollapsibleTrigger className="cursor-pointer flex justify-between w-full text-left">
              <p className="break-words font-poppins text-base font-medium">
                {item.title}
              </p>
              <ChevronDown className="transition-all group-data-[state='open']:rotate-180 shrink-0" />
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full mt-2">
              <div className="flex flex-col gap-3 text-[#3C3C3B] group-data-[mode='dark']:text-white">
                {content?.map((i, ix) => {
                  if (showComponents(i)) {
                    return (
                      <div className="" key={ix}>
                        {showComponents(i)}
                      </div>
                    );
                  }
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      case "webpage.review-section":
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-poppins font-medium leading-[100%]">
                {item.title}
              </div>
              <div className="font-mulish leading-[21px]">
                {item.description}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {item.reviews.map((_item, ix) => (
                <ReviewCard review={_item} key={ix} />
              ))}
            </div>
          </div>
        );
      case "webpage.story-card":
        return (
          <div className="bg-mobile-gray  group-data-[mode='dark']:bg-mobile-dark-card rounded-lg">
            <Image
              src={item.bg_image?.url ?? ""}
              className="h-[148px] w-full object-cover rounded-t-lg"
              width={800}
              height={800}
              alt="icon"
            />
            <div className="flex flex-col gap-2 p-3">
              <div className="font-poppins leading-[21px] text-mobile-text-firstSection font-medium">
                {item.title}
              </div>
              <div className="text-sm font-mulish leading-5">
                {item.description}
              </div>
              <div className="w-full cursor-pointer h-10 text-base text-white text-center flex items-center justify-center font-mulish font-semibold bg-gradient-mobile-button rounded-full">
                Read {item.user_name} story
              </div>
            </div>
          </div>
        );
      case "webpage.video-testimonials":
        return (
          <div className="bg-mobile-gray  group-data-[mode='dark']:bg-mobile-dark-card rounded-lg overflow-hidden">
            {item.video && item.video_src == "Others" ? (
              <div className="relative max-w-full h-[165px] bg-primary">
                <video
                  id="player2"
                  className="w-full object-cover h-full"
                  ref={videoRef}
                  onEnded={() => {
                    videoRef.current?.pause();
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                    setVideoIsPlaying(false);
                  }}
                >
                  <source
                    src={item.video ? item.video?.url + "&amp;controls=0" : ""}
                    type="video/mp4"
                  />
                </video>
                <button
                  onClick={() => {
                    if (videoIsPlaying) {
                      videoRef.current?.pause();
                      setVideoIsPlaying(false);
                    } else {
                      videoRef.current?.play();
                      setVideoIsPlaying(true);
                    }
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full z-10 text-mobile-dark-article bg-white  [&_svg]:size-6"
                >
                  {videoIsPlaying ? <Pause /> : <Play />}
                </button>
              </div>
            ) : (
              <>{item.url && <YouTubePlayer url={item.url} />}</>
            )}
            <div className="flex flex-col gap-2 p-3">
              <div className="font-poppins leading-[21px] text-mobile-text-firstSection font-medium">
                {item.title}
              </div>
              <div className="no-tailwind">
                <div
                  className="font-mulish [&_p]:leading-[100%] [&_*]:!leading-[100%]  [&_p]:!text-sm [&_p_*]:!text-sm  group-data-[mode='dark']:[&_p]:!text-white [&_h2]:!text-[20.1px] [&_h2_*]:!text-[20.1px] [&_h2]:!leading-[21px] [&_h3_*]:!text-[18.1px] [&_h3]:!leading-[21px] [&_h1_*]:!text-[21.1px] [&_h1]:!leading-[28px] [&_h1]:!text-[21.1px] [&_div]:!bg-transparent [&_div_*]:!bg-transparent [&_*]:!bg-transparent [&_p_span]:text-white [&_h2]:!text-white [&_h1]:!text-white [&_h3]:!text-white [&_h4]:!text-white"
                  dangerouslySetInnerHTML={{ __html: item.testimonial }}
                ></div>
              </div>
            </div>
          </div>
        );
      case "webpage.button":
        return (
          <div className="w-full cursor-pointer h-10 text-base text-white text-center flex items-center justify-center font-mulish font-semibold bg-gradient-mobile-button rounded-full">
            {item.title}
          </div>
        );
      //     default:
      //       return "";
    }
  }
  return (
    <div className="flex flex-col gap-3 text-[#3C3C3B] group-data-[mode='dark']:text-white border-t border-[#ededed] pt-2">
      {article?.content?.map((i, ix) => {
        if (showComponents(i)) {
          return (
            <div className="" key={ix}>
              {showComponents(i)}
            </div>
          );
        }
      })}
    </div>
  );
}

const Quote = ({ quote }: { quote: { quote: string; user_name: string } }) => {
  return (
    <div className="bg-mobile-gray py-3 px-4 text-center flex flex-col gap-2 group-data-[mode='dark']:bg-mobile-dark-card rounded-lg">
      <div className="font-mulish leading-[21px]">{quote.quote}</div>
      <div className="text-[12.4px] font-mulish leading-[100%]">
        {quote.user_name}
      </div>
    </div>
  );
};

const ReviewCard = ({
  review,
}: {
  review: {
    title: string;
    user_name: string;
    user_photo: Icon | null;
    web_url: string | null;
    summary: string;
  };
}) => {
  return (
    <div className="bg-mobile-gray py-3 px-3 flex flex-col gap-2 group-data-[mode='dark']:bg-mobile-dark-card rounded-lg">
      <Image
        src={review.user_photo?.url ?? ""}
        className="h-[165px] w-full object-cover rounded-lg"
        width={800}
        height={800}
        alt="icon"
      />
      <div className="font-poppins leading-[21px] text-mobile-text-firstSection font-medium">
        {review.title}
      </div>
      <div className="text-sm font-poppins font-semibold leading-[100%]">
        {review.user_name}
      </div>
      <div className="text-sm font-mulish leading-5">{review.summary}</div>
    </div>
  );
};

const StatisticCard = ({
  statistic_card,
}: {
  statistic_card: {
    title: string;
    description: string | null;
    percentage: number;
    icon: Icon | null;
  };
}) => {
  return (
    <div className="bg-mobile-gray text-black group-data-[mode='dark']:text-white pt-[31px] pb-[21px] px-4 text-center flex flex-col gap-1 overflow-hidden group-data-[mode='dark']:bg-mobile-dark-card rounded-lg relative">
      {statistic_card.icon && (
        <Image
          src={statistic_card.icon.url}
          className="h-[50px] w-[45px] absolute -top-4 left-1/2 -translate-x-1/2"
          width={400}
          height={400}
          alt="icon"
        />
      )}
      <div className="font-mulish font-medium text-[32px]  leading-[100%] relative z-10">
        {statistic_card.percentage ?? 0}%
      </div>
      <div className="text-sm font-poppins font-medium leading-[100%]">
        {statistic_card.title}
      </div>
      <div className="text-xs font-mulish leading-[14px] text-[#767676]  group-data-[mode='dark']:text-white">
        {statistic_card.description}
      </div>
    </div>
  );
};

export const YouTubePlayer = ({ url }: { url: string }) => {
  const playerRef = useRef<YouTubePlayerType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState<null | string>(null);

  const opts: YouTubeProps["opts"] = {
    height: "165",
    width: "100%",
    playerVars: {
      controls: 0, // Hides play/pause and progress bar
      modestbranding: 1, // Reduces YouTube branding
      rel: 0, // Prevents showing related videos from other channels
      disablekb: 1, // Disable keyboard controls
      fs: 0, // Disable fullscreen button
      iv_load_policy: 3, // Hides video annotations
      showinfo: 0, // Deprecated, no longer functional
      playsinline: 1, // Plays video inline on mobile devices
    },
  };
  useEffect(() => {
    const _videoId = getYouTubeVideoId(url);
    setVideoId(_videoId);
    setIsPlaying(false);
  }, [url]);

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    playerRef.current.pauseVideo();
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-fit">
      <div className="relative">
        <YouTube videoId={videoId} opts={opts} onReady={onReady} />
        <div
          className="absolute top-0 left-0 w-full h-full z-10 "
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
      <button
        onClick={() => {
          handlePlayPause();
        }}
        className="absolute top-3 right-3 p-2 rounded-full z-10 text-mobile-dark-article bg-white  [&_svg]:size-6 "
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
};
