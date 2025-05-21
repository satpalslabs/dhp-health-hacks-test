import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quiz, pairOption, selectOption } from "@/types";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, SpinnerButton } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  Circle,
  Link2,
  ListChecks,
  ListTodo,
  X,
} from "lucide-react";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import QuizComponent from "@/components/ui/quiz";
import { AddButton } from "@/components/ui/add-button";
import { QuizContext } from "@/context/quiz-data-provider";
import { commonProps } from "../articles/add-edit-articles/form-components";
import SideDrawer from "../articles/add-edit-articles/form-drawers";
import { DraggableWrapperQuiz } from "../articles/add-edit-articles/form-components/draggable-wrapper";
import { toast } from "@/hooks/use-toast";
import { PostQuiz, UpdateQuiz } from "@/lib/services/quiz-services";
import nProgress from "nprogress";

const question_types = [
  {
    type: "multi-select",
    label: "Multi Select",
    icon: ListChecks,
  },
  {
    type: "single-select",
    label: "Single Select",
    icon: ListTodo,
  },
  {
    type: "pair",
    label: "Pairs Select",
    icon: Link2,
  },
];

const formSchema = z.discriminatedUnion("type", [
  z.object({
    question: z.string().nonempty({ message: "Question is Required" }),
    type: z.literal("single-select"),
    answers: z
      .array(
        z.object({
          answer: z.string().nonempty("Answer is required"),
          is_correct_answer: z.boolean(),
        })
      )
      .min(1, "Options must contain at least 1 answer.")
      .max(5, "Options can't be more than 5."),
  }),

  z.object({
    question: z.string().nonempty({ message: "Question is Required" }), // ✅ Added missing question
    type: z.literal("multi-select"),
    answers: z
      .array(
        z.object({
          answer: z.string().nonempty("Answer is required"),
          is_correct_answer: z.boolean(),
        })
      )
      .min(1, "Options must contain at least 1 answer.")
      .max(5, "Options can't be more than 5."),
  }),

  z.object({
    question: z.string().nonempty({ message: "Question is Required" }), // ✅ Added missing question
    type: z.literal("pair"),
    answers: z
      .array(
        z.object({
          answer: z.string().nonempty("Answer is required"),
          match: z.string().nonempty("Match is required"),
        })
      )
      .min(1, "Options must contain at least 1 answer.")
      .max(5, "Pairs can't be more than 5."),
  }),
]);

const AddOrEditQuizForm = ({
  open,
  setOpen,
  handleSubmit,
  editQuiz,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: (id: number) => void;
  editQuiz?: number | null;
}) => {
  const [editQuizData, setEditQuizData] = useState<Quiz>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editQuizData
      ? {
          ...editQuizData,
        }
      : {
          answers: [],
        },
  });
  const { quizzes } = useContext(QuizContext);

  useEffect(() => {
    if (editQuiz) {
      const _editQuiz = quizzes.find((quiz) => quiz.id == editQuiz);
      if (_editQuiz) {
        setEditQuizData(_editQuiz);
        form.setValue("type", _editQuiz.type, {
          shouldValidate: true,
        });
        form.setValue("question", _editQuiz.question ?? "", {
          shouldValidate: true,
        });
        form.setValue(
          "answers",
          _editQuiz.type === "pair"
            ? (_editQuiz.answers as pairOption[]) // Ensures correct type
            : (_editQuiz.answers as selectOption[])
        );
      }
    } else {
      form.reset();
      setEditQuizData(undefined);
    }
  }, [editQuiz, open]);

  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editQuiz ? "Edit Quiz" : "Add a new Quiz"}
      preview={
        <div className="w-full flex justify-center">
          <QuizComponent quiz={form.getValues() as Quiz} />
        </div>
      }
    >
      <QuizForm
        form={form}
        handleSubmit={(d) => {
          setEditQuizData(undefined);
          if (handleSubmit) {
            handleSubmit(d);
          }
        }}
        setOpen={setOpen}
        editQuiz={editQuizData}
      />
    </SideDrawer>
  );
};

export default AddOrEditQuizForm;

const QuizForm = ({
  form,
  handleSubmit,
  setOpen,
  editQuiz,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (id: number) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editQuiz?: Quiz;
}) => {
  const { append } = useFieldArray({
    control: form.control,
    name: "answers",
  });
  const questionType = form.watch("type");
  const answers = form.watch("answers");
  const [loading, setLoading] = useState(false);

  // Memoized condition for disabling the button
  const isFormInvalid = useMemo(() => {
    return (
      !form.formState.isValid ||
      (questionType !== "pair" &&
        !answers?.some(
          (i) => "is_correct_answer" in i && i.is_correct_answer === true
        ))
    );
  }, [form.formState.isValid, questionType, answers]);

  const handleSave = async () => {
    nProgress.start();
    setLoading(true);
    try {
      const quizData: Quiz = {
        id: editQuiz?.id ?? null,
        ...form.getValues(),
      };

      let response;
      if (editQuiz) {
        response = await UpdateQuiz(quizData);
      } else {
        response = await PostQuiz(quizData);
      }

      form.reset();

      // if (!isSaveAndAddNew) {
      //   setOpen(false);
      // } else {
      setLoading(false);
      nProgress.done();
      form.reset();
      setOpen(false);
      if (handleSubmit && response.id) {
        handleSubmit(response.id);
      }
      // }
      toast({
        title: `Success`,
        description: (
          <p>
            <span className="capitalize">Quiz</span>
            {editQuiz ? " updated" : " created"} successfully
          </p>
        ),
      });
    } catch (error) {
      console.error("Error", error);
      setLoading(false);
      nProgress.done();
      toast({
        title: `Error`,
        description:
          typeof error === "object" && error !== null && "message" in error
            ? (error.message as string)
            : JSON.stringify(error),
      });
    }
  };

  return (
    <div className="h-full py-3 p-6">
      <Form {...form}>
        <div className="h-full flex flex-col border border-border rounded-[12px] p-6">
          <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-5">
            <FormFieldWrapper
              control={form.control}
              name="question"
              label="Question"
              required
              tooltip="Enter Question"
              className="min-h-0"
              placeholder="Write Question here"
              component={Input}
            />

            <SelectQuizTypeField
              control={form.control}
              name="type"
              label="Type"
              tooltip="Select Quiz type"
              placeholder="Select Quiz type"
              options={question_types}
              onSelect={(type) => {
                if (type == "pair") {
                  form.setValue("answers", []);
                  append({ answer: "", match: "" });
                } else if (answers.length == 0) {
                  append({ answer: "", is_correct_answer: false });
                }
              }}
            />
            {questionType && <Options form={form} />}
          </div>

          {/* Buttons Section */}
          <div className="w-full flex gap-3 items-center font-inter">
            {["Save"].map((label, idx) => {
              const isSaveAndAddNew = label === "Save & Add New";

              if (editQuiz ? !isSaveAndAddNew : true) {
                return (
                  <SpinnerButton
                    key={idx}
                    type="button"
                    loading={loading}
                    className="px-6"
                    disabled={isFormInvalid}
                    onClick={() => handleSave()}
                  >
                    {label}
                  </SpinnerButton>
                );
              }
            })}
          </div>
        </div>
      </Form>
    </div>
  );
};

interface selectQuizTypeField extends commonProps {
  options: {
    type: string;
    icon: React.ElementType;
    label: string;
  }[];
  onSelect?: (type: string) => void;
}

const SelectQuizTypeField = ({
  control,
  name,
  label,
  tooltip,
  placeholder,
  options,
  onSelect,
}: selectQuizTypeField) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="flex grow gap-1 font-inter text-sm items-center">
              <span className="capitalize">{label}</span>
              <span className="text-red-500">*</span>
              <InputTooltip tooltip={tooltip}>
                <InfoCircled className="w-3 h-3" />
              </InputTooltip>
            </FormLabel>
            <div className="flex gap-3">
              <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal relative hover:bg-transparent data-[state='open']:border-foreground"
                    >
                      {field.value ? (
                        <div
                          className={`flex gap-4 items-center relative font-inter p-2 text-sm rounded-md w-full grow capitalize`}
                        >
                          {options.find((i) => i.type == field.value)?.label}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                            }}
                            className="absolute right-2 text-button-filter-text cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">{placeholder}</span>
                      )}

                      <ChevronsUpDown className="text-gray-500 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] border border-border rounded-md p-0 my-2">
                  <Command>
                    <CommandInput placeholder={`Search ${label}`} />
                    <CommandList>
                      <CommandEmpty>No {label} found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((item, ix) => (
                          <CommandItem
                            key={ix}
                            value={item.type}
                            className="text-sm p-2 w-full capitalize"
                            onSelect={() => {
                              field.onChange(item.type);
                              if (item && onSelect != undefined) {
                                onSelect(item.type);
                              }

                              setOpen(false);
                            }}
                          >
                            <item.icon />
                            {item.label}
                            {field.value == item.type && (
                              <span className="ml-auto">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        );
      }}
    />
  );
};

const Options = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { fields, append, move, remove, update } = useFieldArray({
    control: form.control,
    name: "answers",
  });
  const questionType = form.watch("type");
  const answers = form.watch("answers");

  // Handle answer selection logic
  const toggleCorrectAnswer = (index: number) => {
    answers.forEach((item, ix) => {
      const updatedAnswer = { ...item };
      if ("is_correct_answer" in updatedAnswer) {
        updatedAnswer.is_correct_answer =
          questionType === "single-select"
            ? ix === index
            : ix === index
            ? "is_correct_answer" in item && !item.is_correct_answer
            : "is_correct_answer" in item && item.is_correct_answer;
      }
      update(ix, updatedAnswer);
    });
  };
  return (
    <>
      <div className="flex font-inter text-sm">
        <div className="grow font-medium">Options:</div>
        <div className="text-text-darkGray">{answers.length}/5 max</div>
      </div>

      {fields.length > 0 && (
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            if (destination) move(source.index, destination.index);
          }}
        >
          <Droppable
            droppableId="quizzes"
            isDropDisabled={false}
            direction="vertical"
            isCombineEnabled={true}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                className="flex flex-col gap-4 min-h-fit"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((quiz, index) => (
                  <DraggableWrapperQuiz
                    key={quiz.id}
                    field={quiz}
                    index={index}
                    remove={remove}
                    className="top-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="flex grow w-[calc(100%-64px)]">
                        <div className="flex gap-4 items-center w-full">
                          {questionType !== "pair" && (
                            <button
                              type="button"
                              className={`flex items-center justify-center h-4 w-4 border shrink-0 border-primary ${
                                questionType == "single-select"
                                  ? "rounded-full [&_svg]:size-2 "
                                  : "is_correct_answer" in quiz &&
                                    quiz.is_correct_answer
                                  ? "bg-primary rounded-sm text-white [&_svg]:size-4 "
                                  : "rounded-sm text-white"
                              }

                                `}
                              onClick={() => toggleCorrectAnswer(index)}
                            >
                              {"is_correct_answer" in quiz &&
                                quiz.is_correct_answer &&
                                (questionType === "single-select" ? (
                                  <Circle className="fill-primary" />
                                ) : (
                                  <Check />
                                ))}
                            </button>
                          )}

                          <div className="flex grow gap-4">
                            <FormField
                              control={form.control}
                              name={`answers.${index}.answer`}
                              render={({ field }) => (
                                <FormItem className="grow">
                                  <FormControl>
                                    <Input
                                      className="grow border h-10 border-border rounded-lg w-full"
                                      value={field.value}
                                      placeholder={`Option ${index + 1}`}
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {questionType === "pair" && (
                              <FormField
                                control={form.control}
                                name={`answers.${index}.match`}
                                render={({ field }) => (
                                  <FormItem className="w-1/2 shrink-0">
                                    <FormControl>
                                      <Input
                                        className="grow border h-10 border-border rounded-lg"
                                        value={field.value}
                                        placeholder={`Option ${index + 2}`}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DraggableWrapperQuiz>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <AddButton
        className="w-full h-11"
        onClick={() => {
          append(
            questionType === "pair"
              ? { answer: "", match: "" }
              : { answer: "", is_correct_answer: false }
          );
        }}
        disabled={answers.length >= 5}
        text="Add Option"
      />
    </>
  );
};
