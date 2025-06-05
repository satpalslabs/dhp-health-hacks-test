"use client";

import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { Ban, Globe, Inbox, PencilLine, Search, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import DropdownActions from "./dropdown-actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pack, Quiz, Tip } from "@/types";
import { AddButton } from "@/components/ui/add-button";
import { PacksContext } from "@/context/pack-data-provider";
import { TipsContext } from "@/context/tips-data-provider";
import { QuizContext } from "@/context/quiz-data-provider";
import AddOrEditPack from "../manage-pack";
import ReorderContent from "./reorder-content-section";
import { actionIcons } from "../../sections/sections-table";
import { toast } from "@/hooks/use-toast";
import StepModal from "./tips-modal";
import AddOrEditTip from "@/components/cms/tips/manage-tip";
import AddOrEditQuizForm from "@/components/cms/quiz/manage-quiz";
import ActionConfirmationDialog from "@/components/cms/journey/confirmation-dialog";

interface PackDetailedData extends Pack {
  tips_data?: Tip[];
  quizzes_data?: Quiz[];
}
const PackOverview = ({ pack }: { pack: Pack }) => {
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [packData, setPackData] = useState<PackDetailedData>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { tips } = useContext(TipsContext);
  const { quizzes } = useContext(QuizContext);
  const { packs: data, updatePacks: setData } = useContext(PacksContext);
  const [showAddTipDrawer, setShowAddTipDrawer] = useState(false);
  const [showAddNewTipModal, setShowAddNewTipModal] = useState(false);
  const [tipsData, setTipsData] = useState<Tip[]>([]);
  const [QuizData, setQuizData] = useState<Quiz[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");
  const router = useRouter();
  const activePackIndex = data.findIndex((i: Pack) => i.id === pack.id);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !packData) return;
    const newPackContent =
      packData?.type == "tip-pack"
        ? [...packData?.tips]
        : [...packData?.quizzes];

    const [movedTip] = newPackContent.splice(source.index, 1);
    newPackContent.splice(destination.index, 0, movedTip);

    const updatedPack = {
      ...packData,
      tips: packData?.type == "tip-pack" ? newPackContent : packData?.tips,
      quizzes:
        packData?.type == "quiz-pack" ? newPackContent : packData?.quizzes,
    };

    setTipsData((prev) =>
      prev.sort(
        (a, b) =>
          (a.id ? newPackContent.indexOf(a.id) : 0) -
          (b.id ? newPackContent.indexOf(b.id) : 0)
      )
    );

    setQuizData((prev) =>
      prev.sort(
        (a, b) =>
          (a.id ? newPackContent.indexOf(a.id) : 0) -
          (b.id ? newPackContent.indexOf(b.id) : 0)
      )
    );
    setPackData({ ...updatedPack });
    const updatedPacks = [...data];
    updatedPacks.splice(activePackIndex, 1, updatedPack);
    setData([...updatedPacks]);
  };

  useEffect(() => {
    const currentPack: PackDetailedData = pack;
    const tips_data = currentPack.tips
      .map((id) => tips.find((i) => i.id === id))
      .filter((i) => i != undefined);
    setTipsData(tips_data);
    currentPack.tips_data = tips_data;
    const quizzes_data = currentPack.quizzes
      .map((id) => quizzes.find((i) => i.id === id))
      .filter((i) => i != undefined);
    setQuizData(quizzes_data);
    currentPack.quizzes_data = quizzes_data;
    setPackData({ ...currentPack });
  }, [pack, quizzes, tips]);

  useEffect(() => {
    if (packData) {
      const timeoutId = setTimeout(() => {
        // Filter sections based on the input value
        if (pack.type == "tip-pack") {
          let previousTipsData = packData?.tips_data;
          previousTipsData = packData?.tips_data?.filter((i) => {
            return JSON.stringify(i)
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          });
          setTipsData([...(previousTipsData ?? [])]);
        } else {
          let previousQuizzesData = packData?.quizzes_data;
          previousQuizzesData = packData?.quizzes_data?.filter((i) => {
            return JSON.stringify(i)
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          });
          setQuizData([...(previousQuizzesData ?? [])]);
        }
      }, 300);
      // Cleanup function to clear the timeout
      return () => clearTimeout(timeoutId);
    }
  }, [inputValue, packData, pack]);
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
        <Input
          placeholder="Search"
          className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
        />
      </div>
      <div className="w-full rounded-lg border border-border ">
        <div className="flex flex-col gap-2  p-3">
          <div className="flex px-[6px] py-2 text-sm items-center font-inter justify-between leading-6">
            <div className="flex gap-2 items-center">
              <div>{packData?.name}</div>
            </div>
            <DropdownActions>
              <>
                <Button
                  variant="ghost"
                  className="flex bg-transparent gap-2 justify-center  w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenEditDrawer(true);
                  }}
                >
                  <PencilLine />
                  <div className="text-sm grow text-left font-normal">Edit</div>
                </Button>
                <Button
                  variant="ghost"
                  className="flex bg-transparent gap-2 justify-center w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAction(
                      packData?._status == "published" ? "Unpublish" : "Publish"
                    );
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DropdownMenuItem className="w-full px-0 flex items-center  gap-2 cursor-pointer">
                    <>
                      {packData?._status == "published" ? <Ban /> : <Globe />}
                    </>
                    <div className="text-sm grow text-left font-normal ">
                      {packData?._status == "published"
                        ? "Unpublish"
                        : "Publish"}
                    </div>
                  </DropdownMenuItem>
                </Button>
                <Button
                  variant="ghost"
                  className="flex bg-transparent gap-2 justify-center  w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAction("Delete");
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 />
                  <div className="text-sm grow text-left font-normal ">
                    Delete
                  </div>
                </Button>
              </>
            </DropdownActions>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              isDropDisabled={false}
              direction="vertical"
              isCombineEnabled={true}
              ignoreContainerClipping={false}
              droppableId="content"
            >
              {(provided) => (
                <div
                  className="flex gap-2 flex-col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {packData &&
                  packData?.tips.length > 0 &&
                  tipsData.length > 0 ? (
                    tipsData.map((tip: Tip, index: number) => (
                      <ReorderContent
                        key={index}
                        packData={packData}
                        tip={tip}
                        index={index}
                        activePackIndex={activePackIndex}
                        setPackData={setPackData}
                      />
                    ))
                  ) : packData &&
                    packData?.quizzes.length > 0 &&
                    QuizData.length > 0 ? (
                    QuizData.map((quiz: Quiz, index: number) => (
                      <ReorderContent
                        key={index}
                        packData={packData}
                        quiz={quiz}
                        index={index}
                        activePackIndex={activePackIndex}
                        setPackData={setPackData}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col gap-2 pb-[18px] text-center items-center text-gray-400">
                      <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
                      <div className="font-inter text-sm">
                        {(packData &&
                          packData.type == "quiz-pack" &&
                          packData.quizzes.length == 0) ||
                        (packData &&
                          packData.type == "tip-pack" &&
                          packData.tips.length == 0) ? (
                          <>
                            {`You haven't added any ${
                              packData.type == "tip-pack" ? "tips" : "quizzes"
                            } yet.`}
                            <br />
                            {`Tap 'Add ${
                              packData?.type == "tip-pack" ? "tip" : "quiz"
                            } to create a new ${
                              packData?.type == "tip-pack" ? "tip" : "quiz"
                            }.`}
                          </>
                        ) : (
                          <>No Result Found</>
                        )}
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AddButton
                className="w-full"
                text={`Add ${packData?.type == "quiz-pack" ? "Quiz" : "Tip"}`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[236px] font-inter">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddNewTipModal(true);
                }}
              >
                Select {packData?.type == "quiz-pack" ? "Quizzes" : "Tips"} from
                Library
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddTipDrawer(true);
                }}
              >
                Add New {packData?.type == "quiz-pack" ? "Quiz" : "Tip"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {packData && (
        <>
          <AddOrEditPack
            open={openEditDrawer}
            setOpen={setOpenEditDrawer}
            editPackID={pack.id}
            handleSubmit={(d) => {
              setPackData(d);
            }}
          />

          <ActionConfirmationDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            icon={actionIcons[action] || <Ban />}
            variant={action === "Delete" ? "destructive" : "secondary"}
            dialog_title={`${action} Pack?`}
            dialog_description={`Are you sure you want to ${action} <span class='font-medium'>${pack.name}</span> Pack?`}
            action={action}
            handleAction={async () => {
              // Process the update logic
              let updatedRows: Pack[] = [];
              if (action === "Delete") {
                updatedRows = data.filter((pack) => packData?.id != pack.id);
              } else {
                updatedRows = data.map((pack) =>
                  pack.id == packData?.id
                    ? {
                        ...pack,
                        _status:
                          action === "Unpublish" ? "unpublished" : "published",
                      }
                    : pack
                );
              }

              // Update state and show success toast
              setData(updatedRows);
              setDeleteDialogOpen(false);
              toast({
                title: `${action}ed Pack!`,
                description: `Your Pack has been successfully ${
                  action === "Delete" ? "deleted" : "updated"
                }`,
              });
              setDeleteDialogOpen(false);
              router.push("/packs");
            }}
          />
          {pack.type == "tip-pack" ? (
            <AddOrEditTip
              open={showAddTipDrawer}
              setOpen={setShowAddTipDrawer}
              handleSubmit={(_tip) => {
                const updatedPack = packData;
                if (_tip.id) {
                  updatedPack.tips.push(_tip.id);
                }
                setPackData(updatedPack);
                const updatedPacks = data;
                updatedPacks.splice(activePackIndex, 1, updatedPack);
                setData([...updatedPacks]);
              }}
            />
          ) : (
            <AddOrEditQuizForm
              open={showAddTipDrawer}
              setOpen={setShowAddTipDrawer}
              handleSubmit={(id) => {
                const updatedPack = packData;
                if (id) {
                  updatedPack.quizzes.push(id);
                }
                setPackData(updatedPack);
                const updatedPacks = data;
                updatedPacks.splice(activePackIndex, 1, updatedPack);
                setData([...updatedPacks]);
              }}
            />
          )}

          <StepModal
            open={showAddNewTipModal}
            setOpen={setShowAddNewTipModal}
            selectedTips={packData.tips}
            handleAddTip={(new_item) => {
              const updatedPack = packData;
              if (pack.type == "tip-pack") {
                if (new_item.id) {
                  updatedPack.tips.push(new_item.id);
                }
                setPackData(updatedPack);
                const updatedPacks = data;
                updatedPacks.splice(activePackIndex, 1, updatedPack);
                setData([...updatedPacks]);
              } else {
                if (new_item.id) {
                  updatedPack.quizzes.push(new_item.id);
                }
                setPackData(updatedPack);
                const updatedPacks = data;
                updatedPacks.splice(activePackIndex, 1, updatedPack);
                setData([...updatedPacks]);
              }
            }}
            type={pack.type}
          />
        </>
      )}
    </div>
  );
};

export default PackOverview;
