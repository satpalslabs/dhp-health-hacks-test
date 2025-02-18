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
import type {
  JourneySection,
  JourneyStep,
  JourneyUnit,
} from "@/lib/journey-services";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Inbox,
  PencilLine,
  Search,
  Trash2,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "@/components/providers/data-provider";
import DropdownActions from "../dropdown-actions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import AddOrEditUnitDialog from "../add-edit-unit";
import { handleUnit } from "../journey-unit";
import DeleteDialog from "../../delete-dialog";
import { useRouter } from "next/navigation";
import { AddStepButtonAndDropDown, getIcon, Step } from "./usable-components";
import Link from "next/link";

const JourneyUnitComponent = ({
  journeyData,
  sectionData,
  unitData: initialUnit,
}: {
  journeyData: JourneyData;
  sectionData: JourneySection;
  unitData: JourneyUnit;
}) => {
  const [activeSection, setActiveSection] = useState(sectionData);
  const [unitData, setUnitData] = useState(initialUnit);
  const { data, setData } = useContext(DataContext) ?? {};
  const [deleteUnitDialog, setDeleteUnitDialog] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const router = useRouter();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    // If there's no valid drop destination, exit early
    if (!destination) return;
    // Create a new copy of unit steps to avoid mutating state directly
    const newUnitSteps = unitData;
    // Handling drag-and-drop for unit steps
    if (type === "step") {
      // Get the index of the source and destination unit steps
      const sourceSectionIndex = parseInt(source.droppableId, 10);
      const destSectionIndex = parseInt(destination.droppableId, 10);
      // Create copies of the unit steps arrays to prevent direct state mutation
      const sourceSteps = [...newUnitSteps.steps];
      // Remove the dragged unit from its original unit step
      const [movedStep] = sourceSteps.splice(source.index, 1);
      // If the unit is moved **within the same unit**
      if (sourceSectionIndex === destSectionIndex) {
        // Insert the unit step at the new index in the same unit
        sourceSteps.splice(destination.index, 0, movedStep);
        newUnitSteps.steps = sourceSteps;
      }
    }
    // Update state with the modified unit steps
    if (setData) {
      setData((prev: JourneyData[]) => {
        const journeyIndex = prev.findIndex(
          (item: JourneyData) => item.id === journeyData.id
        );
        const newSections = prev[journeyIndex].sections;
        const sectionIndex = newSections.findIndex(
          (item: JourneySection) => item.id === sectionData.id
        );
        const unitIndex = newSections[sectionIndex].units.findIndex(
          (item: JourneyUnit) => item.id === unitData.id
        );
        newSections[sectionIndex].units[unitIndex] = newUnitSteps;
        prev[journeyIndex] = { ...journeyData, sections: [...newSections] };
        return [...prev];
      });
    }
  };

  const activeUnitIndex = sectionData.units.findIndex(
    (i: JourneyUnit) => i.id === initialUnit.id
  );
  const activeSectionIndex = journeyData.sections.findIndex(
    (i: JourneySection) => i.id === activeSection.id
  );

  useEffect(() => {
    const activeJourneyIndex: number = data.findIndex(
      (i: JourneyData) => i.id === journeyData.id
    );
    const activeSectionIndex = data[activeJourneyIndex].sections.findIndex(
      (i: JourneySection) => i.id === activeSection.id
    );
    const activeUnitIndex = data[activeJourneyIndex].sections[
      activeSectionIndex
    ].units.findIndex((i: JourneyUnit) => i.id === initialUnit.id);
    if (activeJourneyIndex != -1 && activeUnitIndex != -1) {
      setActiveSection({
        ...data[activeJourneyIndex].sections[activeSectionIndex],
      });
      setUnitData({
        ...data[activeJourneyIndex].sections[activeSectionIndex].units[
          activeUnitIndex
        ],
      });
    } else {
      router.push(`/journey/${journeyData.id}/${sectionData.id}`);
    }
  }, [
    data,
    activeSection.id,
    journeyData.id,
    initialUnit.id,
    sectionData.id,
    router,
  ]);

  return (
    <div className="flex flex-col gap-4 grow overflow-hidden">
      <div className="flex flex-col gap-4 grow overflow-auto p-6 pb-5">
        <div className="justify-between flex relative items-center">
          <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
          <Input
            placeholder="Search"
            className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex flex-col gap-2 grow">
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
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Draggable
                    draggableId={unitData.id.toString() + "_journey_step"}
                    index={0}
                  >
                    {(drag_unit) => (
                      <Collapsible
                        className="group/collapsible-1 border border-border rounded-lg p-3"
                        defaultOpen={true}
                        ref={drag_unit.innerRef}
                        {...drag_unit.draggableProps}
                      >
                        <div className="flex gap-2 items-center h-[40px]">
                          <div
                            className="p-0 hover:bg-transparent h-fit w-fit"
                            {...drag_unit.dragHandleProps}
                          >
                            <GripVertical className="stroke-gray-400 w-4 h-4" />
                          </div>
                          <div className="grow flex justify-between items-center">
                            <Button
                              variant="ghost"
                              className="p-0 h-fit hover:bg-transparent font-normal font-inter flex items-center justify-between"
                            >
                              <div>{unitData.title}</div>
                            </Button>
                            <div className="flex items-center ">
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex gap-1 items-center [&_svg]:size-5 px-3">
                                  <Heart className="mt-[1px]" />
                                  <div className="w-[72px]">
                                    {unitData["heart-points"]}
                                  </div>
                                </div>
                                <div className="flex gap-1 items-center [&_svg]:size-5 px-3">
                                  <Diamond />
                                  <div className="w-[72px]">
                                    {unitData.gems}
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
                                  <Button
                                    variant="ghost"
                                    className="flex bg-transparent gap-2 justify-center  w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRow(
                                        sectionData.units.findIndex(
                                          (unit) => unit.id == unitData.id
                                        )
                                      );
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
                                        sectionData.units.findIndex(
                                          (unit) => unit.id == unitData.id
                                        ),
                                        data
                                      );
                                      if (setData) {
                                        setData([...result]);
                                      }
                                      setDeleteUnitDialog(false);
                                    }}
                                    resourceName="Unit"
                                  />
                                </DropdownActions>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Droppable
                          isDropDisabled={false}
                          direction="vertical"
                          isCombineEnabled={true}
                          ignoreContainerClipping={false}
                          droppableId={unitData.id.toString() + "journey_steps"}
                          type="step"
                        >
                          {(steps_provided) => (
                            <CollapsibleContent
                              className="flex flex-col gap-2"
                              ref={steps_provided.innerRef}
                              {...steps_provided.droppableProps}
                            >
                              {unitData.steps.length > 0 ? (
                                unitData.steps.map(
                                  (
                                    journey_step: JourneyStep,
                                    journey_stepIndex: number
                                  ) => (
                                    <Draggable
                                      key={journey_step.id}
                                      draggableId={
                                        journey_step.id.toString() +
                                        "_journey_step"
                                      }
                                      index={journey_stepIndex}
                                    >
                                      {(steps_provided) => (
                                        <>
                                          <Collapsible
                                            className="group/collapsible border border-border rounded-lg p-3 flex gap-2 flex-col mt-2"
                                            ref={steps_provided.innerRef}
                                            defaultOpen={true}
                                            {...steps_provided.draggableProps}
                                          >
                                            <div className="flex gap-2 items-center py-2">
                                              <div
                                                className="p-0 hover:bg-transparent h-fit w-fit"
                                                {...steps_provided.dragHandleProps}
                                              >
                                                <GripVertical className="stroke-gray-400 w-4 h-4" />
                                              </div>
                                              <div className="grow flex justify-between items-center">
                                                <Button
                                                  variant="ghost"
                                                  className="p-0 h-fit hover:bg-transparent font-normal font-inter flex items-center justify-between"
                                                >
                                                  <span className="text-primary">
                                                    {getIcon(journey_step.type)}
                                                  </span>
                                                  <div>
                                                    {journey_step.title}
                                                  </div>
                                                </Button>
                                                <div className="flex items-center gap-2">
                                                  <CollapsibleTrigger
                                                    className="cursor-pointer text-left"
                                                    asChild
                                                  >
                                                    <ChevronDown className="stroke-gray-400 w-4 transition-transform h-4 group-data-[state=open]/collapsible:rotate-180" />
                                                  </CollapsibleTrigger>
                                                  <DropdownActions>
                                                    <Button
                                                      variant="ghost"
                                                      className="flex bg-transparent gap-2 justify-center  w-full"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (setData) {
                                                          setData(
                                                            (
                                                              prev: JourneyData[]
                                                            ) => {
                                                              const journeyIndex =
                                                                prev.findIndex(
                                                                  (
                                                                    item: JourneyData
                                                                  ) =>
                                                                    item.id ===
                                                                    journeyData.id
                                                                );
                                                              const newSections =
                                                                prev[
                                                                  journeyIndex
                                                                ].sections;
                                                              const sectionIndex =
                                                                newSections.findIndex(
                                                                  (
                                                                    item: JourneySection
                                                                  ) =>
                                                                    item.id ===
                                                                    sectionData.id
                                                                );
                                                              const unitIndex =
                                                                newSections[
                                                                  sectionIndex
                                                                ].units.findIndex(
                                                                  (
                                                                    item: JourneyUnit
                                                                  ) =>
                                                                    item.id ===
                                                                    unitData.id
                                                                );
                                                              const unitSteps =
                                                                newSections[
                                                                  sectionIndex
                                                                ].units[
                                                                  unitIndex
                                                                ].steps;
                                                              unitSteps.splice(
                                                                journey_stepIndex,
                                                                1
                                                              );
                                                              newSections[
                                                                sectionIndex
                                                              ].units[
                                                                unitIndex
                                                              ].steps =
                                                                unitSteps;
                                                              prev[
                                                                journeyIndex
                                                              ] = {
                                                                ...journeyData,
                                                                sections: [
                                                                  ...newSections,
                                                                ],
                                                              };
                                                              return [...prev];
                                                            }
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      <Trash2 />
                                                      <div className="text-sm grow text-left font-normal ">
                                                        Delete
                                                      </div>
                                                    </Button>
                                                  </DropdownActions>
                                                </div>
                                              </div>
                                            </div>
                                            <CollapsibleContent className="border-t border-border py-3 px-2">
                                              <Step
                                                type={journey_step.type}
                                                step={journey_step}
                                              />
                                            </CollapsibleContent>
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
                                    {"You haven't added any Steps yet."}
                                    <br />
                                    {"Tap 'Add unit' to create a new unit."}
                                  </div>
                                </div>
                              )}
                              {steps_provided.placeholder}
                              <AddStepButtonAndDropDown />
                            </CollapsibleContent>
                          )}
                        </Droppable>
                        {provided.placeholder}
                      </Collapsible>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <div className="w-full border-t flex justify-between px-6 pt-3 pb-5">
        <span>
          {(activeUnitIndex == 0 ? activeSectionIndex != 0 : true) && (
            <Link
              href={
                activeUnitIndex != 0
                  ? `/journey/${journeyData.id}/${sectionData.id}/${
                      sectionData.units[activeUnitIndex - 1].id
                    }`
                  : `/journey/${journeyData.id}/${
                      journeyData.sections[activeSectionIndex - 1].id
                    }/${
                      journeyData.sections[activeSectionIndex - 1].units[
                        journeyData.sections[activeSectionIndex - 1].units
                          .length - 1
                      ].id
                    }`
              }
              className="bg-muted flex gap-2 items-center justify-center font-inter text-sm  w-[170px] h-10 [&_svg]:size-5 rounded-md font-medium hover:shadow-sm text-primary dark:text-white"
            >
              <ChevronLeft />
              Previous Unit
            </Link>
          )}
        </span>
        <Link
          href={
            activeUnitIndex < sectionData.units.length - 1
              ? `/journey/${journeyData.id}/${sectionData.id}/${
                  sectionData.units[activeUnitIndex + 1].id
                }`
              : activeSectionIndex < journeyData.sections.length - 1
              ? `/journey/${journeyData.id}/${
                  journeyData.sections[activeSectionIndex + 1].id
                }/${journeyData.sections[activeSectionIndex + 1].units[0].id}`
              : ""
          }
          className="bg-muted flex gap-2 items-center justify-center font-inter text-sm  w-[170px] h-10 [&_svg]:size-5 rounded-md font-medium hover:shadow-sm text-primary dark:text-white"
        >
          {activeSectionIndex < journeyData.sections.length - 1
            ? "Next Unit"
            : activeUnitIndex < sectionData.units.length - 1
            ? "Next Unit"
            : "Update Unit"}
          <ChevronRight />
        </Link>
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

export default JourneyUnitComponent;
