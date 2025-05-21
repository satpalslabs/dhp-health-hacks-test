import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ChevronDown,
  FileText,
  GripVertical,
  PencilLine,
  Trash2,
  TriangleAlert,
  Youtube,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DropdownActions from "./dropdown-actions";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import type { Article, Pack, Quiz, Tip } from "@/types";
import { PacksContext } from "@/context/pack-data-provider";
import { ArticleContext } from "@/context/article-data-provider";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import Link from "next/link";
import AddOrEditTip from "@/components/cms/tips/manage-tip";
import AddOrEditQuizForm from "@/components/cms/quiz/manage-quiz";
import ActionConfirmationDialog from "@/components/cms/journey/confirmation-dialog";

const ReorderContent = ({
  tip,
  quiz,
  packData,
  index,
  activePackIndex,
  setPackData,
}: {
  tip?: Tip;
  quiz?: Quiz;
  packData: Pack;
  index: number;
  activePackIndex: number;
  setPackData: React.Dispatch<React.SetStateAction<Pack | undefined>>;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState<Tip | Quiz | undefined>(
    tip || quiz || undefined
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const { articles: allArticles } = useContext(ArticleContext);
  const { packs, updatePacks } = useContext(PacksContext);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  useEffect(() => {
    setData(tip || quiz);
  }, [tip, quiz]);

  useEffect(() => {
    const contentArticles = allArticles.filter(
      (i) =>
        i.id && (data?.articles?.includes(i.id) || data?.videos?.includes(i.id))
    );
    setArticles(contentArticles);
  }, [data]);
  return (
    <Draggable
      key={data?.id}
      draggableId={(data?.id ?? "").toString() + "_section"}
      index={index}
    >
      {(provided) => (
        <>
          <Collapsible
            className="group/collapsible border border-border rounded-lg p-3"
            defaultOpen={true}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className="flex gap-2 items-center py-2">
              <div
                className="p-0 hover:bg-transparent h-fit w-fit"
                {...provided.dragHandleProps}
              >
                <GripVertical className="stroke-gray-400 w-4 h-4" />
              </div>
              <div className="grow flex justify-between items-center font-inter text-sm">
                <>
                  <p>
                    {data && "question" in data
                      ? data.question
                      : data && "title" in data
                      ? data.title
                      : ""}
                  </p>
                  <CollapsibleTrigger
                    className="cursor-pointer text-left"
                    asChild
                  >
                    <ChevronDown className="stroke-gray-400 w-4 transition-transform h-4 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </>
              </div>
              <DropdownActions>
                <>
                  <Button
                    variant="ghost"
                    className=" bg-transparent hover:bg-muted w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEditDrawer(true);
                    }}
                  >
                    <DropdownMenuItem className="w-full flex items-center outline-none gap-2">
                      <PencilLine />
                      <div className="text-sm grow text-left font-normal ">
                        Edit
                      </div>
                    </DropdownMenuItem>
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted bg-transparent items-center  w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 />
                    <div className="text-sm grow text-left font-normal ">
                      Delete
                    </div>
                  </Button>

                  <ActionConfirmationDialog
                    open={showDeleteDialog}
                    setOpen={setShowDeleteDialog}
                    handleAction={() => {
                      const updatedPacks = [...packs];
                      const updatedPackData: Pack = {
                        ...packData,
                        tips:
                          packData?.type == "tip-pack"
                            ? packData.tips.filter((i) => i !== data?.id)
                            : packData.tips,
                        quizzes:
                          packData?.type == "quiz-pack"
                            ? packData.quizzes.filter((i) => i !== data?.id)
                            : packData.quizzes,
                      };
                      updatedPacks.splice(activePackIndex, 1, updatedPackData);
                      setPackData(updatedPackData);
                      updatePacks(updatedPacks);
                      setShowDeleteDialog(false);
                    }}
                    icon={<TriangleAlert />}
                    dialog_title={`Delete ${
                      packData?.type == "tip-pack" ? "Tip" : "Quiz"
                    }?`}
                    dialog_description={`Are you sure you want to delete this ${
                      packData?.type == "tip-pack" ? "Tip" : "Quiz"
                    }? This action
                      cannot be undone.`}
                    action={"Delete"}
                  />
                </>
              </DropdownActions>
            </div>
            <CollapsibleContent>
              <div className="border-t mt-2 py-[14px] pl-3 border-border flex flex-col gap-[14px]">
                <div className="flex flex-col gap-3">
                  <p className="font-inter font-medium">
                    {data && "question" in data
                      ? data.question
                      : data && "title" in data
                      ? data.title
                      : ""}
                  </p>
                  <p className="font-inter text-sm leading-4 py-[6px] px-2 bg-muted rounded w-fit">
                    Pack: {packData.name}
                  </p>
                </div>
                {data && "description" in data && (
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground font-inter font-medium leading-5">
                      Description
                    </p>
                    <p className="font-inter text-sm leading-6">
                      {data.description}
                    </p>
                  </div>
                )}
                {articles.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground font-inter font-medium leading-5">
                      Associated Content
                    </p>
                    <div className="flex gap-2 w-full flex-wrap">
                      {articles.map((article, ix) => (
                        <Link
                          href={
                            article.content_type?.type == "content-video"
                              ? `/videos/edit/${article.id}`
                              : `/articles/edit/${article.id}`
                          }
                          key={ix}
                          className="py-1 px-3 rounded border border-border flex gap-1 items-center [&_svg]:size-4"
                        >
                          {article.content_type?.type == "content-video" ? (
                            <Youtube />
                          ) : (
                            <FileText />
                          )}
                          <p className="font-inter text-sm leading-5">
                            {article.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {tip && (
            <AddOrEditTip
              open={showEditDrawer}
              setOpen={setShowEditDrawer}
              editTip={tip.id}
              handleSubmit={(_tip) => {
                setData(_tip);
              }}
            />
          )}
          {quiz && (
            <AddOrEditQuizForm
              open={showEditDrawer}
              setOpen={setShowEditDrawer}
              editQuiz={quiz.id}
            />
          )}
        </>
      )}
    </Draggable>
  );
};

export default ReorderContent;
