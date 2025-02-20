import PlayCircle from "@/play-cicle.svg";
import Article from "@/article-icon.svg";
import Quiz from "@/question.svg";
import MultiCheck from "@/check.svg";
import { Check, CircleHelp, Link2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArticleStep,
  JourneyStep,
  MultiSelectStep,
  PairStep,
} from "@/lib/journey-services";

export const getIcon = (type: string) => {
  switch (type) {
    case "video":
      return <PlayCircle />; // Replace with an actual icon component
    case "article":
      return <Article />;
    case "multi-select":
      return <MultiCheck />;
    case "single-select":
      return <CircleHelp />;
    case "pair":
      return <Quiz />;
    default:
      return "🔹";
  }
};

export const AddStepButtonAndDropDown = ({
  setShowStepsInMOdal,
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStepsInMOdal: React.Dispatch<
    React.SetStateAction<
      | "videos"
      | "articles"
      | "pairs"
      | "multi-select"
      | "single-select"
      | undefined
    >
  >;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="default"
        className="bg-muted w-full h-10 font-inter hover:shadow-sm text-primary dark:text-white"
      >
        <Plus />
        Add Step
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[236px]">
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            setShowStepsInMOdal("videos");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <PlayCircle />
          <span>Video</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setShowStepsInMOdal("articles");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <Article />
          <span>Article</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setShowStepsInMOdal("pairs");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <Quiz />
          <span>Matching Pairs Question</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setShowStepsInMOdal("multi-select");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <MultiCheck />
          <span>Multiple Choice Question</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setShowStepsInMOdal("single-select");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <CircleHelp />
          <span>True/False Question</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

function youtube_parser(url: string): string {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : "";
}

export function Step({ type, step }: { type: string; step: JourneyStep }) {
  switch (type) {
    case "video":
      if ("url" in step) {
        const url = youtube_parser(step?.url);
        return (
          <div className="flex flex-col gap-3 font-inter">
            <div className="flex gap-3 items-center">
              <Image
                src={"https://img.youtube.com/vi/" + url + "/mqdefault.jpg"}
                width={500}
                height={500}
                alt=""
                className="w-[120px] h-[75px] object-cover rounded-md"
              />
              <div className="flex flex-col gap-2">
                <p className="font-medium  text-lg">{step.title}</p>
                <p className="flex gap-[6px] items-center text-sm text-mobile-dark-background">
                  {step?.source}
                  <span className="w-[3px] h-[3px] rounded-full bg-gray-400"></span>
                  <span className="flex [&_svg]:size-4">
                    <Link2 className="-rotate-45" />
                    <a href={step?.url} target="_blank" className="ml-1">
                      {step?.url}
                    </a>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-medium text-sm">
                Description
              </span>
              <span className="text-sm font-normal font-inter">
                {step?.description}
              </span>
            </div>
          </div>
        );
      }
    case "article":
      if ("articles" in step) {
        return (
          <div className="flex flex-col gap-3">
            {step.articles.map(
              (_article: ArticleStep["articles"][0], ix: number) => (
                <p
                  className="w-full font-inter p-2 font-medium leading-6"
                  key={ix}
                >
                  {_article.title}
                </p>
              )
            )}
          </div>
        );
      }
    case "pair":
      if ("pairs" in step) {
        const shuffleArray = <T,>(array: T[]): T[] => {
          const shuffled = [...array];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };
        const shuffledOptions = shuffleArray(step.pairs);
        const shuffledMatches = shuffleArray(step.pairs);
        return (
          <div className="flex  w-full">
            <div className="w-1/2 flex flex-col gap-5  px-2">
              {shuffledOptions.map(
                (option: PairStep["pairs"][0], ix: number) => (
                  <div
                    className="flex gap-[10px] font-inter items-center py-2 font-medium text-sm"
                    key={ix}
                  >
                    <span className="h-6 w-6 flex text-center items-center justify-center ">
                      {ix + 1}.
                    </span>
                    <p> {option.option}</p>
                  </div>
                )
              )}
            </div>
            <div className="w-1/2 flex flex-col gap-5  px-2">
              {shuffledMatches.map(
                (match: PairStep["pairs"][0], ix: number) => (
                  <div
                    className="flex gap-[10px] font-inter items-center py-2 font-medium text-sm"
                    key={ix}
                  >
                    <span className="h-6 w-6 flex text-center items-center justify-center ">
                      {shuffledOptions.findIndex(
                        (option) => option.id == match.id
                      ) + 1}
                      .
                    </span>
                    <p> {match.match}</p>
                  </div>
                )
              )}
            </div>
          </div>
        );
      }
    case "multi-select":
    case "single-select":
      if ("options" in step) {
        return (
          <div className="flex flex-col gap-3">
            {step.options.map(
              (option: MultiSelectStep["options"][0], ix: number) => (
                <div className="flex items-center gap-5 p-2 " key={ix}>
                  <span className="h-full flex justify-center w-4 shrink-0  [&_svg]:size-4">
                    {option.isCorrect && <Check className="text-primary" />}
                  </span>
                  <p className="text-sm font-inter font-medium leading-6">
                    {option.text}
                  </p>
                </div>
              )
            )}
          </div>
        );
      }
    default:
      <>test</>;
  }
}
