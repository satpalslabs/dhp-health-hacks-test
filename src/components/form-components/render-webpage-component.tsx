import {
  ArrayPath,
  FieldArray,
  Path,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { TypeOf, z } from "zod";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import RichTextEditor from "@/components/ui/text-editor";
import { FileDropZone } from "./file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import InfoCircled from "@/info-circled.svg";
import { AddButton } from "@/components/ui/add-button";
import { WebpageComponent } from "@/types";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { DraggableWrapper } from "./draggable-wrapper";
import {
  Check,
  ChevronsUpDown,
  CircleAlert,
  MessageCircleMore,
  Quote,
  X,
} from "lucide-react";
import { commonProps } from ".";
import { useState } from "react";
import { E164Number } from "libphonenumber-js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { contentItems, getHeader } from "./webpage-content-fields";
import { WebpageSchema } from "@/components/cms/articles/add-edit-articles/form-schema";

export const renderComponent = <T extends z.ZodType>(
  field: {
    __component: WebpageComponent["__component"];
  },
  index: number,
  form: UseFormReturn<z.infer<T>>,
  name: Path<z.infer<T>>
) => {
  const componentsMap = (type: WebpageComponent["__component"]) => {
    switch (type) {
      case "webpage.accordion-group":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.description`}
              label="Description"
              tooltip="Enter Description"
              placeholder="Write Description here"
              component={Textarea}
            />
            <AddContentSection
              form={form}
              index={index}
              name={`${name}` as Path<TypeOf<T>>}
            />
          </div>
        );
      case "webpage.expandable-sections":
        return (
          <FormField
            control={form.control}
            name={`${name}.${index}.content` as Path<TypeOf<T>>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-[2px] font-inter text-sm items-center [&_svg]:size-3">
                  <div>Content</div>
                  <span className="text-[red]">*</span>
                  <InputTooltip tooltip="Select Content Type">
                    <InfoCircled />
                  </InputTooltip>
                </FormLabel>
                <RichTextEditor
                  value={field.value && field.value != null ? field.value : ""}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        );
      case "webpage.short-text":
        return (
          <FormFieldWrapper
            control={form.control}
            name={`${name}.${index}.text`}
            label="Text"
            required
            tooltip="Enter text"
            placeholder="Write Text here"
            component={Textarea}
            className="min-h-[110px]"
          />
        );
      case "webpage.sections":
        return (
          <FormField
            control={form.control}
            name={`${name}.${index}.content` as Path<TypeOf<T>>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
                  <p>Content</p>
                  <span className="text-[red]">*</span>
                  <InputTooltip tooltip="Write Content">
                    <InfoCircled className="w-[13px] h-auto" />
                  </InputTooltip>
                </FormLabel>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        );
      case "webpage.rich-text":
        return (
          <FormField
            control={form.control}
            name={`${name}.${index}.text` as Path<TypeOf<T>>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
                  <p>Text</p>
                  <span className="text-[red]">*</span>
                  <InputTooltip tooltip="Write Text">
                    <InfoCircled className="w-[13px] h-auto" />
                  </InputTooltip>
                </FormLabel>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        );
      case "webpage.quote":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.user_name`}
              label="User Name"
              required
              tooltip="Enter user name"
              placeholder="Write user name"
              component={Input}
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.quote`}
              label="Quote"
              required
              tooltip="Enter quote"
              placeholder="Write  quote"
              component={Textarea}
              className="min-h-[78px]"
            />
          </div>
        );
      case "webpage.quote-section":
        return <QuoteSectionComponent index={index} form={form} name={name} />;

      case "webpage.image":
        return (
          <div className="flex flex-col gap-3">
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              name={`${name}.${index}.image`}
              fieldValue={form.getValues(
                `${name}.${index}.image` as Path<TypeOf<T>>
              )}
              required
              label="Image"
              tooltip="Select Image"
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.caption`}
              label="Caption"
              required
              tooltip="Enter Caption"
              placeholder="Write caption"
              component={Input}
            />
          </div>
        );
      case "webpage.image-section":
        return (
          <div className="flex flex-col gap-3">
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              required
              name={`${name}.${index}.image`}
              fieldValue={form.getValues(
                `${name}.${index}.image` as Path<TypeOf<T>>
              )}
              label="Image"
              tooltip="Select Image"
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.caption`}
              label="Caption"
              tooltip="Enter Caption"
              placeholder="Write caption"
              component={Input}
            />
          </div>
        );
      case "webpage.video": {
        const type = form.watch(`${name}.${index}.src` as Path<TypeOf<T>>);
        return (
          <div className="flex flex-col gap-3">
            {type != "Others" && (
              <FormFieldWrapper
                control={form.control}
                name={`${name}.${index}.url`}
                label="URL"
                tooltip="Enter url"
                placeholder="Write url here"
                component={Input}
              />
            )}
            <SelectOptions
              control={form.control}
              label="Source"
              name={`${name}.${index}.src`}
              options={["YouTube", "Others"]}
              tooltip="Select the Type of source"
              placeholder="Source Type"
            />
            {type == "Others" && (
              <FileDropZone
                dropZoneString={"Drop files here or click to browse "}
                control={form.control}
                name={`${name}.${index}.video`}
                fieldValue={form.getValues(
                  `${name}.${index}.video` as Path<TypeOf<T>>
                )}
                label="Upload Video"
                tooltip="Select Video"
                accept={{ "video/mp4": [".mp4", ".MP4"] }}
              />
            )}
          </div>
        );
      }
      case "webpage.video-testimonials": {
        const type = form.watch(
          `${name}.${index}.video_src` as Path<TypeOf<T>>
        );

        return (
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name={`${name}.${index}.testimonial` as Path<TypeOf<T>>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
                    <p>Testimonial</p>
                    <span className="text-[red]">*</span>
                    <InputTooltip tooltip="Write testimonial">
                      <InfoCircled className="w-[13px] h-auto" />
                    </InputTooltip>
                  </FormLabel>
                  <RichTextEditor
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <SelectOptions
              control={form.control}
              label="Source"
              name={`${name}.${index}.video_src`}
              options={["YouTube", "Others"]}
              tooltip="Select the Type of source"
              placeholder="Source Type"
            />
            {type == "Others" ? (
              <FileDropZone
                dropZoneString={"Drop files here or click to browse "}
                control={form.control}
                name={`${name}.${index}.video`}
                fieldValue={form.getValues(
                  `${name}.${index}.video` as Path<TypeOf<T>>
                )}
                label="Upload Video"
                tooltip="Select Video"
                accept={{ "video/mp4": [".mp4", ".MP4"] }}
              />
            ) : (
              <FormFieldWrapper
                control={form.control}
                name={`${name}.${index}.url`}
                label="URL"
                tooltip="Enter url"
                placeholder="Write URL"
                component={Input}
              />
            )}
          </div>
        );
      }
      case "webpage.divider":
        return null;
      case "webpage.card":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.description`}
              label="Description"
              tooltip="Enter description"
              placeholder="Write description"
              component={Textarea}
              className="min-h-[110px]"
            />
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              name={`${name}.${index}.bg_image`}
              fieldValue={form.getValues(
                `${name}.${index}.bg_image` as Path<TypeOf<T>>
              )}
              label="Thumbnail"
              required
              tooltip="Select Image"
            />
          </div>
        );
      case "webpage.story-card":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.description`}
              label="Description"
              required
              tooltip="Enter description"
              placeholder="Write description"
              component={Textarea}
              className="min-h-[110px]"
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.user_name`}
              label="User Name"
              required
              tooltip="Enter User Name"
              placeholder="Write User Name"
              component={Input}
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.web_url`}
              label="URL"
              required
              tooltip="Enter URL"
              placeholder="Write URL"
              component={Input}
            />
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              name={`${name}.${index}.bg_image`}
              fieldValue={form.getValues(
                `${name}.${index}.bg_image` as Path<TypeOf<T>>
              )}
              label="Background Image"
              tooltip="Select Image"
            />
          </div>
        );
      case "webpage.review-card":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.user_name`}
              label="User Name"
              required
              tooltip="Enter User Name"
              placeholder="Write User Name"
              component={Input}
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.summary`}
              label="Summary"
              required
              tooltip="Enter Summary"
              placeholder="Write Summary"
              component={Textarea}
              className="min-h-[110px]"
            />
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              name={`${name}.${index}.user_photo`}
              fieldValue={form.getValues(
                `${name}.${index}.user_photo` as Path<TypeOf<T>>
              )}
              label="User Photo"
              tooltip="Select Image"
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.web_url`}
              label="Web URL"
              required
              tooltip="Enter Web URL"
              placeholder="Write Web URL"
              component={Input}
            />
          </div>
        );
      case "webpage.review-section":
        return <ReviewSectionComponent index={index} form={form} name={name} />;

      case "webpage.category-card":
        return (
          <FileDropZone
            dropZoneString={"Drop files here or click to browse "}
            control={form.control}
            name={`${name}.${index}.icon`}
            fieldValue={form.getValues(
              `${name}.${index}.icon` as Path<TypeOf<T>>
            )}
            label="Icon"
            required
            tooltip="Select Image"
          />
        );
      case "webpage.percentage-card":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.description`}
              label="Description"
              required
              tooltip="Enter Description"
              placeholder="Write  Description"
              component={Textarea}
              className="min-h-[110px]"
            />
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.percentage`}
              label="Percentage <span class='text-text-darkGray'>(0-100)</span>"
              type="number"
              required
              tooltip="Enter Percentage"
              placeholder="Write Percentage"
              component={Input}
            />
            <FileDropZone
              dropZoneString={"Drop files here or click to browse "}
              control={form.control}
              name={`${name}.${index}.icon`}
              fieldValue={form.getValues(
                `${name}.${index}.icon` as Path<TypeOf<T>>
              )}
              label="Icon"
              required
              tooltip="Select Image"
            />
          </div>
        );
      case "webpage.percentage-card-section":
        return (
          <PercentageCardSectionComponent
            index={index}
            form={form}
            name={name}
          />
        );

      case "webpage.guidelines":
        return (
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name={`${name}.${index}.do_instructions` as Path<TypeOf<T>>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-[2px] font-inter text-sm items-center [&_svg]:size-3">
                    <div>Do Instructions </div>
                    <span className="text-[red]">*</span>
                    <InputTooltip tooltip="Select Content Type">
                      <InfoCircled />
                    </InputTooltip>
                  </FormLabel>
                  <RichTextEditor
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.${index}.dont_do_instructions` as Path<TypeOf<T>>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-[2px] font-inter text-sm items-center [&_svg]:size-3">
                    <div>{"Don't Do Instructions"} </div>
                    <span className="text-[red]">*</span>
                    <InputTooltip tooltip="Select Content Type">
                      <InfoCircled />
                    </InputTooltip>
                  </FormLabel>
                  <RichTextEditor
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>
        );
      case "webpage.help-line": {
        const type = form.watch(`${name}.${index}.type` as Path<TypeOf<T>>);
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.description`}
              label="Description"
              required
              tooltip="Enter Description"
              placeholder="Write  Description"
              component={Textarea}
              className="min-h-[110px]"
            />
            <SelectOptions
              control={form.control}
              label="Source"
              name={`${name}.${index}.type`}
              options={["phone", "email", "sms", "in_app_support", "website"]}
              tooltip="Select the Type of source"
              placeholder="Source Type"
            />
            {type == "phone" || type == "sms" ? (
              <FormField
                control={form.control}
                name={`${name}.${index}.phone_number` as Path<TypeOf<T>>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-[2px] font-inter text-sm items-center [&_svg]:size-3">
                      <div>Phone </div>
                      <span className="text-[red]">*</span>
                      <InputTooltip tooltip="Select Content Type">
                        <InfoCircled />
                      </InputTooltip>
                    </FormLabel>
                    <PhoneInput
                      {...field}
                      defaultCountry="IN"
                      onChange={field.onChange}
                      value={field.value as E164Number}
                    />
                  </FormItem>
                )}
              />
            ) : type == "website" ? (
              <FormFieldWrapper
                control={form.control}
                name={`${name}.${index}.website_url`}
                label="Website URL"
                required
                tooltip="Enter Website URL"
                placeholder="Write Website URL"
                component={Input}
              />
            ) : type == "email" ? (
              <FormFieldWrapper
                control={form.control}
                name={`${name}.${index}.email`}
                label="Email"
                required
                type="email"
                tooltip="Enter Email"
                placeholder="Write help line Email"
                component={Input}
              />
            ) : (
              <></>
            )}
          </div>
        );
      }
      case "webpage.button":
        return (
          <div className="flex flex-col gap-3">
            <FormFieldWrapper
              control={form.control}
              name={`${name}.${index}.url`}
              label="URK"
              required
              tooltip="Enter URL"
              placeholder="Write  URL"
              component={Input}
            />
            <SelectOptions
              control={form.control}
              label="Type"
              required
              name={`${name}.${index}.type`}
              options={["web", "email", "phone", "sms"]}
              tooltip="Select the Type of source"
              placeholder="Select type"
            />
          </div>
        );
      default:
        return null;
    }
  };
  return componentsMap(field.__component) || null;
};

interface selectOptionsTypeField extends commonProps {
  options: string[];
  onSelect?: (type: string) => void;
}
export const SelectOptions = ({
  control,
  name,
  label,
  tooltip,
  placeholder,
  options,
  onSelect,
}: selectOptionsTypeField) => {
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
                      className="w-full justify-between font-normal relative hover:bg-transparent data-[state='open']:border-foreground font-inter"
                    >
                      {field.value ? (
                        <div
                          className={`flex gap-4 items-center relative font-inter p-2 text-sm rounded-md w-full grow capitalize`}
                        >
                          {options.find((i) => i == field.value)}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(null);
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
                    <CommandList>
                      <CommandEmpty>No {label} found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((item, ix) => (
                          <CommandItem
                            key={ix}
                            value={item}
                            className="text-sm p-2 w-full capitalize"
                            onSelect={() => {
                              field.onChange(item);
                              if (item && onSelect != undefined) {
                                onSelect(item);
                              }

                              setOpen(false);
                            }}
                          >
                            {item}
                            {field.value == item && (
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

const QuoteSectionComponent = <T extends z.ZodType>({
  index,
  form,
  name,
}: {
  index: number;
  form: UseFormReturn<z.infer<T>>;
  name: Path<z.infer<T>>;
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: `${name}.${index}.Quotes` as ArrayPath<TypeOf<T>>,
  });
  return (
    <div className="flex flex-col gap-3 ">
      <FormFieldWrapper
        control={form.control}
        name={`${name}.${index}.description`}
        label="Description"
        tooltip="Enter Description"
        placeholder="Write Description here"
        component={Textarea}
        className="min-h-[110px]"
      />
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
                id={`${name}.${index}.Quotes`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((field, ix) => {
                  return (
                    <DraggableWrapper
                      key={field.id}
                      field={field}
                      className="bg-muted-light/20"
                      index={ix}
                      remove={remove}
                      header={
                        <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm">
                          <Quote />
                          <div>Quote</div>
                        </div>
                      }
                    >
                      <div className="flex flex-col gap-3">
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.Quotes.${ix}.user_name`}
                          label="User Name"
                          required
                          tooltip="Enter user name"
                          placeholder="Write user name"
                          component={Input}
                        />
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.Quotes.${ix}.quote`}
                          label="Quote"
                          required
                          tooltip="Enter quote"
                          placeholder="Write  quote"
                          component={Textarea}
                          className="min-h-[110px]"
                        />
                      </div>
                    </DraggableWrapper>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <AddButton
        type="button"
        text="Add Quote Card"
        className="bg-muted w-full focus-visible:ring-0"
        onClick={() => {
          append({
            user_name: "",
            quote: "",
            accordion_group_id: null,
          } as FieldArray<TypeOf<T>>);
        }}
      />
    </div>
  );
};

const ReviewSectionComponent = <T extends z.ZodType>({
  index,
  form,
  name,
}: {
  index: number;
  form: UseFormReturn<z.infer<T>>;
  name: Path<z.infer<T>>;
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: `${name}.${index}.reviews` as ArrayPath<TypeOf<T>>,
  });

  return (
    <div className="flex flex-col gap-3">
      <FormFieldWrapper
        control={form.control}
        name={`${name}.${index}.description`}
        label="Description"
        required
        tooltip="Enter Description"
        placeholder="Write Description"
        component={Textarea}
        className="min-h-[110px]"
      />
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
                id={`${name}.${index}.reviews`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((field, ix) => {
                  return (
                    <DraggableWrapper
                      key={field.id}
                      field={field}
                      index={ix}
                      className="bg-muted-light/20"
                      remove={remove}
                      header={
                        <>
                          <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm ">
                            <MessageCircleMore />
                            <div>Review Card</div>
                          </div>
                          <FormFieldWrapper
                            control={form.control}
                            name={`${name}.${index}.reviews.${ix}.title`}
                            required
                            placeholder={`Write title`}
                            component={Input}
                            className="w-[350px]"
                          />
                        </>
                      }
                    >
                      <div className="flex flex-col gap-3">
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.reviews.${ix}.user_name`}
                          label="User Name"
                          required
                          tooltip="Enter User Name"
                          placeholder="Write User Name"
                          component={Input}
                        />
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.reviews.${ix}.summary`}
                          label="Summary"
                          required
                          tooltip="Enter Summary"
                          placeholder="Write Summary"
                          component={Textarea}
                          className="min-h-[110px]"
                        />
                        <FileDropZone
                          dropZoneString={"Drop files here or click to browse "}
                          control={form.control}
                          name={`${name}.${index}.reviews.${ix}.user_photo`}
                          fieldValue={form.getValues(
                            `${name}.${index}.reviews.${ix}.user_photo` as Path<
                              TypeOf<T>
                            >
                          )}
                          label="User Photo"
                          tooltip="Select Image"
                        />
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.reviews.${ix}.web_url`}
                          label="Web URL"
                          required
                          tooltip="Enter Web URL"
                          placeholder="Write Web URL"
                          component={Input}
                        />
                      </div>
                    </DraggableWrapper>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <AddButton
        type="button"
        text="Add Review Card"
        className="bg-muted w-full focus-visible:ring-0"
        onClick={() => {
          append({
            user_name: "",
            summary: "",
            title: "",
            user_photo: null,
            web_url: "",
            accordion_group_id: null,
          } as FieldArray<TypeOf<T>>);
        }}
      />
    </div>
  );
};

const PercentageCardSectionComponent = <T extends z.ZodType>({
  index,
  form,
  name,
}: {
  index: number;
  form: UseFormReturn<z.infer<T>>;
  name: Path<z.infer<T>>;
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: `${name}.${index}.percentage_cards` as ArrayPath<TypeOf<T>>,
  });
  return (
    <div className="flex flex-col gap-3">
      <FormFieldWrapper
        control={form.control}
        name={`${name}.${index}.description`}
        label="Description"
        required
        tooltip="Enter Description"
        placeholder="Write  Description"
        component={Textarea}
        className="min-h-[110px]"
      />
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
                id={`${name}.${index}.percentage_cards`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields.map((field, ix) => {
                  return (
                    <DraggableWrapper
                      key={field.id}
                      field={field}
                      index={ix}
                      remove={remove}
                      className="bg-muted-light/20"
                      header={
                        <>
                          <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm ">
                            <MessageCircleMore />
                            <div>Statistic Card</div>
                          </div>
                          <FormFieldWrapper
                            control={form.control}
                            name={`${name}.${index}.percentage_cards.${ix}.title`}
                            required
                            placeholder={`Write title`}
                            component={Input}
                            className="w-[350px]"
                          />
                        </>
                      }
                    >
                      <div className="flex flex-col gap-3 bg-transparent">
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.percentage_cards.${ix}.description`}
                          label="Description"
                          required
                          tooltip="Enter Description"
                          placeholder="Write  Description"
                          component={Textarea}
                          className="min-h-[110px]"
                        />
                        <FormFieldWrapper
                          control={form.control}
                          name={`${name}.${index}.percentage_cards.${ix}.percentage`}
                          label="Percentage <span class='text-text-darkGray'>(0-100)</span>"
                          type="number"
                          required
                          tooltip="Enter Percentage"
                          placeholder="Write Percentage"
                          component={Input}
                        />
                        <FileDropZone
                          dropZoneString={"Drop files here or click to browse "}
                          control={form.control}
                          name={`${name}.${index}.percentage_cards.${ix}.icon`}
                          fieldValue={form.getValues(
                            `${name}.${index}.percentage_cards.${ix}.icon` as Path<
                              TypeOf<T>
                            >
                          )}
                          label="Icon"
                          required
                          tooltip="Select Image"
                        />
                      </div>
                    </DraggableWrapper>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <AddButton
        type="button"
        text="Add Statistic Card"
        className="bg-muted w-full focus-visible:ring-0"
        onClick={() => {
          append({
            description: "",
            title: "",
            percentage: 0,
            icon: null,
            accordion_group_id: null,
          } as FieldArray<TypeOf<T>>);
        }}
      />
    </div>
  );
};

const AddContentSection = <T extends z.ZodType>({
  index,
  form,
  name,
}: {
  index: number;
  form: UseFormReturn<z.infer<T>>;
  name: Path<z.infer<T>>;
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: `${name}.${index}.group_content` as ArrayPath<TypeOf<T>>,
  });
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-4 border-b border-border py-4">
      {fields.length > 0 && (
        <DragDropContext
          onDragEnd={(result: DropResult) => {
            const { source, destination } = result;
            if (!destination) return;
            move(source.index, destination.index);
          }}
        >
          <Droppable
            droppableId="group_contents"
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
                {fields.map((field, ix) => {
                  if (
                    "__component" in field &&
                    field.__component != "webpage.accordion-group"
                  ) {
                    return (
                      <DraggableWrapper
                        key={field.id}
                        field={
                          field as {
                            id: string;
                            __component: WebpageComponent["__component"];
                          }
                        }
                        index={ix}
                        remove={remove}
                        showCollapsible={field.__component != "webpage.divider"}
                        className={
                          field.__component != "webpage.divider"
                            ? field.__component == "webpage.quote-section" ||
                              field.__component == "webpage.review-section" ||
                              field.__component ==
                                "webpage.percentage-card-section"
                              ? "bg-muted-light/10"
                              : "bg-muted-light/5"
                            : "[&_section]:h-[60px]"
                        }
                        header={getHeader(
                          field.__component as WebpageComponent["__component"],
                          field as {
                            id: string;
                            __component: WebpageComponent["__component"];
                          },
                          ix,
                          form,
                          `${name}.${index}.group_content` as Path<TypeOf<T>>
                        )}
                      >
                        {renderComponent(
                          field as {
                            id: string;
                            __component: WebpageComponent["__component"];
                          },
                          ix,
                          form,
                          `${name}.${index}.group_content` as Path<TypeOf<T>>
                        )}
                      </DraggableWrapper>
                    );
                  }
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className=" flex flex-col gap-4">
        <div className="flex items-center justify-between">
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
              {contentItems.map(
                (
                  item: {
                    icon: React.ReactNode;
                    label: string;
                    description: string;
                    component: z.infer<typeof WebpageSchema>["content"][number];
                  },
                  index
                ) => {
                  if (item.component.__component == "webpage.accordion-group") {
                    return;
                  }
                  return (
                    <DropdownMenuItem
                      key={index}
                      className="cursor-pointer relative bg-muted py-3 [&_svg]:size-6 rounded-md"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default selection behavior
                        append(item.component as FieldArray<TypeOf<T>>);
                        setOpen(false);
                      }}
                    >
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
                    </DropdownMenuItem>
                  );
                }
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
