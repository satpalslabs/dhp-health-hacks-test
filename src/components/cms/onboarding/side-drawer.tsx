/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import InfoCircled from "@/info-circled.svg";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  Check,
  CircleHelp,
  FileText,
  GripVertical,
  LaptopMinimalCheck,
  Link,
  ListChecks,
  ListTodo,
  ListTree,
  Plus,
  Trash2,
  TvMinimal,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InputTooltip from "@/components/ui/input-info-tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  title: z.string().nonempty({ message: "Step title is required" }),
  description: z.string().optional(),
  required: z.boolean(),
  conditions: z.boolean(),
  components: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("help"),
        title: z.string().nonempty({ message: "Help title is required" }),
        description: z.string().optional(),
      }),
      z.object({
        type: z.literal("single-choice"),
        title: z.string().nonempty({ message: "Title is required" }),
        options: z
          .array(
            z.object({
              id: z.any(),
              text: z.string().nonempty({ message: "Option text is required" }),
            })
          )
          .nonempty({ message: "At least one option is required" }),
      }),
      z.object({
        type: z.literal("multi-choice"),
        title: z.string().nonempty({ message: "Title is required" }),
        options: z
          .array(
            z.object({
              id: z.any(),
              text: z.string().nonempty({ message: "Option text is required" }),
            })
          )
          .nonempty({ message: "At least one option is required" }),
      }),
      z.object({
        type: z.literal("feedback"),
        title: z.string().nonempty({ message: "Title is required" }),
        link_text: z.string().nonempty({ message: "Link text is required" }),
        url: z.string().nonempty({ message: "Link URL is required" }),
      }),
    ])
  ),
});

const SideDrawer = ({
  open,
  setOpen,
}: // setNodes,
{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setNodes: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <Drawer open={open} direction="right" dismissible={false}>
      <DrawerContent>
        <DrawerHeader className="h-[75px] flex items-center border-b border-border p-6">
          <DrawerTitle className="font-inter text-lg">Add Step</DrawerTitle>
        </DrawerHeader>
        <SideDrawerForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;

const SideDrawerForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      required: false,
      conditions: false,
      components: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "components",
  });
  const [editingOption, setEditingOption] = useState<number | null>(null);

  const handleAppendComponent = (type: string) => {
    fields.map((field, index) => {
      if (field.type === "single-choice" || field.type === "multi-choice") {
        const options: any = field.options.filter((opt) => opt.text != "");
        if (options.length > 0) {
          update(index, {
            ...field,
            options,
          });
        } else {
          remove(index);
        }
      }
    });
    if (type === "help") {
      append({ type, title: "", description: "" });
    } else if (type === "single-choice" || type === "multi-choice") {
      const id = Date.now() + Math.random();
      setEditingOption(id);
      append({
        type,
        title: "",
        options: [{ id, text: "" }] as [{ id: any; text: string }],
      });
    } else if (type === "feedback") {
      append({
        type,
        title: "",
        link_text: "",
        url: "",
      });
    }
  };
  return (
    <div className="grow overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(console.log)}
          className="flex flex-col h-full justify-between"
        >
          <div className="py-4 px-6 flex flex-col gap-4 font-inter text-sm">
            <FormFieldWrapper
              control={form.control}
              name="title"
              label="Title"
              required
              tooltip="Enter Step Title"
              placeholder="Write title here"
              component={Input}
            />
            <FormFieldWrapper
              control={form.control}
              name="description"
              label="Description"
              tooltip="Enter Step Description"
              className="min-h-[126px]"
              placeholder="Write description here"
              component={Textarea}
            />

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-3 flex flex-col gap-3 rounded-md mt-2"
              >
                <div className="flex justify-between items-center p-2 border-b border-border">
                  <p className="font-inter font-medium capitalize text-sm leading-6">
                    {field.type === "single-choice"
                      ? "Options (Single Choice)"
                      : field.type}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-text-darkGray"
                      onClick={() => {
                        remove(index);
                        if (
                          field.type === "single-choice" ||
                          (field.type === "multi-choice" &&
                            field.options.some((i) => i.id == editingOption))
                        ) {
                          setEditingOption(null);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button type="button" className="text-text-darkGray">
                      <GripVertical size={16} />
                    </button>
                  </div>
                </div>

                {field.type === "help" && (
                  <>
                    <FormFieldWrapper
                      control={form.control}
                      name={`components.${index}.title`}
                      label="Title"
                      required
                      tooltip="Enter Title"
                      placeholder="Write title here"
                      component={Input}
                    />
                    <FormFieldWrapper
                      control={form.control}
                      name={`components.${index}.description`}
                      label="Description"
                      className="min-h-[126px]"
                      tooltip="Enter Description"
                      placeholder="Write description here"
                      component={Textarea}
                    />
                  </>
                )}
                {field.type === "feedback" && (
                  <>
                    <FormFieldWrapper
                      control={form.control}
                      name={`components.${index}.title`}
                      label="Title"
                      required
                      tooltip="Enter Title"
                      placeholder="Write title here"
                      component={Input}
                    />
                    <FormFieldWrapper
                      control={form.control}
                      name={`components.${index}.link-text`}
                      label="Link Text"
                      tooltip="Enter link text"
                      placeholder="Write link text"
                      component={Input}
                    />
                    <FormFieldWrapper
                      control={form.control}
                      name={`components.${index}.url`}
                      label="Link"
                      tooltip="Enter link"
                      placeholder="Write link here"
                      component={Input}
                    />
                  </>
                )}

                {(field.type === "single-choice" ||
                  field.type === "multi-choice") && (
                  <>
                    {form
                      .getValues(`components.${index}.options`)
                      ?.map((_option, optIndex) => (
                        <div
                          key={optIndex}
                          className="flex gap-3 w-full items-center"
                        >
                          <button type="button" className="text-text-darkGray">
                            <GripVertical size={16} />
                          </button>
                          <FormFieldWrapper
                            control={form.control}
                            name={`components.${index}.options.${optIndex}.text`}
                            tooltip="Enter option text"
                            placeholder="Option text"
                            component={Input}
                            onFocus={() => {
                              setEditingOption(_option.id);
                            }}
                          />
                          {editingOption === _option.id && (
                            <>
                              <Button
                                type="button"
                                className="bg-muted p-3 hover:shadow-sm text-primary"
                                disabled={field.title == ""}
                                onClick={() => {
                                  if (field.title == "") {
                                    setEditingOption(null);
                                  }
                                }}
                              >
                                <Check className="text-primary dark:text-white" />
                              </Button>
                              <Button
                                variant="secondary"
                                className="p-3"
                                onClick={() => {
                                  setEditingOption(null);
                                  field.options.splice(optIndex, 1);
                                  update(index, {
                                    ...form.getValues(`components.${index}`),

                                    ...(field.type === "single-choice" && {
                                      options: [...field.options],
                                    }),
                                  });
                                }}
                              >
                                <X className="text-gray-700 dark:text-white" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}

                    <Button
                      size="sm"
                      variant="secondary"
                      type="button"
                      className="rounded-lg text-primary bg-muted dark:text-white"
                      onClick={async () => {
                        if (editingOption === null) {
                          const id = Date.now() + Math.random();
                          update(index, {
                            ...form.getValues(`components.${index}`),

                            ...(field.type === "single-choice" && {
                              options: [
                                ...form.getValues(
                                  `components.${index}.options`
                                ),
                                { id, text: "" },
                              ],
                            }),
                          });
                          setEditingOption(id);
                        }
                      }}
                    >
                      <Plus size={10} /> Add Option
                    </Button>
                  </>
                )}
              </div>
            ))}
            <DropDownMenuAddStep handleAdd_component={handleAppendComponent} />

            <div className="flex flex-col gap-0 border-t border-border">
              <ToggleField
                control={form.control}
                name="required"
                label="Required"
              />
              <ToggleField
                control={form.control}
                name="conditions"
                label="Conditions"
              />
            </div>
          </div>
          <div className="flex justify-between p-6 font-inter sticky bottom-0 bg-background">
            <Button className="px-[43px] " disabled={editingOption != null}>
              Save
            </Button>
            <Button
              variant="outline"
              type="button"
              className="px-[43px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ToggleField = ({
  control,
  name,
  label,
}: {
  control: Control<z.infer<z.ZodType>>;
  name: string;
  label: string;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem
        className="flex items-center gap-4 w-full py-[19px] border-b border-border cursor-pointer"
        onClick={() => field.onChange(!field.value)}
      >
        <FormLabel className="flex gap-[2px] items-center text-sm grow">
          <span>{label}</span>
          <InputTooltip tooltip="Show Help dialog">
            <div className="[&_svg]:size-4 ml-1">
              <InfoCircled />
            </div>
          </InputTooltip>
        </FormLabel>
        <FormControl>
          <Tabs value={field.value.toString()} className="h-fit p-0">
            <TabsList
              className={`w-[44px] h-fit rounded-full gap-1 p-[2px] ${
                field.value ? "bg-primary" : "bg-border dark:bg-slate-600"
              }`}
            >
              <TabsTrigger
                value={"false"}
                className="w-5 h-5 p-0 rounded-full shrink-0 ml-[4px]"
              />
              <TabsTrigger
                value={"true"}
                className="w-5 h-5 p-0 rounded-full shrink-0 mr-[4px]"
              />
            </TabsList>
          </Tabs>
        </FormControl>
      </FormItem>
    )}
  />
);

const DropDownMenuAddStep = ({
  handleAdd_component,
}: {
  handleAdd_component: (e: string) => void;
}) => {
  const components = [
    { name: "Text Field", type: "text-field", icon: <AlignLeft /> },
    { name: "Link", type: "link", icon: <Link /> },
    { name: "Drop Down", type: "drop-down", icon: <ListTree /> },
    { name: "Single Choice", type: "single-choice", icon: <ListTodo /> },
    { name: "Multiple Choice", type: "multi-choice", icon: <ListChecks /> },
    { name: "Help", type: "help", icon: <CircleHelp /> },
    { name: "Tip", type: "tip", icon: <CircleHelp /> },
    { name: "Feedback", type: "feedback", icon: <FileText /> },
    { name: "Button", type: "button", icon: <LaptopMinimalCheck /> },
    { name: "Button Model", type: "button-model", icon: <TvMinimal /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-lg text-primary font-inter bg-muted dark:text-white"
        >
          <Plus size={10} />
          Add Component
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[236px] left-0">
        {components.map(({ type, icon, name }) => (
          <DropdownMenuItem
            key={type}
            onClick={() => {
              handleAdd_component(type);
            }}
          >
            {icon} {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
