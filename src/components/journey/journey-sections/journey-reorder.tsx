"use client";

import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { handleJourneyDeletion, JourneyData } from "@/lib/journey-services";
import type { JourneySection } from "@/lib/journey-services";
import { Inbox, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import JourneySectionComponent from "./journey-section";
import AddOrEditJourneyDialog from "../add-edit-journey";
import DropdownActions from "./dropdown-actions";
import { DataContext } from "@/components/providers/data-provider";
import { useRouter } from "next/navigation";
import DeleteDialog from "../delete-dialog";

const JourneySections = ({
  journeyData: initialData,
  section: activeSection,
}: {
  journeyData: JourneyData;
  section: undefined | JourneySection;
}) => {
  const [openJourneyDialog, setOpenJourneyDialog] = useState(false);
  const [journeyData, setJourneyData] = useState(initialData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, setData } = useContext(DataContext) ?? {};
  const [addOrEditSection, setAddOrEditSection] = useState<number | null>(null);
  const router = useRouter();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // If there's no valid drop destination, exit early
    if (!destination) return;

    // Create a new copy of sections to avoid mutating state directly
    const newSections = [...journeyData.sections];

    // Handling drag-and-drop for sections
    if (type === "section") {
      // Remove the dragged section from its original position
      const [movedSection] = newSections.splice(source.index, 1);

      // Insert the section at the new position
      newSections.splice(destination.index, 0, movedSection);
    }
    // Handling drag-and-drop for units within sections
    else if (type === "unit") {
      // Get the index of the source and destination sections
      const sourceSectionIndex = parseInt(source.droppableId, 10);
      const destSectionIndex = parseInt(destination.droppableId, 10);

      // Create copies of the unit arrays to prevent direct state mutation
      const sourceUnits = [...newSections[sourceSectionIndex].units];

      // Remove the dragged unit from its original section
      const [movedUnit] = sourceUnits.splice(source.index, 1);

      // If the unit is moved **within the same section**
      if (sourceSectionIndex === destSectionIndex) {
        // Insert the unit at the new index in the same section
        sourceUnits.splice(destination.index, 0, movedUnit);
        newSections[sourceSectionIndex].units = sourceUnits;
      }
      // If the unit is moved **to a different section**
      else {
        // Get the destination section's units
        const destUnits = [...newSections[destSectionIndex].units];

        // Insert the moved unit into the destination section
        destUnits.splice(destination.index, 0, movedUnit);

        // Update both the source and destination sections
        newSections[sourceSectionIndex].units = sourceUnits;
        newSections[destSectionIndex].units = destUnits;
      }
    }

    // Update state with the modified sections
    if (setData) {
      setData((prev: JourneyData[]) => {
        const journeyIndex = prev.findIndex(
          (item: JourneyData) => item.id === journeyData.id
        );
        prev[journeyIndex] = { ...journeyData, sections: newSections };
        return [...prev];
      });
    }
  };

  useEffect(() => {
    const activeJourneyIndex = data.findIndex(
      (i: JourneyData) => i.id === journeyData.id
    );
    if (activeJourneyIndex != -1) {
      setJourneyData({ ...data[activeJourneyIndex] });
    }
  }, [data, journeyData.id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
        <Input
          placeholder="Search"
          className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="w-full rounded-lg border border-border ">
        <div className="flex flex-col gap-2  p-3">
          <div className="flex px-[6px] py-2 text-sm items-center font-inter justify-between leading-6">
            <div className="flex gap-2 items-center">
              <div
                className={`h-3 w-3 rounded`}
                style={{
                  background: journeyData["primary-color"],
                }}
              />
              <div>{journeyData?.title}</div>
            </div>
            <DropdownActions>
              <>
                <Button
                  variant="ghost"
                  className="flex bg-transparent gap-2 justify-center  w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenJourneyDialog(true);
                  }}
                >
                  <PencilLine />
                  <div className="text-sm grow text-left font-normal">Edit</div>
                </Button>
                <Button
                  variant="ghost"
                  className="flex bg-transparent gap-2 justify-center  w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 />
                  <div className="text-sm grow text-left font-normal ">
                    Delete
                  </div>
                </Button>
                {journeyData && (
                  <>
                    <AddOrEditJourneyDialog
                      id={journeyData.id}
                      open={openJourneyDialog}
                      setOpen={setOpenJourneyDialog}
                    />
                    <DeleteDialog
                      open={deleteDialogOpen}
                      setOpen={setDeleteDialogOpen}
                      handleDelete={async () => {
                        const result = await handleJourneyDeletion(
                          data,
                          journeyData.id
                        );
                        if (setData) {
                          setData(result);
                        }
                        router.back();
                        setDeleteDialogOpen(false);
                      }}
                      resourceName="Journey"
                    />
                  </>
                )}
              </>
            </DropdownActions>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              isDropDisabled={false}
              direction="vertical"
              isCombineEnabled={true}
              ignoreContainerClipping={false}
              droppableId="sections"
              type="section"
            >
              {(provided) => (
                <div
                  className="flex gap-2 flex-col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {journeyData.sections.length > 0 ? (
                    journeyData.sections.map(
                      (section: JourneySection, sectionIndex: number) => (
                        <JourneySectionComponent
                          section={section}
                          sectionIndex={sectionIndex}
                          key={sectionIndex}
                          journey={journeyData.id}
                          addOrEditSection={addOrEditSection}
                          setAddOrEditSection={setAddOrEditSection}
                          setJourney={setJourneyData}
                          activeSection={activeSection}
                        />
                      )
                    )
                  ) : (
                    <div className="flex flex-col gap-2 pb-[18px] text-center items-center text-gray-400">
                      <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
                      <div className="font-inter text-sm">
                        {"You haven't added any sections yet."}
                        <br />
                        {"Tap 'Add Section to create a new section."}
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            variant="default"
            className="bg-muted w-full hover:shadow-sm text-primary dark:text-white"
            onClick={() => {
              if (addOrEditSection == null) {
                const randomId = Date.now() + Math.random();
                setAddOrEditSection(randomId);
                setJourneyData((prev: JourneyData) => {
                  prev.sections.push({
                    title: "",
                    id: randomId,
                    units: [],
                  });
                  return { ...prev };
                });
              }
            }}
          >
            <Plus />
            Add Section
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JourneySections;
