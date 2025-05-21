"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import SideDrawer from ".";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tip as TipType, Pack } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectField } from "../form-components";
import Tip from "@/components/ui/tip";
import { AddButton } from "@/components/ui/add-button";
import { TipsContext } from "@/context/tips-data-provider";
import { PacksContext } from "@/context/pack-data-provider";
import { HConditionContext } from "@/context/health-conditions-provider";
import AddOrEditTip from "@/components/cms/tips/manage-tip";
import { HealthConditionSelectField } from "@/components/cms/content-categories/collections/manage-collection";

const formSchema = z.object({
  associated_conditions: z.array(z.number()),
  tip_category: z.array(z.number()),
  search: z.array(z.number()).min(1, "Please select at least one tip."),
});

const SelectExistingTipForm = ({
  open,
  setOpen,
  previousTips,
  handleSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previousTips: number[];
  handleSubmit?: (e: TipType[]) => void;
}) => {
  const [openNewTipDialog, setOpenNewTipDialog] = useState(false);
  const { HConditions } = useContext(HConditionContext);
  const { packs } = useContext(PacksContext);
  const { tips } = useContext(TipsContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associated_conditions: [],
      tip_category: [],
      search: [],
    },
  });
  useEffect(() => {
    form.reset();
  }, [open]);

  const searchTips = form
    .watch("search")
    .map((tipId): previewTip | undefined => {
      const tip = tips.find((t) => t.id === tipId);
      return tip
        ? {
            ...tip,
            tipCategory: packs.find((pack) => {
              return typeof tip.tips_categories == "number"
                ? pack.id === tip?.tips_categories
                : pack.id === tip?.tips_categories?.[0];
            }),
          }
        : undefined;
    });
  return (
    <SideDrawer
      open={open}
      setOpen={setOpen}
      title={"Add Tips"}
      preview={
        <PreviewModeForTips tips={searchTips.filter((i) => i != undefined)} />
      }
    >
      <div className="h-full py-3 p-6">
        <Form {...form}>
          <div className="h-full flex flex-col border border-border rounded-[12px] p-6">
            <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-5">
              <HealthConditionSelectField form={form} />
              <SelectField
                control={form.control}
                name="tip_category"
                label="Tip Category"
                tooltip="Select Tip Category"
                dataKey="name"
                placeholder="Select Tip Category"
                selectType="multi-select"
                options={
                  form.watch("associated_conditions").length > 0
                    ? packs.filter((i) =>
                        form
                          .watch("associated_conditions")
                          .some((conditionId: number) =>
                            HConditions.find(
                              (condition) => condition.id === conditionId
                            )?.tips_categories.includes(i.id as number)
                          )
                      ) ?? []
                    : packs
                }
              />
              <div className="flex gap-4">
                <div className="grow">
                  <SelectField
                    control={form.control}
                    name="search" // Changed from "tips" to match schema
                    label="Search"
                    tooltip="Select Tips"
                    dataKey="title"
                    placeholder="Select Tips"
                    selectType="multi-select"
                    options={tips
                      .filter((tip: TipType) => {
                        const associatedConditions = form.watch(
                          "associated_conditions"
                        );
                        const _packs = form.watch("tip_category");
                        // If no filters are applied, return all tips
                        if (
                          associatedConditions.length === 0 &&
                          _packs.length === 0
                        ) {
                          return true;
                        }

                        // Filter by tip category if it exists
                        if (_packs.length > 0) {
                          return _packs.some((categoryId: number) =>
                            packs
                              .find((pack) => pack.id === categoryId)
                              ?.tips.includes(tip.id as number)
                          );
                        }

                        // Otherwise, filter by associated conditions
                        return associatedConditions.some(
                          (conditionId: number) =>
                            HConditions.find(
                              (condition) => condition.id === conditionId
                            )?.tips.includes(tip.id as number)
                        );
                      })
                      .filter((i) => !previousTips.includes(i.id as number))}
                    required
                  />
                </div>
                <AddButton
                  className="mt-7"
                  onClick={() => {
                    setOpenNewTipDialog(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex justify-between items-center font-inter">
              <Button
                type="button"
                className="px-[43px]"
                disabled={!form.formState.isValid}
                onClick={() => {
                  if (handleSubmit) {
                    handleSubmit(searchTips.filter((i) => i != undefined));
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <AddOrEditTip
        open={openNewTipDialog}
        setOpen={setOpenNewTipDialog}
        handleSubmit={(tip) => {
          if (tip.id) {
            form.setValue("search", [...form.watch("search"), tip.id], {
              shouldValidate: true,
            });
          }
        }}
      />
    </SideDrawer>
  );
};

export default SelectExistingTipForm;

export interface previewTip extends TipType {
  tipCategory?: Pack;
}

const PreviewModeForTips = ({ tips }: { tips: previewTip[] }) => {
  return (
    <div className="w-full flex flex-col items-center gap-[26px] h-fit -mb-16">
      {tips.map((tip, ix) => (
        <Tip tip={tip} key={ix} />
      ))}
    </div>
  );
};
