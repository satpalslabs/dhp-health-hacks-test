import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tip as TipType } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Tip from "@/components/ui/tip";
import { AddButton } from "@/components/ui/add-button";
import { HConditionContext } from "@/context/health-conditions-provider";
import { PacksContext } from "@/context/pack-data-provider";
import { TipsContext } from "@/context/tips-data-provider";
import { ArticleContext } from "@/context/article-data-provider";
import SideDrawer from "../articles/add-edit-articles/form-drawers";
import { SelectField } from "../articles/add-edit-articles/form-components";
import AddHealthHacksConditionModel from "../articles/add-edit-articles/form-components/add-health-hacks-condition";
import AddOrEditPack from "../content-categories/packs/manage-pack";

const formSchema = z.object({
  associated_conditions: z.array(z.number()).optional(),
  tips_categories: z.array(z.number()),
  videos: z.array(z.number()).optional(),
  title: z.string().nonempty({ message: "Title is Required" }),
  description: z.string().optional(),
});

const AddOrEditTip = ({
  open,
  setOpen,
  handleSubmit,
  editTip,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: (tip: TipType) => void;
  editTip?: number | null;
}) => {
  const { packs } = useContext(PacksContext);
  const [editTipData, setEditTipData] = useState<TipType>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editTipData
      ? { ...editTipData, description: editTipData.description ?? undefined }
      : {
          associated_conditions: [],
          title: "",
          tips_categories: [],
        },
  });
  const { tips } = useContext(TipsContext);

  useEffect(() => {
    if (editTip) {
      const _editTip = tips.find((tip) => tip.id == editTip);
      setEditTipData(_editTip);
      if (_editTip) {
        form.setValue("associated_conditions", _editTip.associated_conditions, {
          shouldValidate: true,
        });
        form.setValue("description", _editTip.description ?? "", {
          shouldValidate: true,
        });
        form.setValue("title", _editTip.title, { shouldValidate: true });
        form.setValue("tips_categories", _editTip.tips_categories, {
          shouldValidate: true,
        });
        form.setValue("videos", _editTip.videos, { shouldValidate: true });
      }
    } else {
      form.reset();
      setEditTipData(undefined);
    }
  }, [editTip, open]);

  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={editTip ? "Edit Tip" : "Add a new Tip"}
      preview={
        <div className="w-full flex justify-center">
          <Tip
            tip={{
              id: null,
              title: form.watch("title"),
              tipCategory: packs.find(
                (i) => i.id == form.watch("tips_categories")[0]
              ),
              tips_categories: form.watch("tips_categories"),
              description: form.watch("description"),
              associated_conditions: form.watch("associated_conditions"),
            }}
          />
        </div>
      }
    >
      <TipsForm
        form={form}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        editTip={editTipData}
      />
    </SideDrawer>
  );
};

export default AddOrEditTip;

const TipsForm = ({
  form,
  handleSubmit,
  setOpen,
  editTip,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleSubmit?: (tip: TipType) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTip?: TipType;
}) => {
  // const tipsContext = useContext(ArticleContext);
  const [openDialog_TipCategory, setOpenDialog_TipCategory] = useState(false);
  const { HConditions } = useContext(HConditionContext);
  const { articles } = useContext(ArticleContext);
  const { packs, updatePacks } = useContext(PacksContext);
  const { tips, updateTips } = useContext(TipsContext);
  const handleTip = () => {
    const maxId = Math.max(...(tips.map((i) => i.id ?? 0) ?? [])) + 1;
    const _currentDate = new Date().toISOString();
    const tipData: TipType = {
      id: editTip ? editTip.id : maxId,
      createdAt: _currentDate,
      ...(editTip ? editTip : {}),
      updatedAt: _currentDate,
      ...form.getValues(),
    };
    if (!editTip) {
      (tipData.tips_categories ?? []).map((tips_category) => {
        const _updatedTipCategories = packs;
        const prevTips_categoryIx = _updatedTipCategories.findIndex(
          (item) => item.id == tips_category
        );
        _updatedTipCategories.splice(prevTips_categoryIx, 1, {
          ..._updatedTipCategories[prevTips_categoryIx],
          tips: [
            ..._updatedTipCategories[prevTips_categoryIx].tips,
            tipData.id ?? 0, // Default to 0 if undefined
          ],
        });
        updatePacks([..._updatedTipCategories]);
      });
      updateTips([...tips, tipData]);
    } else {
      const _updatedTips = tips;
      const prevTipIndex = _updatedTips.findIndex(
        (item) => item.id == editTip.id
      );
      _updatedTips.splice(prevTipIndex, 1, tipData);
      updateTips([..._updatedTips]);
    }

    if (handleSubmit) {
      handleSubmit(tipData);
    }
    form.reset();
  };
  return (
    <div className="h-full py-3 p-6">
      <Form {...form}>
        <div className="h-full flex flex-col border border-border rounded-[12px] p-6">
          <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-5">
            <div className="flex gap-[6px]">
              <div className="grow">
                <SelectField
                  control={form.control}
                  name="associated_conditions"
                  label="Health Condition"
                  tooltip="Select Health Condition"
                  placeholder="Select Health Condition"
                  selectType="multi-select"
                  dataKey="title"
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
            <div className="flex gap-[6px]">
              <div className="grow">
                <SelectField
                  control={form.control}
                  name="tips_categories"
                  label="Tip Category"
                  tooltip="Select Tip Category"
                  placeholder="Select Tip Category"
                  selectType="multi-select"
                  dataKey="name"
                  options={
                    (form.watch("associated_conditions") ?? []).length > 0
                      ? packs?.filter((i) =>
                          (form.watch("associated_conditions") ?? []).some(
                            (conditionId: number) =>
                              HConditions.find(
                                (condition) => condition.id === conditionId
                              )?.tips_categories.includes(i.id as number)
                          )
                        ) ?? []
                      : packs ?? []
                  }
                />
              </div>
              <AddButton
                className="mt-7"
                onClick={() => {
                  setOpenDialog_TipCategory(true);
                }}
              />
              <AddOrEditPack
                open={openDialog_TipCategory}
                setOpen={setOpenDialog_TipCategory}
                handleSubmit={(tipCategory) => {
                  form.setValue("tips_categories", [
                    ...(form.getValues("tips_categories") ?? []),
                    tipCategory.id as number,
                  ]);
                }}
              />
            </div>

            <SelectField
              control={form.control}
              name="videos"
              label="Videos"
              dataKey="title"
              tooltip="Select Associated Videos"
              placeholder="Select Associated Videos"
              selectType="multi-select"
              options={articles.filter(
                (i) => i.content_type?.type == "content-video"
              )}
            />

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
              placeholder="Write Description here"
              component={Textarea}
            />
          </div>
          <div className="w-full flex gap-3 items-center font-inter">
            <Button
              type="button"
              className="px-6"
              disabled={!form.formState.isValid}
              onClick={() => {
                handleTip();
                setOpen(false);
              }}
            >
              Save
            </Button>
            {!editTip && (
              <Button
                type="button"
                className="px-6"
                disabled={!form.formState.isValid}
                onClick={() => {
                  handleTip();
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
