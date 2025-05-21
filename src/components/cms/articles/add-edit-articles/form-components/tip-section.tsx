import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../form-schema";
import { useContext, useEffect, useState } from "react";
import { Tip } from "@/types";
import { z } from "zod";
import { FormLabel } from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import InfoCircled from "@/info-circled.svg";
import SelectExistingTipForm from "../form-drawers/select-existing-tip-form";
import { AddButton } from "@/components/ui/add-button";
import { TipsContext } from "@/context/tips-data-provider";
import AddOrEditTip from "@/components/cms/tips/manage-tip";

export const TipsSection = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const [tipsData, setTipsData] = useState<Tip[]>([]);
  const [open, setOpen] = useState(false);
  const [openNewTipForm, setOpenNewTipForm] = useState(false);
  const [editTipData, setEditTipData] = useState<number | undefined>();
  const { tips } = useContext(TipsContext);
  const _tips = form.watch("tips") ?? []; // Use watch instead of getValues to avoid stale state

  useEffect(() => {
    if (!_tips || _tips.length === 0) return;

    setTipsData((prev: Tip[]) => {
      const existingIds = new Set(prev.map((tip) => tip.id)); // Use Set for fast lookup
      const newTips = _tips
        .filter((id) => !existingIds.has(id)) // Avoid duplicates
        .map((id) => tips.find((tip) => tip.id === id))
        .filter((tip): tip is Tip => tip !== undefined); // Type guard to remove undefined values

      return newTips.length ? [...prev, ...newTips] : prev; // Update only if new tips exist
    });
  }, [_tips, tips]); // Depend on `tips` to get updates when context changes

  return (
    <div className="flex flex-col gap-4  py-4">
      <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
        <div>Tips</div>
        <InputTooltip tooltip="Select or Add tip">
          <InfoCircled className="w-[13px] h-auto" />
        </InputTooltip>
      </FormLabel>
      {tipsData.length > 0 && (
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            if (!destination) return;
            const newTips = [...tipsData];
            const [movedTip] = newTips.splice(source.index, 1);
            newTips.splice(destination.index, 0, movedTip);
            setTipsData(newTips);
            const tipIds: number[] = newTips
              .map((i) => i.id)
              .filter((i) => typeof i == "number");
            form.setValue("tips", tipIds, { shouldValidate: true });
          }}
        >
          <Droppable
            isDropDisabled={false}
            direction="vertical"
            droppableId="tips"
            isCombineEnabled={true}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                className="p-2 border-border border rounded-lg"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ height: tipsData.length * 64 + 12 + "px" }}
              >
                {tipsData.map((tip, ix) => (
                  <Draggable
                    key={tip.id}
                    draggableId={tip.id?.toString() + "_tip"}
                    index={ix}
                  >
                    {(_provided) => (
                      <div
                        className="h-16 border-b px-5 bg-background flex items-center justify-between last:border-none border-border"
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                      >
                        <div className="font-inter text-sm">{tip.title}</div>
                        <div className="flex gap-[20px] [&_svg]:size-4 text-button-filter-text">
                          <button
                            type="button"
                            onClick={() => {
                              if (tip.id) {
                                setEditTipData(tip.id);
                                setOpenNewTipForm(true);
                              }
                            }}
                          >
                            <Pencil />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTipsData((prev) => {
                                prev.splice(ix, 1);
                                const tipIds: number[] = prev
                                  .map((i) => i.id)
                                  .filter((i) => typeof i == "number");
                                form.setValue("tips", tipIds, {
                                  shouldValidate: true,
                                });
                                return [...prev];
                              });
                            }}
                          >
                            <Trash2 />
                          </button>
                          <div {..._provided.dragHandleProps}>
                            <GripVertical />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="flex justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AddButton className="w-full" text="Add Tip" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-inter mr-10" side="bottom">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Select from Tips Library
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setEditTipData(undefined);
                setOpenNewTipForm(true);
              }}
            >
              Add new Tip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SelectExistingTipForm
        open={open}
        previousTips={[...(_tips as Array<number>)]}
        setOpen={setOpen}
        handleSubmit={(tips) => {
          const tipIds: number[] = tips
            .map((i) => i.id)
            .filter((i) => typeof i == "number");
          form.setValue("tips", tipIds, { shouldValidate: true });
          setTipsData((prev: Tip[]) => {
            const newQuizzes = tips.filter(
              (tip) => !prev.some((item) => item.id === tip.id)
            );
            return [...prev, ...newQuizzes];
          });
          setOpen(false);
        }}
      />
      <AddOrEditTip
        open={openNewTipForm}
        setOpen={setOpenNewTipForm}
        handleSubmit={(tip) => {
          if (!tip.id) return;
          setTipsData((prev) => {
            const index = prev.findIndex((i) => i.id === tip.id);

            if (index !== -1) {
              return prev.map((item, idx) => (idx === index ? tip : item));
            }

            return [...prev, tip];
          });
        }}
        editTip={editTipData}
      />
    </div>
  );
};
