import { Path, useFieldArray, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { formSchema } from "@/components/cms/articles/add-edit-articles/form-schema";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";
import {
  Check,
  CircleAlert,
  CreditCard,
  FileVideo,
  IdCard,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LetterText,
  ListVideo,
  Logs,
  MessageCircleMore,
  MessageCircleQuestion,
  Minus,
  Newspaper,
  Percent,
  Quote,
  SquarePercent,
  TableProperties,
  Text,
  TextCursorInput,
  TextQuote,
  WalletCards,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { renderComponent } from "./render-webpage-component";
import { DraggableWrapper } from "./draggable-wrapper";
import { AddButton } from "@/components/ui/add-button";

import { WebpageSchema } from "@/components/cms/articles/add-edit-articles/form-schema";
import { WebpageComponent } from "@/types";
import ColorPicker from "@/components/ui/color-picker";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCallback, useState } from "react";
import CustomLaptopMinimalButton from "@/custom-laptop-minimal-check.svg";

type ContentItem = {
  icon: React.ReactNode;
  label: string;
  description: string;
  component: z.infer<typeof WebpageSchema>["content"][number];
};

export const contentItems: ContentItem[] = [
  {
    icon: <WalletCards />,
    label: "Accordion <br /> Group",
    description: "Expandable list of sections",
    component: {
      __component: "webpage.accordion-group",
      title: "",
      default_open: false,
      description: "",
      group_id: null,
      group_content: [],
    },
  },
  {
    icon: <TableProperties />,
    label: "Accordion <br /> Section",
    description: "Collapsible panel within group",
    component: {
      __component: "webpage.expandable-sections",
      title: "",
      content: "",
      accordion_group_id: null,
    },
  },
  {
    icon: <TextCursorInput />,
    label: "Text",
    description: "Basic single-line text or label",
    component: {
      __component: "webpage.short-text",
      text: "",
      accordion_group_id: null,
    },
  },
  {
    icon: <LetterText />,
    label: "Rich <br /> Text",
    description: "Styled, formatted text editor",
    component: {
      __component: "webpage.rich-text",
      text: "",
      accordion_group_id: null,
    },
  },
  {
    icon: <Text />,
    label: "Text Block",
    description: "Static paragraph-style text",
    component: {
      __component: "webpage.sections",
      title: "",
      content: "",
      accordion_group_id: null,
    },
  },
  {
    icon: <Quote />,
    label: "Quote",
    description: "Display a highlighted quote",
    component: {
      __component: "webpage.quote",
      user_name: "",
      accordion_group_id: null,
      quote: "",
    },
  },
  {
    icon: <TextQuote />,
    label: "Quote <br /> Section",
    description: "Display multiple quotes",
    component: {
      __component: "webpage.quote-section",
      title: "",
      Quotes: [],
      accordion_group_id: null,
      description: "",
    },
  },
  {
    icon: <Minus />,
    label: "Divider",
    description: "Visual break between sections",
    component: {
      __component: "webpage.divider",
      color: "#EDEDED",
      accordion_group_id: null,
      type: "",
    },
  },
  {
    icon: <ImageIcon />,
    label: "Image",
    description: "Show a single image",
    component: {
      __component: "webpage.image",
      image: null,
      caption: "",
      accordion_group_id: null,
    },
  },
  {
    icon: <FileVideo />,
    label: "Video",
    description: "Embed video for playback",
    component: {
      __component: "webpage.video",
      src: "YouTube",
      title: "",
      video: null,
      accordion_group_id: null,
      url: null,
    },
  },
  {
    icon: <Images />,
    label: "Image <br /> Section",
    description: "Multiple images in layout",
    component: {
      __component: "webpage.image-section",
      image: null,
      accordion_group_id: "",
      caption: "",
      title: "",
    },
  },
  {
    icon: <ListVideo />,
    label: "Video <br /> Testimonials",
    description: "User videos sharing feedback",
    component: {
      __component: "webpage.video-testimonials",
      testimonial: "",
      video_src: "YouTube",
      title: "",
      accordion_group_id: null,
      url: null,
      video: null,
    },
  },
  {
    icon: <CreditCard />,
    label: "Cards",
    description: "Container for grouped content",
    component: {
      __component: "webpage.card",
      url: "",
      title: "",
      bg_image: null,
      accordion_group_id: null,
      description: "",
    },
  },
  {
    icon: <IdCard />,
    label: "Story <br /> Card",
    description: "Visual layout for stories",
    component: {
      __component: "webpage.story-card",
      title: "",
      user_name: "",
      bg_image: null,
      accordion_group_id: null,
      description: "",
      web_url: "",
    },
  },
  {
    icon: <MessageCircleMore />,
    label: "Review <br /> Card",
    description: "Individual user review card",
    component: {
      __component: "webpage.review-card",
      title: "",
      user_name: "",
      summary: "",
      user_photo: null,
      accordion_group_id: null,
      web_url: "",
    },
  },
  {
    icon: <Newspaper />,
    label: "Review <br /> Section",
    description: "Group of user reviews",
    component: {
      __component: "webpage.review-section",
      title: "",
      reviews: [],
      accordion_group_id: null,
      description: "",
    },
  },
  {
    icon: <LayoutGrid />,
    label: "Category <br /> Card",
    description: "Display categorized content blocks",
    component: {
      __component: "webpage.category-card",
      name: "",
      accordion_group_id: null,
      icon: null,
    },
  },
  {
    icon: <Percent />,
    label: "Statistics <br /> Card",
    description: "Show Statistics-based metric",
    component: {
      __component: "webpage.percentage-card",
      title: "",
      accordion_group_id: null,
      description: "",
      icon: null,
      percentage: 0,
    },
  },
  {
    icon: <SquarePercent />,
    label: "Statistic <br /> Cards Section",
    description: "Group of Statistics cards",
    component: {
      __component: "webpage.percentage-card-section",
      title: "",
      percentage_cards: [],
      accordion_group_id: null,
      description: "",
    },
  },
  {
    icon: <Logs />,
    label: "Guidelines",
    description: "Rules or instructions display",
    component: {
      __component: "webpage.guidelines",
      title: "",
      accordion_group_id: null,
      do_instructions: "",
      dont_do_instructions: "",
    },
  },
  {
    icon: <MessageCircleQuestion />,
    label: "Help Line",
    description: "Support contact information card",
    component: {
      __component: "webpage.help-line",
      title: "",
      type: "phone",
      accordion_group_id: null,
      description: "",
      email: null,
      phone_number: null,
      website_url: null,
    },
  },
  {
    icon: <CustomLaptopMinimalButton />,
    label: "Button",
    description: "Triggers action or navigation.",
    component: {
      __component: "webpage.button",
      title: "",
      url: "",
      type: "web",
      accordion_group_id: null,
    },
  },
];

export const ContentFields = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: "content",
  });
  const [open, setOpen] = useState<boolean>(false);

  const handleAppendContent = useCallback(
    (component: ContentItem["component"]) => {
      append(component);
    },
    [append]
  );

  return (
    <div className="flex flex-col gap-4 border-b border-border py-4">
      <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
        <div>Content</div>
        <InputTooltip tooltip="Select Content Type">
          <InfoCircled className="w-[13px] h-auto" />
        </InputTooltip>
      </FormLabel>
      {fields.length > 0 && (
        <DragDropContext
          onDragEnd={(result: DropResult) => {
            const { source, destination } = result;
            if (!destination) return;
            move(source.index, destination.index);
          }}
        >
          <Droppable
            droppableId="content_components"
            isDropDisabled={false}
            direction="vertical"
            isCombineEnabled={true}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                className="flex flex-col gap-6 min-h-fit"
                id="content_container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((field, index) => {
                  return (
                    <DraggableWrapper
                      key={field.id}
                      field={field}
                      index={index}
                      remove={remove}
                      showCollapsible={field.__component != "webpage.divider"}
                      className={
                        field.__component != "webpage.divider"
                          ? field.__component == "webpage.quote-section" ||
                            field.__component == "webpage.review-section" ||
                            field.__component ==
                              "webpage.percentage-card-section" ||
                            field.__component == "webpage.accordion-group"
                            ? ""
                            : ""
                          : "[&_section]:h-[60px]"
                      }
                      header={getHeader(
                        field.__component,
                        field,
                        index,
                        form,
                        "content"
                      )}
                    >
                      {renderComponent(field, index, form, "content")}
                    </DraggableWrapper>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <AddButton
            type="button"
            text="Add Content"
            className="bg-muted w-full focus-visible:ring-0"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="font-inter w-[732px] grid grid-cols-6 gap-2 text-sm  no-scrollbar p-2 overflow-y-auto"
          side="bottom"
          align="center"
        >
          {contentItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => {
                setTimeout(() => {
                  handleAppendContent(item.component);
                }, 0);
              }}
              className="cursor-pointer relative bg-muted py-3 [&_svg]:size-6 rounded-md w-full h-full"
              asChild
            >
              <div>
                <div className="flex flex-col gap-2 items-center h-fit my-auto w-full">
                  {item.icon}
                  <p
                    className="text-center  text-xs tracking-tight"
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  />
                </div>
                <InputTooltip tooltip={item.description}>
                  <div className="absolute right-[6px] top-[6px] [&_svg]:size-[10px] text-text-darkGray">
                    <CircleAlert />
                  </div>
                </InputTooltip>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const getHeader = <T extends z.ZodType>(
  type: WebpageComponent["__component"],
  field: {
    __component: WebpageComponent["__component"];
  },
  index: number,
  form: UseFormReturn<z.infer<T>>,
  name: Path<z.infer<T>>
) => {
  switch (type) {
    case "webpage.divider":
      return (
        <>
          <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm grow">
            {contentItems.find(
              (i) => i.component.__component == field.__component
            )?.icon ?? <Check />}
            <div>
              {contentItems
                .find((i) => i.component.__component == field.__component)
                ?.label.replaceAll("<br />", "") ?? ""}
            </div>
          </div>
          <FormField
            control={form.control}
            name={`${name}.${index}.color` as Path<TypeOf<T>>}
            render={({ field: formField }) => {
              return (
                <FormItem className="space-y-[6px] mr-3">
                  <FormControl>
                    <ColorPicker
                      className="w-fit gap-2"
                      onColorChange={formField.onChange}
                      {...formField}
                      value={formField.value}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </>
      );
    case "webpage.image-section":
    case "webpage.video":
    case "webpage.review-card":
    case "webpage.review-section":
    case "webpage.quote-section":
    case "webpage.card":
    case "webpage.category-card":
    case "webpage.guidelines":
    case "webpage.percentage-card":
    case "webpage.percentage-card-section":
    case "webpage.sections":
    case "webpage.story-card":
    case "webpage.expandable-sections":
    case "webpage.video-testimonials":
    case "webpage.help-line":
    case "webpage.button":
    case "webpage.accordion-group":
      return (
        <>
          <div className="flex gap-2 grow">
            <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm">
              {contentItems.find(
                (i) => i.component.__component == field.__component
              )?.icon ?? <Check />}
              <div>
                {contentItems
                  .find((i) => i.component.__component == field.__component)
                  ?.label.replaceAll("<br />", "") ?? ""}
              </div>
            </div>
            <FormFieldWrapper
              showMessage={false}
              control={form.control}
              name={
                type == "webpage.category-card"
                  ? `${name}.${index}.name`
                  : `${name}.${index}.title`
              }
              required
              placeholder={`Write ${
                type == "webpage.category-card" ? "Category Name" : "title"
              } `}
              component={Input}
              className="w-[350px]"
            />
          </div>
          {type == "webpage.accordion-group" && (
            <FormField
              control={form.control}
              name={`${name}.${index}.default_open` as Path<TypeOf<T>>}
              render={({ field }) => {
                return (
                  <FormItem className="mr-2 h-5">
                    <InputTooltip tooltip="Default Open">
                      <Switch
                        onCheckedChange={field.onChange}
                        checked={field.value as boolean}
                        className={`${
                          field.value ? "bg-primary" : "bg-border"
                        } h-fit`}
                      />
                    </InputTooltip>
                  </FormItem>
                );
              }}
            />
          )}
        </>
      );
    default:
      return (
        <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm">
          {contentItems.find(
            (i) => i.component.__component == field.__component
          )?.icon ?? <Check />}
          <div>
            {contentItems
              .find((i) => i.component.__component == field.__component)
              ?.label.replaceAll("<br />", "") ?? ""}
          </div>
        </div>
      );
  }
};
