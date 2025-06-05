import { UseFieldArrayRemove } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { WebpageComponent } from "@/types";

export const DraggableWrapper = ({
  field,
  index,
  children,
  remove,
  showCollapsible = true,
  header,
  className,
}: {
  field: {
    id: string;
    __component?: WebpageComponent["__component"];
  };
  index: number;
  children: React.ReactNode;
  remove: UseFieldArrayRemove;
  showCollapsible?: boolean;
  header: React.ReactNode;
  className?: string;
}) => (
  <Draggable
    key={field.id}
    draggableId={field.id + "_content_field"}
    index={index}
  >
    {(provided) => (
      <Collapsible
        className={cn(
          ` bg-background border-b-0 border border-border border-t-0 data-[state='open']:border-b rounded-md group `,
          className
        )}
        defaultOpen={field?.__component != "webpage.divider"}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <section className="w-full h-[60px] flex justify-between items-center border border-x-0 border-border rounded-md p-[14px] [&_svg]:size-4">
          <div className="flex gap-2 items-center grow">
            <div className="text-gray-400 " {...provided.dragHandleProps}>
              <GripVertical />
            </div>
            {header}
          </div>
          <div className="flex gap-2 top-0 w-fit h-full items-center text-gray-400">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
            >
              <Trash2 />
            </button>
            {showCollapsible && (
              <CollapsibleTrigger>
                <div className="group-data-[state='open']:rotate-180 transition-transform">
                  <ChevronDown />
                </div>
              </CollapsibleTrigger>
            )}
          </div>
        </section>
        <CollapsibleContent className="p-3">{children}</CollapsibleContent>
      </Collapsible>
    )}
  </Draggable>
);

export const DraggableWrapperQuiz = ({
  field,
  index,
  children,
  remove,
  setContentContainerHeight,
  className,
}: {
  field: {
    id: string;
  };
  index: number;
  children: React.ReactNode;
  remove: UseFieldArrayRemove;
  setContentContainerHeight?: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}) => (
  <Draggable
    key={field.id}
    draggableId={field.id + "_content_field"}
    index={index}
  >
    {(provided) => (
      <div
        className="relative bg-background"
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        {children}
        <div
          className={cn(
            `absolute right-1 flex gap-3 top-0 w-fit h-fit [&_svg]:size-4  text-gray-400 ${className}`
          )}
        >
          <button
            type="button"
            onClick={() => {
              remove(index);
              if (setContentContainerHeight) {
                setContentContainerHeight(0);
              }
            }}
          >
            <Trash2 />
          </button>
          <div {...provided.dragHandleProps}>
            <GripVertical />
          </div>
        </div>
      </div>
    )}
  </Draggable>
);
