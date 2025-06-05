import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputTooltip from "@/components/ui/input-info-tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Inbox, Layers } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { formSchema } from "@/components/cms/articles/add-edit-articles/form-schema";
import { z } from "zod";
import InfoCircled from "@/info-circled.svg";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { DraggableWrapper } from "./draggable-wrapper";
import { AddButton } from "@/components/ui/add-button";

export const ArticleCards = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  return (
    <FormField
      control={form.control}
      name="cards"
      render={({ field }) => (
        <FormItem className="pt-4 border-t border-border">
          <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
            <div>Cards</div>
            <InputTooltip tooltip="Select Content Type">
              <InfoCircled className="w-[13px] h-auto" />
            </InputTooltip>
          </FormLabel>
          {field.value?.length > 0 ? (
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
                    {fields.map((card, index) => (
                      <DraggableWrapper
                        key={card.id}
                        field={card}
                        index={index}
                        remove={remove}
                        header={
                          <div className="flex gap-2 items-center text-foreground font-inter font-medium font-sm">
                            <Layers />
                            <div>
                              Card: {form.getValues(`cards.${index}.title`)}
                            </div>
                          </div>
                        }
                      >
                        <div
                          key={card.id}
                          className="px-4 py-3 border border-border rounded-lg flex flex-col gap-3 relative"
                        >
                          <FormFieldWrapper
                            control={form.control}
                            name={`cards.${index}.title`}
                            label="Title"
                            required
                            tooltip="Enter Title"
                            placeholder="Write title here"
                            component={Input}
                          />
                          <FormFieldWrapper
                            control={form.control}
                            name={`cards.${index}.description`}
                            label="Description"
                            className="min-h-[126px]"
                            tooltip="Enter Description"
                            placeholder="Write description here"
                            component={Textarea}
                          />
                        </div>
                      </DraggableWrapper>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="flex flex-col gap-2 mt-4 pb-[18px] font-inter text-center items-center text-gray-400">
              <Inbox className="w-[83px] h-[74px] stroke-[0.8px]" />
              <div className="font-inter text-sm">
                {"You haven't added any card yet."}
                <br />
                {"Tap 'Add Card' to create a new card."}
              </div>
            </div>
          )}
          <AddButton
            text="Add Card"
            type="button"
            className="w-full hover:shadow-sm"
            onClick={() => {
              append({
                title: "",
                description: "",
              });
            }}
          />
        </FormItem>
      )}
    />
  );
};
