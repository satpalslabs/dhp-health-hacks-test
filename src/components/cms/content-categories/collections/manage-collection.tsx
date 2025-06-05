import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Path, PathValue, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiBodyCollection, Collection } from "@/types";
import { useContext, useEffect, useState } from "react";
import {  SpinnerButton } from "@/components/ui/button";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddButton } from "@/components/ui/add-button";
import InputTooltip from "@/components/ui/input-info-tooltip";
import ColorPicker from "@/components/ui/color-picker";
import InfoCircled from "@/info-circled.svg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HConditionContext } from "@/context/health-conditions-provider";
import { CollectionContext } from "@/context/collection-data-provider";
import SideDrawer from "@/components/cms/articles/add-edit-articles/form-drawers";
import {
  FileDropZone,
  SelectField,
  ViewTypSelection,
} from "@/components/form-components";
import AddHealthHacksConditionModel from "@/components/form-components/add-health-hacks-condition";
import {
  SectionSelectField,
  SubSectionSelectField,
} from "@/components/form-components/grid-fields";
import { getHConditions } from "@/lib/services/health-conditions.";
import { iconSchema } from "../../articles/add-edit-articles/form-schema";
import { toast } from "@/hooks/use-toast";
import {
  PostCollection,
  UpdateCollection,
} from "@/lib/services/collection-services";
import nProgress from "nprogress";

const formSchema = z
  .object({
    collection_name: z
      .string()
      .nonempty({ message: "Section Name is Required" }),
    associated_conditions: z.array(z.number()).min(1),
    section: z.number().optional(),
    sub_section: z.number().optional(),
    collection_description: z.string().nullable().optional(),
    view_type: z.enum(["grid", "horizontal", "vertical"]),
    bg_color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" }),
    title_color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: "Invalid hex color" })
      .nullable()
      .optional(),
    collection_icon: iconSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.section && !data.sub_section) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Section or Sub-section is required",
        path: ["section"], // Show error on section
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Section or Sub-section is required",
        path: ["sub_section"], // Show error on sub_section
      });
    }
  });

const AddOrEditCollection = ({
  open,
  setOpen,
  handleSubmit,
  editCollection,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit?: (collectionID: number) => void;
  editCollection?: number | null;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collection_name: "",
      associated_conditions: [],
      collection_icon: null,
      collection_description: "",
      view_type: "horizontal",
    },
  });
  const [editCollectionData, setEditCollectionData] = useState<Collection>();
  const { collections } = useContext(CollectionContext);

  useEffect(() => {
    if (editCollection) {
      const _editCollection = collections.find(
        (collection) => collection.id == editCollection
      );
      setEditCollectionData(_editCollection);
      if (_editCollection) {
        form.setValue("bg_color", _editCollection.bg_color ?? "", {
          shouldValidate: true,
        });

        form.setValue(
          "associated_conditions",
          _editCollection.associated_conditions
            .map((i) => i.id)
            .filter((i) => i != null),
          {
            shouldValidate: true,
          }
        );

        form.setValue("view_type", _editCollection.view_type ?? "horizontal", {
          shouldValidate: true,
        });

        form.setValue(
          "collection_name",
          _editCollection.collection_name ?? "",
          {
            shouldValidate: true,
          }
        );
        form.setValue(
          "collection_description",
          _editCollection.collection_description ?? "",
          {
            shouldValidate: true,
          }
        );
        form.setValue("collection_icon", _editCollection.collection_icon, {
          shouldValidate: true,
        });

        form.setValue("bg_color", _editCollection.bg_color ?? "", {
          shouldValidate: true,
        });

        form.setValue("title_color", _editCollection.title_color ?? "", {
          shouldValidate: true,
        });

        form.clearErrors();
      }
    } else {
      setEditCollectionData(undefined);
      form.reset();
      form.setValue("view_type", "horizontal", {
        shouldValidate: true,
      });
    }
  }, [editCollection, open, collections, form]);
  
  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editCollection ? "Edit Collection" : "Add a new Collection"}
      showPreview={false}
    >
      <CollectionForm
        form={form}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        editCollection={editCollectionData}
      />
    </SideDrawer>
  );
};

export default AddOrEditCollection;

const CollectionForm = ({
  form,
  handleSubmit,
  setOpen,
  editCollection,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (collectionId: number) => void;
  setOpen: (open: boolean) => void;
  editCollection?: Collection;
}) => {
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<"Section" | "Sub-section">();

  useEffect(() => {
    if (editCollection) {
      if (editCollection?.sub_section) {
        setActiveType("Sub-section");
      } else {
        setActiveType("Section");
      }
      setTimeout(() => {
        form.setValue("section", editCollection.section?.id ?? undefined, {
          shouldValidate: true,
        });

        form.setValue(
          "sub_section",
          editCollection.sub_section?.id ?? undefined,
          {
            shouldValidate: true,
          }
        );
      }, 10);
    } else {
      form.reset();
      setActiveType("Section");
    }
  }, [editCollection, form]);

  async function handleCollection(status: "published" | "draft") {
    setLoading(true);
    try {
      if (status == "draft") {
        setOpen(false);
        return toast({
          title: "Unable to Save",
          description: `Doesn't support yet`,
          draggable: true,
          className: "[&_.font-semibold]:text-[red]",
        });
      } else {
        if (status == "published" && !form.formState.isValid) {
          setLoading(false);
          return;
        }
        const formValues = form.getValues();
        const data: ApiBodyCollection = {
          id: editCollection ? editCollection.id : null,
          ...editCollection,
          ...formValues,
          associated_conditions: formValues.associated_conditions,
          section: activeType == "Section" ? formValues.section : null,
          sub_section: activeType == "Section" ? null : formValues.sub_section,
          collection_icon: formValues.collection_icon?.id ?? null,
          articles: editCollection?.articles
            ? editCollection?.articles.map((i) => i.id).filter((i) => i != null)
            : [], // Provide a default value
          videos: editCollection?.videos
            ? editCollection?.videos.map((i) => i.id).filter((i) => i != null)
            : [], // Provide a default value
        };
        let response;
        if (editCollection) {
          response = await UpdateCollection(data);
        } else {
          response = await PostCollection(data);
        }
        onSuccess();
        if (handleSubmit && response.id) {
          handleSubmit(response.id);
        }
      }
    } catch (error) {
      console.error("Error", error);
      setLoading(false);
      toast({
        title: `Error`,
        description:
          typeof error === "object" && error !== null && "message" in error
            ? (error.message as string)
            : JSON.stringify(error),
      });
    }
  }

  const onSuccess = () => {
    setLoading(false);
    nProgress.done();
    form.reset();
    setOpen(false);
    toast({
      title: `Success`,
      description: (
        <p>
          <span className="capitalize">{"Collection"}</span>
          {editCollection ? " updated" : " created"} successfully
        </p>
      ),
    });
  };

  return (
    <div className="h-full  py-3 p-6 font-inter overflow-hidden">
      <Form {...form}>
        <div className="h-full flex flex-col border border-border rounded-[12px] gap-6 p-6 overflow-hidden">
          <div className="grow flex flex-col gap-4 overflow-auto no-scrollbar px-[2px] pb-5 ">
            <FormFieldWrapper
              control={form.control}
              name="collection_name"
              label="Name"
              required
              tooltip="Enter Name"
              className="min-h-0"
              placeholder="Write Collection Name here"
              component={Input}
            />
            <HealthConditionSelectField form={form} />
            <FormFieldWrapper
              control={form.control}
              name="collection_description"
              label="Description"
              tooltip="Enter Description"
              className="min-h-[126px]"
              placeholder="Write Description here"
              component={Textarea}
            />
            <ViewTypSelection formControl={form.control} />
            <FileDropZone
              control={form.control}
              fieldValue={form.getValues("collection_icon")}
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

            <Tabs
              value={activeType}
              onValueChange={(value: string) => {
                setActiveType(value as "Section" | "Sub-section");
                form.resetField("section");
                form.resetField("sub_section");
              }}
            >
              <TabsList className="w-full gap-2 items-center [&_svg]:size-6 justify-between">
                <TabsTrigger
                  className="!text-foreground px-[29px] w-1/2 dark:data-[state=active]:bg-background"
                  value="Section"
                >
                  Section
                </TabsTrigger>
                <TabsTrigger
                  className="!text-foreground px-[29px] w-1/2 dark:data-[state=active]:bg-background"
                  value="Sub-section"
                >
                  Sub-Section
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {activeType == "Section" ? (
              <SectionSelectField
                form={form}
                formControl={form.control}
                required
              />
            ) : (
              <SubSectionSelectField
                form={form}
                formControl={form.control}
                showAll={true}
                required
              />
            )}
          </div>
          <div className="flex gap-2">
            <SpinnerButton
              loading={loading}
              type="button"
              className="px-6 w-fit"
              disabled={
                !form.formState.isValid ||
                (editCollection
                  ? JSON.stringify({
                      description: editCollection.collection_description,
                      bg_color: editCollection.bg_color ?? "",
                      title_color: editCollection.title_color ?? "",
                      associated_conditions:
                        editCollection.associated_conditions.map((i) => i.id),
                      section: editCollection.section?.id,
                      sub_section: editCollection.sub_section?.id,
                    }) ==
                    JSON.stringify({
                      description: form.watch("collection_description"),
                      bg_color: form.watch("bg_color"),
                      title_color: form.watch("title_color"),
                      associated_conditions: form.watch(
                        "associated_conditions"
                      ),
                      section: form.watch("section"),
                      sub_section: form.watch("sub_section"),
                    })
                    ? true
                    : false
                  : false)
              }
              onClick={() => {
                handleCollection("published");
              }}
            >
              Save
            </SpinnerButton>
            {/* {!editCollection && (
              <Button
                type="button"
                className="px-6 w-fit bg-muted text-primary hover:shadow-none dark:text-white"
                onClick={() => handleCollection("draft")}
              >
                Save as Draft
              </Button>
            )} */}
          </div>
        </div>
      </Form>
    </div>
  );
};

export const HealthConditionSelectField = <T extends z.ZodType>({
  form,
}: {
  form: UseFormReturn<z.infer<T>>;
}) => {
  const { HConditions, updateHConditions } = useContext(HConditionContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (HConditions.length == 0) {
      getHConditions().then((res) => {
        updateHConditions(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [updateHConditions, HConditions.length]);

  return (
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
          required
          showLoader={loading}
          options={HConditions}
        />
      </div>
      <AddHealthHacksConditionModel
        afterSubmission={(newHealthCondition) => {
          form.setValue(
            "associated_conditions" as Path<z.infer<T>>,
            [
              ...(form.getValues("associated_conditions" as Path<z.infer<T>>) ??
                []),
              newHealthCondition.id as number,
            ] as PathValue<z.infer<T>, Path<z.infer<T>>>
          );
        }}
      >
        <AddButton type="button" className="bg-muted mt-7" />
      </AddHealthHacksConditionModel>
    </div>
  );
};
