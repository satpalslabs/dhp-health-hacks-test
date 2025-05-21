import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardSelectionField,
  commonProps,
  FileDropZone,
  GridFields,
  SelectField,
} from "@/components/cms/articles/add-edit-articles/form-components";
import { Pack } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddButton } from "@/components/ui/add-button";
import InputTooltip from "@/components/ui/input-info-tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, HelpCircle, X } from "lucide-react";
import InfoCircled from "@/info-circled.svg";
import LibraryBooks from "@/library_books.svg";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ColorPicker from "@/components/ui/color-picker";
import { HConditionContext } from "@/context/health-conditions-provider";
import { PacksContext } from "@/context/pack-data-provider";
import AddHealthHacksConditionModel from "../../articles/add-edit-articles/form-components/add-health-hacks-condition";
import SideDrawer from "../../articles/add-edit-articles/form-drawers";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
const formSchema = z.discriminatedUnion("type", [
  z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string(),
    type: z.literal("tip-pack"),
    section: z.number().optional(),
    sub_section: z.number().optional(),
    collection: z.number({ message: "" }),
    months: z.array(z.enum(months)).optional(),
    background_color: z
      .string({ message: "Background color is required" })
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" }),
    title_and_body_color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" })
      .optional(),
    category_and_button_color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" })
      .optional(),
    associated_conditions: z.array(z.number()),
    bg_image: z.object({
      id: z.number().nullable(),
      size: z.number(),
      mime: z.string(),
      height: z.number(),
      width: z.number(),
      name: z.string(),
      url: z.string(),
    }),
    icon: z.object({
      id: z.number().nullable(),
      size: z.number(),
      mime: z.string(),
      height: z.number(),
      width: z.number(),
      name: z.string(),
      url: z.string(),
    }),
  }),

  z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string(),
    type: z.literal("quiz-pack"),
    section: z.number().optional(),
    sub_section: z.number().optional(),
    collection: z.number({ message: "" }),
  }),
]);
const packTypes = [
  {
    value: "tip-pack",
    label: "Tip",
    icon: InfoCircled,
  },
  {
    value: "quiz-pack",
    label: "Quiz",
    icon: HelpCircle,
  },
];
const AddOrEditPack = ({
  open,
  setOpen,
  handleSubmit,
  editPackID,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: (pack: Pack) => void;
  editPackID?: number;
}) => {
  // const tipsContext = useContext(ArticleContext);

  const defaultValues = {
    type: "tip-pack",
    description: "",
  };
  const [editPackData, setEditPackData] = useState<Pack | null>(null);
  const { packs } = useContext(PacksContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as z.infer<typeof formSchema>,
  });

  useEffect(() => {
    if (editPackID) {
      const editPack = packs.find((pack) => pack.id == editPackID);
      if (editPack) {
        setEditPackData(editPack);
        form.setValue("type", editPack.type, {
          shouldValidate: true,
        });
        form.setValue("name", editPack.name ?? "", {
          shouldValidate: true,
        });
        form.setValue("description", editPack.description ?? "", {
          shouldValidate: true,
        });
        form.setValue(
          "associated_conditions",
          editPack.associated_conditions ?? [],
          {
            shouldValidate: true,
          }
        );
        form.setValue("collection", editPack.collection, {
          shouldValidate: true,
        });
        form.setValue("background_color", editPack.background_color ?? "", {
          shouldValidate: true,
        });
        if (editPack.bg_image) {
          form.setValue("bg_image", editPack.bg_image, {
            shouldValidate: true,
          });
        }
        if (editPack.icon) {
          form.setValue("icon", editPack.icon, {
            shouldValidate: true,
          });
        }
        form.setValue("title_and_body_color", editPack.title_and_body_color, {
          shouldValidate: true,
        });
        form.setValue(
          "category_and_button_color",
          editPack.category_and_button_color,
          {
            shouldValidate: true,
          }
        );
        form.setValue("months", editPack.months ?? [], {
          shouldValidate: true,
        });
      } else {
        form.reset();
        setEditPackData(null);
      }
    }
  }, [editPackID, open]);

  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editPackID ? "Edit Pack" : "Add a new Pack"}
      preview={
        <div className="w-full flex justify-center">
          <PreviewPack
            type={form.watch("type")}
            background_color={form.watch("background_color")}
            count={editPackData?.tips.length}
            title={form.watch("name")}
          />
        </div>
      }
    >
      <TipsCategoryForm
        form={form}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        editTipCategory={editPackData}
      />
    </SideDrawer>
  );
};

export default AddOrEditPack;

const TipsCategoryForm = ({
  form,
  handleSubmit,
  setOpen,
  editTipCategory,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (tipCategory: Pack) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTipCategory: Pack | null;
}) => {
  const { HConditions, updateHConditions } = useContext(HConditionContext);
  const { packs, updatePacks } = useContext(PacksContext);

  if (handleSubmit) {
  }
  const type = form.watch("type");
  const handleTipCategory = () => {
    const _newPackData: Pack = {
      createdAt: new Date().toISOString(),
      ...(editTipCategory ? editTipCategory : {}),
      ...form.getValues(),
      background_color: form.getValues("background_color") || undefined, // Default to white if undefined
      title_and_body_color: form.getValues("title_and_body_color") || undefined,
      category_and_button_color:
        form.getValues("category_and_button_color") || undefined, // Default to black if undefined
      icon: form.getValues("icon") || null,
      bg_image: form.getValues("bg_image") || null,
      id: editTipCategory
        ? editTipCategory.id
        : Math.max(...(packs.map((i) => i.id ?? 0) ?? [])) + 1,
      quizzes: editTipCategory?.quizzes ?? [],
      _status: editTipCategory ? editTipCategory._status : "published",
      updatedAt: new Date().toISOString(),
      tips: editTipCategory ? editTipCategory?.tips : [],
    };

    if (!editTipCategory) {
      (_newPackData.associated_conditions ?? []).map((health_condition) => {
        const _updatedHConditions = HConditions;
        const prevHealthIndex = _updatedHConditions.findIndex(
          (item) => item.id == health_condition
        );
        _updatedHConditions.splice(prevHealthIndex, 1, {
          ..._updatedHConditions[prevHealthIndex],
          tips_categories: [
            ..._updatedHConditions[prevHealthIndex].tips_categories,
            _newPackData.id ?? 0, // Default to 0 if undefined
          ],
        });
        updateHConditions([..._updatedHConditions]);
      });
      updatePacks([...packs, _newPackData]);
    } else {
      const _updatedPacks = packs;
      const prevTipIndex = _updatedPacks.findIndex(
        (item) => item.id == editTipCategory.id
      );
      _updatedPacks.splice(prevTipIndex, 1, _newPackData);
      updatePacks([..._updatedPacks]);
    }
    if (handleSubmit) {
      handleSubmit(_newPackData);
    }
    form.clearErrors();
    form.reset();
  };
  return (
    <div className="h-full py-3 p-6">
      <Form {...form}>
        <div className="h-full flex flex-col border border-border gap-4 rounded-[12px] p-6">
          <div className="grow flex flex-col gap-4 overflow-y-auto no-scrollbar px-[2px] pb-5">
            <CardSelectionField
              form={form}
              label="Pack Type"
              name="type"
              options={packTypes}
            />
            <GridFields formControl={form.control} form={form} />
            <div className="flex gap-[6px]">
              <div className="grow">
                <SelectField
                  control={form.control}
                  name="associated_conditions"
                  label="Health Condition"
                  tooltip="Select Health Condition"
                  placeholder="Select Health Condition"
                  selectType="multi-select"
                  dataKey="name"
                  options={HConditions}
                />
              </div>
              <AddHealthHacksConditionModel
                afterSubmission={(newHealthCondition) => {
                  form.setValue("associated_conditions", [
                    ...(form.getValues("associated_conditions") ?? []),
                    newHealthCondition.id as number,
                  ]);
                }}
              >
                <AddButton className="mt-7" />
              </AddHealthHacksConditionModel>
            </div>
            <FormFieldWrapper
              control={form.control}
              name="name"
              label="Title"
              required
              tooltip="Enter Title"
              className="min-h-0"
              placeholder="Write title here"
              component={Input}
            />
            <FormFieldWrapper
              control={form.control}
              name="description"
              label="Description"
              tooltip="Enter Description"
              className="min-h-[126px]"
              placeholder="Write Description here"
              component={Textarea}
            />
            {type == "tip-pack" && (
              <>
                <SelectMonthField
                  control={form.control}
                  name="months"
                  label="Month"
                  tooltip="Select Month"
                  placeholder="Select Month"
                  options={[...months]}
                />
                <FormField
                  control={form.control}
                  name={"background_color"}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-[6px]">
                      <FormLabel className="flex gap-[2px]">
                        <div className="font-inter text-sm">
                          Background color
                        </div>
                        <span className="text-red-500">*</span>
                        <InputTooltip tooltip={"Select Background color"}>
                          <InfoCircled className="w-[13px] h-auto" />
                        </InputTooltip>
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          onColorChange={formField.onChange}
                          {...formField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"title_and_body_color"}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-[6px]">
                      <FormLabel className="flex gap-[2px]">
                        <div className="font-inter text-sm">
                          Text & Body color
                        </div>
                        <span className="text-red-500">*</span>
                        <InputTooltip tooltip={"Select title and body color"}>
                          <InfoCircled className="w-[13px] h-auto" />
                        </InputTooltip>
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          onColorChange={formField.onChange}
                          {...formField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"category_and_button_color"}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-[6px]">
                      <FormLabel className="flex gap-[2px]">
                        <div className="font-inter text-sm">
                          Category & Button color
                        </div>
                        <span className="text-red-500">*</span>
                        <InputTooltip
                          tooltip={"Select category and Button color"}
                        >
                          <InfoCircled className="w-[13px] h-auto" />
                        </InputTooltip>
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          onColorChange={formField.onChange}
                          {...formField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FileDropZone
                  control={form.control}
                  fieldValue={form.getValues("bg_image")}
                  name="bg_image"
                  label="Cover Image"
                  tooltip="Select Cover Image"
                  required
                />
                <FileDropZone
                  control={form.control}
                  fieldValue={form.getValues("icon")}
                  name="icon"
                  label="Icon"
                  tooltip="Select icon Image"
                  required
                />
              </>
            )}
          </div>
          <div className="w-full flex gap-3 items-center font-inter">
            <Button
              type="button"
              className="px-6"
              disabled={!form.formState.isValid}
              onClick={() => {
                handleTipCategory();
                setOpen(false);
                form.reset();
              }}
            >
              Save
            </Button>
            {!editTipCategory && (
              <Button
                type="button"
                className="px-6"
                disabled={!form.formState.isValid}
                onClick={() => {
                  handleTipCategory();
                  form.reset();
                }}
              >
                Save & Add New
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

interface selectMonthField extends commonProps {
  options: string[];
  // onSelect?: (type: string) => void;
}

const SelectMonthField = ({
  control,
  name,
  label,
  tooltip,
  placeholder,
  options,
}: // onSelect,
selectMonthField) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOptions = options.filter(
          (opt) => Array.isArray(field.value) && field.value.includes(opt)
        );

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
                  <FormControl className={"min-h-fit"}>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal relative hover:bg-transparent data-[state='open']:border-foreground"
                    >
                      {selectedOptions.length > 0 ? (
                        <div className="flex flex-wrap w-full gap-1 items-center">
                          {selectedOptions.map((selectedOption, ix) => (
                            <div
                              key={ix}
                              className={`flex gap-4 items-center relative font-inter p-2 text-sm rounded-md bg-muted pr-8 first:-ml-2`}
                            >
                              {selectedOption}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();

                                  // For multi-select, remove the ID from the array
                                  const newValue = Array.isArray(field.value)
                                    ? field.value.filter(
                                        (id) => id !== selectedOption
                                      )
                                    : [];
                                  field.onChange(newValue);
                                }}
                                className="absolute right-2 text-button-filter-text cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </div>
                            </div>
                          ))}
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
                            value={JSON.stringify(item)}
                            className="text-sm p-2 w-full"
                            onSelect={() => {
                              // For multi-select, add or remove the ID from the array
                              const currentValue = Array.isArray(field.value)
                                ? field.value
                                : [];
                              const isSelected = currentValue.includes(item);

                              if (isSelected) {
                                // Remove if already selected
                                field.onChange(
                                  currentValue.filter((id) => id !== item)
                                );
                              } else {
                                // Add if not selected
                                field.onChange([...currentValue, item]);
                              }
                              // Keep the popover open for multi-select to allow multiple selections
                              setOpen(false);
                            }}
                          >
                            {item}
                            {selectedOptions.some((i) => i === item) && (
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

export const PreviewPack = ({
  title = "Title",
  type,
  count,
  background_color,
}: {
  title?: string;
  count?: number;
  type: "tip-pack" | "quiz-pack";
  background_color?: string;
}) => {
  return (
    <div
      className={`w-[186px] h-[112px] px-[15px] py-[17px] flex rounded-lg mt-5 flex-col gap-2 justify-end font-poppins ${
        background_color ? "text-white" : "text-black"
      }`}
      style={{
        background: background_color ?? "#F1F1F1",
        boxShadow: "0px 3px 28px 0px #063C840F",
      }}
    >
      <p className="leading-[27px] text-lg font-semibold  break-words">
        {title}
      </p>
      <div className="flex gap-[7px] [&_svg]:size-5">
        <LibraryBooks />
        <p className="font-mulish font-semibold text-lg leading-5 capitalize">
          {count ?? ""} {type == "tip-pack" ? "Tips" : "Quiz"}
        </p>
      </div>
    </div>
  );
};
