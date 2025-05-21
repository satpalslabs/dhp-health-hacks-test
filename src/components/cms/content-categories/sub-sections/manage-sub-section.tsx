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
import { APIBodySubSection, SubSection } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Button, SpinnerButton } from "@/components/ui/button";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InputTooltip from "@/components/ui/input-info-tooltip";
import ColorPicker from "@/components/ui/color-picker";
import InfoCircled from "@/info-circled.svg";
import { SubSectionContext } from "@/context/sub-section-data-provider";
import { toast } from "@/hooks/use-toast";
import {
  FileDropZone,
  ViewTypSelection,
} from "../../articles/add-edit-articles/form-components";
import SideDrawer from "../../articles/add-edit-articles/form-drawers";
import { iconSchema } from "../../articles/add-edit-articles/form-schema";
import nProgress from "nprogress";
import {
  PostSubSection,
  UpdateSubSection,
} from "@/lib/services/sub-section-service";
import { HealthConditionSelectField } from "../collections/manage-collection";
import { SectionSelectField } from "../../articles/add-edit-articles/form-components/grid-fields";

const formSchema = z.object({
  subsection_name: z.string().nonempty({ message: "Section Name is Required" }),
  associated_conditions: z.array(z.number()).min(1),
  section: z.number().nullable(),
  subsection_description: z.string(),
  view_type: z.enum(["grid", "horizontal", "vertical"]),
  bg_color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" }),
  title_color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" })
    .nullable()
    .optional(),
  subsection_icon: iconSchema.optional(),
});

const AddOrEditSubSection = ({
  open,
  setOpen,
  handleSubmit,
  editSub_Section,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: (sub_Section: number) => void;
  editSub_Section?: number | null;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subsection_name: "",
      associated_conditions: [],
      subsection_description: "",
      view_type: "horizontal",
    },
  });
  const [editSubSectionData, setEditSubSectionData] = useState<SubSection>();
  const { subSections } = useContext(SubSectionContext);
  useEffect(() => {
    if (editSub_Section && open) {
      const _editSubSection = subSections.find(
        (sub_section) => sub_section.id == editSub_Section
      );
      setEditSubSectionData(_editSubSection);
      if (_editSubSection) {
        form.setValue("bg_color", _editSubSection.bg_color ?? "", {
          shouldValidate: true,
        });
        form.setValue("section", _editSubSection.section?.id ?? 0, {
          shouldValidate: true,
        });
        form.setValue("view_type", _editSubSection.view_type ?? "horizontal", {
          shouldValidate: true,
        });
        form.setValue(
          "associated_conditions",
          _editSubSection.associated_conditions
            ?.map((i) => i.id)
            .filter((i) => i != null),
          {
            shouldValidate: true,
          }
        );
        form.setValue(
          "subsection_description",
          _editSubSection.subsection_description ?? "",
          {
            shouldValidate: true,
          }
        );
        form.setValue(
          "subsection_name",
          _editSubSection.subsection_name ?? "",
          {
            shouldValidate: true,
          }
        );
        form.clearErrors();
      }
    } else {
      form.reset();
      form.setValue("view_type", "horizontal", {
        shouldValidate: true,
      });
    }
  }, [editSub_Section, open]);
  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editSub_Section ? "Edit Subsection" : "Add a new Subsection"}
      showPreview={false}
    >
      <SubSectionForm
        form={form}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        editSub_Section={editSubSectionData}
      />
    </SideDrawer>
  );
};

export default AddOrEditSubSection;

const SubSectionForm = ({
  form,
  handleSubmit,
  setOpen,
  editSub_Section,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (sub_section: number) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editSub_Section?: SubSection;
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubSection = async (status: "published" | "draft") => {
    setLoading(true);
    nProgress.start();
    try {
      if (status == "draft") {
        return toast({
          title: "Unable to Save",
          description: `Doesn't support yet`,
          draggable: true,
          className: "[&_.font-semibold]:text-[red]",
        });
      } else {
        if (status == "published" && !form.formState.isValid) return;
        const formValues = form.getValues();
        const data: APIBodySubSection = {
          ...editSub_Section,
          id: editSub_Section?.id ?? null, // Ensure 'id' is explicitly set to null or a number
          ...formValues,
          subsection_icon: formValues.subsection_icon
            ? formValues.subsection_icon?.id ?? null
            : null,
          collections: editSub_Section
            ? editSub_Section?.collections.map((i) => i)
            : [],
        };

        let response;
        if (editSub_Section) {
          response = await UpdateSubSection(data);
        } else {
          response = await PostSubSection(data);
        }
        onSuccess();
        if (handleSubmit && response?.id) {
          handleSubmit(response?.id);
        }
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error", error);
      nProgress.done();
      setLoading(true);
      toast({
        title: `Error`,
        description:
          typeof error === "object" && error !== null && "message" in error
            ? (error.message as string)
            : JSON.stringify(error),
      });
    }
  };

  const onSuccess = () => {
    setLoading(false);
    nProgress.done();
    form.reset();
    setOpen(false);
    toast({
      title: `Success`,
      description: (
        <p>
          <span className="capitalize">Sub-section</span>
          {editSub_Section ? " updated" : " created"} successfully
        </p>
      ),
    });
  };

  return (
    <div className="h-full py-3 p-6">
      <Form {...form}>
        <div className="h-full flex flex-col border border-border rounded-[12px] p-6">
          <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-5">
            <FormFieldWrapper
              control={form.control}
              name="subsection_name"
              label="Name"
              required
              tooltip="Enter Name"
              className="min-h-0"
              placeholder="Write Subsection Name here"
              component={Input}
            />
            <HealthConditionSelectField form={form} />
            <SectionSelectField
              form={form}
              formControl={form.control}
              required
            />

            <FormFieldWrapper
              control={form.control}
              name="subsection_description"
              label="Description"
              tooltip="Enter Description"
              className="min-h-[126px]"
              placeholder="Write Description here"
              component={Textarea}
            />
            <ViewTypSelection formControl={form.control} />
            <FileDropZone
              control={form.control}
              fieldValue={form.getValues("subsection_icon")}
              name="icon"
              label="Icon"
              tooltip="Select icon Image"
            />

            <FormField
              control={form.control}
              name={"bg_color"}
              render={({ field: formField }) => (
                <FormItem className="space-y-[6px]">
                  <FormLabel className="flex gap-[2px]">
                    <div className="font-inter text-sm">Background color</div>
                    <span className="text-[red]">*</span>
                    <InputTooltip tooltip={"background color"}>
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
              name={"title_color"}
              render={({ field: formField }) => (
                <FormItem className="space-y-[6px]">
                  <FormLabel className="flex gap-[2px]">
                    <div className="font-inter text-sm">Title color</div>
                    <InputTooltip tooltip={"TItle color"}>
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
          </div>
          <div className="flex gap-2">
            <SpinnerButton
              type="button"
              className="px-6 w-fit"
              loading={loading}
              disabled={!form.formState.isValid || loading}
              onClick={() => handleSubSection("published")}
            >
              Save
            </SpinnerButton>
            {!editSub_Section && (
              <Button
                type="button"
                className="px-6 w-fit bg-muted text-primary hover:shadow-none dark:text-white"
                onClick={() => handleSubSection("draft")}
              >
                Save as Draft
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};
