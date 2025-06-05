import { UseFormReturn } from "react-hook-form";
import { formSchema } from "@/components/cms/articles/add-edit-articles/form-schema";
import { useContext, useEffect, useState } from "react";
import { Quiz } from "@/types";
import { z } from "zod";
import { FormLabel } from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import InfoCircled from "@/info-circled.svg";
import SelectExistingQuizForm from "@/components/cms/articles/add-edit-articles/form-drawers/select-existing-quiz-form";
import { AddButton } from "@/components/ui/add-button";
import { QuizContext } from "@/context/quiz-data-provider";
import AddOrEditQuizForm from "@/components/cms/quiz/manage-quiz";
import { getQuizzes } from "@/lib/services/quiz-services";
import { Skeleton } from "@/components/ui/skeleton";

export const QuizSection = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { quizzes, updateQuizzes } = useContext(QuizContext);
  const [quizData, setQuizData] = useState<Quiz[]>([]);
  const [open, setOpen] = useState(false);
  const [openNewTipForm, setOpenNewQuizForm] = useState(false);
  const [editQuizData, setEditQuizData] = useState<Quiz | undefined>();
  const [loading, setLoading] = useState(true);
  const selectedQuizzes = form.watch("quiz");

  useEffect(() => {
    const getQuizData = async () => {
      if (!selectedQuizzes?.length) return;

      const newQuizzes = selectedQuizzes.reduce((acc, quizId) => {
        if (!quizData.some((quiz) => quiz.id === quizId)) {
          const foundQuiz = quizzes.find((q) => q.id === quizId);
          if (foundQuiz) acc.push(foundQuiz);
        }
        return acc;
      }, [] as typeof quizData);

      if (newQuizzes.length > 0) {
        setQuizData((prev) => [...prev, ...newQuizzes]);
      }
    };

    getQuizData();
  }, [selectedQuizzes, quizData, quizzes]);

  useEffect(() => {
    if (quizzes.length == 0) {
      getQuizzes().then((res) => {
        updateQuizzes(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [quizzes, updateQuizzes]);

  return (
    <div className="flex flex-col gap-4 border-t border-border py-4">
      <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
        <div>Quiz</div>
        <InputTooltip tooltip="Select or Add Quiz">
          <InfoCircled className="w-[13px] h-auto" />
        </InputTooltip>
      </FormLabel>
      {quizData.length > 0 && (
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            if (!destination) return;
            const newQuizzes = [...quizData];
            const [movedTip] = newQuizzes.splice(source.index, 1);
            newQuizzes.splice(destination.index, 0, movedTip);

            setQuizData(newQuizzes);
            const newQuizzesIds: number[] = newQuizzes
              .map((quiz) => quiz.id)
              .filter((id) => typeof id == "number");

            form.setValue("quiz", newQuizzesIds, { shouldValidate: true });
          }}
        >
          <Droppable
            isDropDisabled={false}
            direction="vertical"
            droppableId="tips"
            isCombineEnabled={true}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                className="p-2 border-border border rounded-lg"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ height: quizData.length * 64 + 12 + "px" }}
              >
                {quizData.map((quiz, ix) => (
                  <Draggable
                    key={quiz.id}
                    draggableId={quiz.id?.toString() + "_quiz"}
                    index={ix}
                  >
                    {(_provided) => (
                      <div
                        className="h-16 border-b px-5 bg-background flex items-center justify-between last:border-none border-border"
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                      >
                        <div className="font-inter text-sm">
                          {quiz.question}
                        </div>
                        <div className="flex gap-[20px] [&_svg]:size-4 text-button-filter-text">
                          <button
                            type="button"
                            onClick={() => {
                              setEditQuizData(quiz);
                              setOpenNewQuizForm(true);
                            }}
                          >
                            <Pencil />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuizData((prev) => {
                                prev.splice(ix, 1);
                                const quizzesIds: number[] = prev
                                  .map((quiz) => quiz.id)
                                  .filter((id) => typeof id == "number");

                                form.setValue("quiz", quizzesIds, {
                                  shouldValidate: true,
                                });
                                return [...prev];
                              });
                            }}
                          >
                            <Trash2 />
                          </button>
                          <div {..._provided.dragHandleProps}>
                            <GripVertical />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="flex justify-between gap-4">
        <DropdownMenu>
          {loading ? (
            <Skeleton className="bg-muted w-full h-10" />
          ) : (
            <DropdownMenuTrigger asChild>
              <AddButton className="w-full" text="Add Quiz" />
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent className="font-inter mr-10" side="bottom">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Select from Quiz Library
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setEditQuizData(undefined);
                setOpenNewQuizForm(true);
              }}
            >
              Add new Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SelectExistingQuizForm
        open={open}
        previousQuizzes={form.getValues("quiz") ?? []}
        setOpen={setOpen}
        handleSubmit={(quizzes) => {
          const quizzesIds: number[] = quizzes
            .map((quiz) => quiz.id)
            .filter((id) => typeof id == "number");

          form.setValue("quiz", quizzesIds, { shouldValidate: true });
          setQuizData((prev: Quiz[]) => {
            const newQuizzes = quizzes.filter(
              (quiz) => !prev.some((item) => item.id === quiz.id)
            );
            return [...prev, ...newQuizzes];
          });
          setOpen(false);
        }}
      />
      <AddOrEditQuizForm
        open={openNewTipForm}
        setOpen={setOpenNewQuizForm}
        handleSubmit={async (id) => {
          const updatedQuizzes = await getQuizzes();
          updateQuizzes(updatedQuizzes);
          const quiz = updatedQuizzes.find((item) => item.id == id);
          if (quiz) {
            setQuizData((prev) => {
              const index = prev.findIndex((i) => i.id === id);
              if (index !== -1) {
                return prev.map((item, idx) => (idx === index ? quiz : item));
              }

              return [...prev, quiz];
            });
          }
        }}
        editQuiz={editQuizData?.id ?? undefined}
      />
    </div>
  );
};
