"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import SideDrawer from ".";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tip as TipType, Quiz, Pack } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/form-components";
import QuizComponent from "@/components/ui/quiz";
import { AddButton } from "@/components/ui/add-button";
import { QuizContext } from "@/context/quiz-data-provider";
import AddOrEditQuizForm from "@/components/cms/quiz/manage-quiz";
import { getQuizzes } from "@/lib/services/quiz-services";

const formSchema = z.object({
  search: z.array(z.number()).min(1, "Please select at least one Quiz."),
});

const SelectExistingQuizForm = ({
  open,
  setOpen,
  previousQuizzes,
  handleSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previousQuizzes: number[];
  handleSubmit?: (e: Quiz[]) => void;
}) => {
  const [openNewTipDialog, setOpenNewTipDialog] = useState(false);

  const { quizzes, updateQuizzes } = useContext(QuizContext);
  const [options, setOptions] = useState<Quiz[]>(quizzes);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: [],
    },
  });

  useEffect(() => {
    form.reset();
  }, [open, form]);

  useEffect(() => {
    setOptions(quizzes);
  }, [quizzes]);

  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={"Add Quizzes"}
      preview={
        <PreviewModeForQuizzes
          quizzes={options.filter(
            (quiz) => quiz.id && form.watch("search").includes(quiz.id)
          )}
        />
      }
    >
      <div className="h-full py-3 p-6">
        <Form {...form}>
          <div className="h-full flex flex-col border border-border rounded-[12px] p-6">
            <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-5">
              <div className="flex gap-4">
                <div className="grow">
                  <SelectField
                    control={form.control}
                    name="search"
                    dataKey="question"
                    label="Search"
                    tooltip="Select Quizzes"
                    placeholder="Select Quizzes"
                    selectType="multi-select"
                    options={options.filter(
                      (i) => i.id && !previousQuizzes.includes(i.id)
                    )}
                    required
                  />
                </div>
                <AddButton
                  className="mt-7"
                  onClick={() => {
                    setOpenNewTipDialog(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex justify-between items-center font-inter">
              <Button
                type="button"
                className="px-[43px]"
                disabled={!form.formState.isValid}
                onClick={() => {
                  if (handleSubmit) {
                    handleSubmit(
                      options.filter(
                        (quiz) =>
                          quiz.id && form.watch("search").includes(quiz.id)
                      )
                    );
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <AddOrEditQuizForm
        open={openNewTipDialog}
        setOpen={setOpenNewTipDialog}
        handleSubmit={async (quiz) => {
          const updatedQuizzes = await getQuizzes();
          updateQuizzes(updatedQuizzes);
          form.setValue("search", [...form.watch("search"), quiz], {
            shouldValidate: true,
          });
        }}
      />
    </SideDrawer>
  );
};

export default SelectExistingQuizForm;

export interface previewTip extends TipType {
  tipCategory?: Pack;
}

const PreviewModeForQuizzes = ({ quizzes }: { quizzes: Quiz[] }) => {
  return (
    <div className="w-full flex flex-col items-center gap-[26px] h-fit ">
      {quizzes.map((quiz, ix) => (
        <QuizComponent quiz={quiz} key={ix} />
      ))}
    </div>
  );
};
