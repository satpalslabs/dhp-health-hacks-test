"use client";

import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { JourneyData } from "@/lib/journey-services";
import type { JourneySection, JourneyUnit } from "@/lib/journey-services";
import {
  ChevronDown,
  GripVertical,
  Inbox,
  PencilLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/components/providers/data-provider";
import DropdownActions from "../dropdown-actions";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import JourneyUnitSteps from "./reorder-journey-steps";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import AddOrEditUnitDialog from "../add-edit-unit";
import { handleUnit } from "../journey-unit";
import DeleteDialog from "../../delete-dialog";
const JourneySection = ({
  journeyData,
  sectionData,
}: {
  journeyData: JourneyData;
  sectionData: JourneySection;
}) => {
  const [activeSection, setActiveSection] = useState(sectionData);
  const { data, setData } = useContext(DataContext) ?? {};
  const [deleteUnitDialog, setDeleteUnitDialog] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    // If there's no valid drop destination, exit early
    if (!destination) return;
    // Create a new copy of sections to avoid mutating state directly
    const newUnits = [...sectionData.units];
    // Handling drag-and-drop for sections
    if (type === "unit") {
      // Remove the dragged section from its original position
      const [movedSection] = newUnits.splice(source.index, 1);
      // Insert the section at the new position
      newUnits.splice(destination.index, 0, movedSection);
    }
    // Handling drag-and-drop for units within sections
    else if (type === "step") {
      // Get the index of the source and destination sections
      const sourceSectionIndex = parseInt(source.droppableId, 10);
      const destSectionIndex = parseInt(destination.droppableId, 10);
      // Create copies of the unit arrays to prevent direct state mutation
      const sourceSteps = [...newUnits[sourceSectionIndex].steps];
      // Remove the dragged unit from its original section
      const [movedStep] = sourceSteps.splice(source.index, 1);
      // If the unit is moved **within the same section**
      if (sourceSectionIndex === destSectionIndex) {
        // Insert the unit at the new index in the same section
        sourceSteps.splice(destination.index, 0, movedStep);
        newUnits[sourceSectionIndex].steps = sourceSteps;
      }
      // If the unit is moved **to a different section**
      else {
        // Get the destination section's units
        const destSteps = [...newUnits[destSectionIndex].steps];
        // Insert the moved unit into the destination section
        destSteps.splice(destination.index, 0, movedStep);
        // Update both the source and destination sections
        newUnits[sourceSectionIndex].steps = sourceSteps;
        newUnits[destSectionIndex].steps = destSteps;
      }
    }
    // Update state with the modified sections
    if (setData) {
      setData((prev: JourneyData[]) => {
        const journeyIndex = prev.findIndex(
          (item: JourneyData) => item.id === journeyData.id
        );
        const newSections = prev[journeyIndex].sections;
        const sectionIndex = newSections.findIndex(
          (item: JourneySection) => item.id === sectionData.id
        );
        newSections[sectionIndex].units = newUnits;
        prev[journeyIndex] = { ...journeyData, sections: newSections };
        return [...prev];
      });
    }
  };

  useEffect(() => {
    const activeJourneyIndex: number = data.findIndex(
      (i: JourneyData) => i.id === journeyData.id
    );
    const activeSectionIndex = data[activeJourneyIndex].sections.findIndex(
      (i: JourneySection) => i.id === activeSection.id
    );
    if (activeJourneyIndex != -1) {
      setActiveSection({
        ...data[activeJourneyIndex].sections[activeSectionIndex],
      });
    }
  }, [data, activeSection.id, journeyData.id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="justify-between flex items-center">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
          <Input
            placeholder="Search"
            className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={() => {
            setOpenAddDialog(true);
          }}
        >
          <>
            <Plus className="fill-white" /> Add Unit
          </>
        </Button>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              isDropDisabled={false}
              direction="vertical"
              isCombineEnabled={true}
              ignoreContainerClipping={false}
              droppableId="journey_unit"
              type="unit"
            >
              {(provided) => (
                <div
                  className="flex gap-2 flex-col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {activeSection.units.length > 0 ? (
                    activeSection.units.map(
                      (unit: JourneyUnit, unitIndex: number) => (
                        <Draggable
                          key={unit.id}
                          draggableId={unit.id.toString() + "_unit"}
                          index={unitIndex}
                        >
                          {(provided) => (
                            <>
                              <Collapsible
                                className="group/collapsible-1 border border-border rounded-lg p-3"
                                // defaultOpen={sectionIndex === 0 && addOrEditSection != section.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div className="flex gap-2 items-center h-[40px]">
                                  <div
                                    className="p-0 hover:bg-transparent h-fit w-fit"
                                    {...provided.dragHandleProps}
                                  >
                                    <GripVertical className="stroke-gray-400 w-4 h-4" />
                                  </div>
                                  <div className="grow flex justify-between items-center">
                                    <Button
                                      variant="ghost"
                                      className="p-0 h-fit hover:bg-transparent font-normal font-inter flex items-center justify-between"
                                    >
                                      <div>{unit.title}</div>
                                    </Button>
                                    <div className="flex items-center ">
                                      <div className="flex items-center gap-2 text-sm">
                                        <div className="flex gap-1 items-center [&_svg]:size-5 px-3">
                                          <Heart className="mt-[1px]" />
                                          <div className="w-[72px]">
                                            {unit["heart-points"]}
                                          </div>
                                        </div>
                                        <div className="flex gap-1 items-center [&_svg]:size-5 px-3">
                                          <Diamond />
                                          <div className="w-[72px]">
                                            {unit.gems}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CollapsibleTrigger
                                          className="cursor-pointer text-left"
                                          asChild
                                        >
                                          <ChevronDown className="stroke-gray-400 w-4 transition-transform h-4 group-data-[state=open]/collapsible-1:rotate-180" />
                                        </CollapsibleTrigger>
                                        <DropdownActions>
                                          <>
                                            <Button
                                              variant="ghost"
                                              className="flex bg-transparent gap-2 justify-center  w-full"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRow(unitIndex);
                                                setOpenAddDialog(true);
                                              }}
                                            >
                                              <PencilLine />
                                              <div className="text-sm grow text-left font-normal">
                                                Edit
                                              </div>
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              className="flex bg-transparent gap-2 justify-center  w-full"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteUnitDialog(true);
                                              }}
                                            >
                                              <Trash2 />
                                              <div className="text-sm grow text-left font-normal ">
                                                Delete
                                              </div>
                                            </Button>
                                            <DeleteDialog
                                              open={deleteUnitDialog}
                                              setOpen={setDeleteUnitDialog}
                                              handleDelete={() => {
                                                const result = handleUnit(
                                                  "delete",
                                                  journeyData.id,
                                                  activeSection,
                                                  unitIndex,
                                                  data
                                                );
                                                if (setData) {
                                                  setData([...result]);
                                                }
                                                setDeleteUnitDialog(false);
                                              }}
                                              resourceName="Unit"
                                            />
                                          </>
                                        </DropdownActions>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <JourneyUnitSteps
                                  // journey={journeyData.id}
                                  unit={unit}
                                  unitIndex={unitIndex}
                                />
                              </Collapsible>
                            </>
                          )}
                        </Draggable>
                      )
                    )
                  ) : (
                    <div className="flex flex-col gap-2 pb-[18px] text-center items-center text-gray-400">
                      <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
                      <div className="font-inter text-sm">
                        {"You haven't added any Units yet."}
                        <br />
                        {"Tap 'Add unit' to create a new unit."}
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <AddOrEditUnitDialog
        selectedRowIx={selectedRow}
        open={openAddDialog}
        setOpen={(e: boolean) => {
          setOpenAddDialog(e);
          setSelectedRow(null);
        }}
        section={activeSection}
        handleSubmit={(values) => {
          let result = data;
          result = handleUnit(
            selectedRow != null ? "edit" : "add",
            journeyData.id,
            sectionData,
            selectedRow,
            data,
            values
          );
          if (setData) {
            setData(() => [...result]);
            setOpenAddDialog(false);
            setSelectedRow(null);
          }
        }}
      />
    </div>
  );
};

export default JourneySection;
