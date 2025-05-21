import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIBodySection, Section } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Button, SpinnerButton } from "@/components/ui/button";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionContext } from "@/context/section-data-provider";
import { toast } from "@/hooks/use-toast";
import SideDrawer from "../../articles/add-edit-articles/form-drawers";
import {
  FileDropZone,
  ViewTypSelection,
} from "../../articles/add-edit-articles/form-components";
import { SelectOptions } from "../../articles/add-edit-articles/form-components/render-webpage-component";
import nProgress from "nprogress";
import { HealthConditionSelectField } from "../collections/manage-collection";
import { PostSection, UpdateSection } from "@/lib/services/section-service";
import { iconSchema } from "../../articles/add-edit-articles/form-schema";

const formSchema = z.object({
  section_name: z.string().nonempty({ message: "Section Name is Required" }),
  associated_conditions: z
    .array(z.number())
    .min(1, { message: "Select Health Condition" }),
  section_description: z.string().optional(),
  view_type: z.enum(["grid", "horizontal", "vertical"]),
  position: z.number().nullable().optional(),
  section_type: z.enum(["animation", "health hacks", "tips"], {
    message: "Section type is required field",
  }),
  section_icon: iconSchema.nullable().optional(),
});

const AddOrEditSection = ({
  open,
  setOpen,
  handleSubmit,
  editSection,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  handleSubmit?: (id: number) => void;
  editSection?: number | null;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_name: "",
      associated_conditions: [],
      view_type: "horizontal",
    },
  });
  const [editSectionData, setEditSectionData] = useState<Section>();
  const { sections } = useContext(SectionContext);

  useEffect(() => {
    async function setDefaultData() {
      if (editSection) {
        const _editSection = sections.find(
          (section) => section.id == editSection
        );
        setEditSectionData(_editSection);
        if (_editSection) {
          form.setValue(
            "associated_conditions",
            _editSection.associated_conditions
              .map((i) => i.id)
              .filter((i) => i != null),
            {
              shouldValidate: true,
            }
          );
          form.setValue("section_name", _editSection.section_name ?? "", {
            shouldValidate: true,
          });
          form.setValue("view_type", _editSection.view_type ?? "horizontal", {
            shouldValidate: true,
          });
          form.setValue(
            "section_description",
            _editSection.section_description ?? "",
            {
              shouldValidate: true,
            }
          );
          form.setValue("section_icon", _editSection.section_icon, {
            shouldValidate: true,
          });
          form.clearErrors();
        }
      } else {
        form.reset();
        form.clearErrors();
        form.setValue("view_type", "horizontal", {
          shouldValidate: true,
        });
        form.setValue("section_type", "health hacks", {
          shouldValidate: true,
        });
        setEditSectionData(undefined);
      }
    }
    setDefaultData();
  }, [editSection, open]);

  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editSection ? "Edit Section" : "Add a new Section"}
      showPreview={false}
    >
      <SectionForm
        form={form}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        editSection={editSectionData}
      />
    </SideDrawer>
  );
};

export default AddOrEditSection;

const SectionForm = ({
  form,
  handleSubmit,
  setOpen,
  editSection,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (section: number) => void;
  setOpen: (state: boolean) => void;
  editSection?: Section;
}) => {
  const [loading, setLoading] = useState(false);

  const handleSaveSection = async (status: "published" | "draft") => {
    setLoading(true);
    nProgress.start();
    try {
      if (status == "draft") {
        setLoading(false);
        nProgress.done();
        return toast({
          title: "Unable to Save",
          description: `Doesn't support yet`,
          draggable: true,
          className: "[&_.font-semibold]:text-[red]",
        });
      } else {
        if (status == "published" && !form.formState.isValid) return;
        const formValues = form.getValues();

        const data: APIBodySection = {
          id: editSection ? editSection.id : null,
          ...(editSection ? editSection : {}),
          collections: editSection?.collections || [],
          sub_sections: editSection
            ? editSection?.sub_sections
                ?.map((i) => i.id as number)
                .filter((id) => id != null)
            : [],
          ...form.getValues(),
          section_icon: formValues.section_icon?.id ?? null,
        };

        let response;
        if (editSection) {
          response = await UpdateSection(data);
        } else {
          response = await PostSection(data);
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
          <span className="capitalize">{"Section"}</span>
          {editSection ? " updated" : " created"} successfully
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
              name="section_name"
              label="Name"
              required
              tooltip="Enter Name"
              className="min-h-0"
              placeholder="Write Section Name here"
              component={Input}
            />
            <HealthConditionSelectField form={form} />
            <SelectOptions
              control={form.control}
              label="Type"
              required
              name={`section_type`}
              options={["animation", "health hacks", "tips"]}
              tooltip="Select the Type of source"
              placeholder="Select type"
            />
            <FormFieldWrapper
              control={form.control}
              name={`position`}
              label="Position"
              type="number"
              tooltip="Enter position"
              placeholder="Write position"
              component={Input}
            />

            <FormFieldWrapper
              control={form.control}
              name="section_description"
              label="Description"
              tooltip="Enter Description"
              className="min-h-[126px]"
              placeholder="Write Description here"
              component={Textarea}
            />
            <FileDropZone
              control={form.control}
              fieldValue={form.getValues("section_icon")}
              name="section_icon"
              label="Icon"
              tooltip="Select icon Image"
            />
            <ViewTypSelection formControl={form.control} />
            {/* {viewType == "grid" && (
              <>
                <FormField
                  control={form.control}
                  name={"background-color"}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-[6px]">
                      <FormLabel className="flex gap-[2px]">
                        <div className="font-inter text-sm">
                          Background color
                        </div>
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
                  name={"title-color"}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-[6px]">
                      <FormLabel className="flex gap-[2px]">
                        <div className="font-inter text-sm">Title color</div>
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
                <div className="col-span-2">
                  <FileDropZone
                    control={form.control}
                    name="cover_image"
                    label="Cover IImage"
                    tooltip="Select Cover Image Image"
                  />
                </div>
              </>
            )} */}
          </div>
          <div className="flex gap-2">
            <SpinnerButton
              type="button"
              loading={loading}
              className="px-6 w-fit"
              disabled={!form.formState.isValid || loading}
              onClick={() => handleSaveSection("published")}
            >
              Save
            </SpinnerButton>
            {!editSection && (
              <Button
                type="button"
                className="px-6 w-fit bg-muted text-primary hover:shadow-none dark:text-white"
                onClick={() => handleSaveSection("draft")}
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
