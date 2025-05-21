import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../form-schema";
import { z } from "zod";
import { FileDropZone } from ".";
import RichTextEditor from "@/components/ui/text-editor";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";

export const renderCommonFields = (
  form: UseFormReturn<z.infer<typeof formSchema>>,
  isContentPage: boolean
) => {
  const isVideo = form.watch("content_type") === "content-video";
  return (
    <>
      <FormFieldWrapper
        control={form.control}
        name="title"
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
        required={false}
        placeholder="Write description here"
        component={Textarea}
      />

      <FormFieldWrapper
        control={form.control}
        name="url"
        label={isVideo ? "Video URL" : "URL"}
        required
        tooltip="Enter URL"
        placeholder="Write URL here"
        component={Input}
      />
      {isVideo && (
        <>
          <FormFieldWrapper
            control={form.control}
            name="video_duration"
            label="Video Duration"
            required
            tooltip="Enter Video Duration"
            className="min-h-0"
            placeholder="Write Video Duration"
            component={Input}
          />
          <FormField
            control={form.control}
            name="key_points"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-[2px] font-inter text-sm items-center [&_svg]:size-3">
                  <div>Key points</div>
                  <InputTooltip tooltip="Key points">
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
        </>
      )}

      {!isContentPage && (
        <>
          <FileDropZone
            control={form.control}
            fieldValue={form.getValues("thumbnail_icon")}
            name="thumbnail_icon"
            label="Thumbnail Icon"
            tooltip="Select thumbnail_icon Image"
          />
          {/* <SelectField
            control={form.control}
            name="source"
            label="Source"
            tooltip="Select Source"
            placeholder="Select Source"
            options={_sources}
            required
          /> */}
        </>
      )}
    </>
  );
};
