import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Check,
  ChevronDown,
  GripVertical,
  PencilLine,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DropdownActions from "./dropdown-actions";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import JourneyUnits from "./journey-unit";
import { Input } from "@/components/ui/input";
import { JourneyData } from "@/types";
import type { JourneySection } from "@/types";
import ActionConfirmationDialog from "../confirmation-dialog";
import { JourneyContext } from "@/context/journey-data-provider";

const JourneySection = ({
  section,
  sectionIndex,
  journey,
  addOrEditSection,
  setAddOrEditSection,
  setJourney,
  activeSection,
  defaultCollapseContainers,
  inputValue,
}: {
  section: JourneySection;
  sectionIndex: number;
  journey: number;
  addOrEditSection: null | number;
  setAddOrEditSection: React.Dispatch<React.SetStateAction<number | null>>;
  setJourney: React.Dispatch<React.SetStateAction<JourneyData>>;
  activeSection: undefined | JourneySection;
  defaultCollapseContainers: number[];
  inputValue: string;
}) => {
  const [deleteJourneySection, setDeleteJourneySection] = useState(false);
  const { journeys: data, updateJourneys: setData } =
    useContext(JourneyContext) ?? {};
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [prevTitle, setPrevTitle] = useState("");
  const journeyIndex = data.findIndex(
    (item: JourneyData) => item.id == journey
  );

  function handleDeleteSection() {
    const updatedJourneys = data; // Create a new array copy
    const updatedSections = [...updatedJourneys[journeyIndex].sections]; // Copy sections array
    const sectionIndex = updatedSections.findIndex((i) => i.id === section.id);
    updatedSections.splice(sectionIndex, 1); // Remove the section
    updatedJourneys[journeyIndex] = {
      ...updatedJourneys[journeyIndex],
      sections: [...updatedSections], // Assign updated sections array
    };
    setData([...updatedJourneys]);
  }

  return (
    <Draggable
      key={section.id}
      draggableId={section.id.toString() + "_section"}
      index={sectionIndex}
    >
      {(provided) => (
        <>
          <Collapsible
            className="group/collapsible border border-border rounded-lg p-3"
            defaultOpen={
              activeSection && inputValue == ""
                ? activeSection.id == section.id
                : inputValue != ""
                ? defaultCollapseContainers.includes(section.id)
                : true
            }
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className="flex gap-2 items-center py-2">
              <div
                className="p-0 hover:bg-transparent h-fit w-fit"
                {...provided.dragHandleProps}
              >
                <GripVertical className="stroke-gray-400 w-4 h-4" />
              </div>
              <div className="grow flex justify-between items-center font-inter text-sm">
                {addOrEditSection != section.id ? (
                  <>
                    <p>{section.title}</p>
                    <CollapsibleTrigger
                      className="cursor-pointer text-left"
                      asChild
                    >
                      <ChevronDown className="stroke-gray-400 w-4 transition-transform h-4 group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </>
                ) : (
                  <form className="flex gap-3 w-full items-center">
                    <Input
                      type="text"
                      className={`grow focus-visible:ring-0 ${
                        error ? "border-red-200 bg-red-200/5" : ""
                      }`}
                      value={section.title}
                      onChange={(e) => {
                        setError(false);
                        setJourney((prev: JourneyData) => {
                          prev.sections[sectionIndex].title = e.target.value;
                          return { ...prev };
                        });
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-muted w-fit p-3 hover:shadow-sm text-primary "
                      onClick={() => {
                        if (section.title != "") {
                          setError(false);
                          setAddOrEditSection(null);
                          if (setData) {
                            const _updatedJourneys = data;
                            _updatedJourneys[journeyIndex].sections = [
                              ..._updatedJourneys[journeyIndex].sections,
                              section,
                            ];
                            setData(_updatedJourneys);
                          }
                        } else {
                          setError(true);
                        }
                      }}
                    >
                      <Check className="text-primary dark:text-white" />
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="p-3"
                      onClick={() => {
                        setAddOrEditSection(null);
                        setError(false);

                        if (!isEditing) {
                          setJourney((prev: JourneyData) => {
                            prev.sections.splice(sectionIndex, 1);
                            return { ...prev };
                          });
                        } else {
                          setJourney((prev: JourneyData) => {
                            prev.sections[sectionIndex].title = prevTitle;
                            return { ...prev };
                          });
                        }
                      }}
                    >
                      <X className="text-gray-700 dark:text-white" />
                    </Button>
                  </form>
                )}
              </div>
              {addOrEditSection != section.id && (
                <DropdownActions>
                  <>
                    <Button
                      variant="ghost"
                      className=" bg-transparent hover:bg-muted w-full"
                      onClick={(e) => {
                        if (addOrEditSection == null) {
                          e.stopPropagation();
                          setAddOrEditSection(section.id);
                          setIsEditing(true);
                          setPrevTitle(section.title);
                        }
                      }}
                    >
                      <DropdownMenuItem className="w-full flex items-center outline-none gap-2">
                        <PencilLine />
                        <div className="text-sm grow text-left font-normal ">
                          Edit
                        </div>
                      </DropdownMenuItem>
                    </Button>
                    <Button
                      variant="ghost"
                      className="hover:bg-muted bg-transparent items-center  w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteJourneySection(true);
                      }}
                    >
                      <Trash2 />
                      <div className="text-sm grow text-left font-normal ">
                        Delete
                      </div>
                    </Button>

                    <ActionConfirmationDialog
                      open={deleteJourneySection}
                      setOpen={setDeleteJourneySection}
                      handleAction={() => {
                        handleDeleteSection();
                        setDeleteJourneySection(false);
                      }}
                      icon={<TriangleAlert />}
                      dialog_title="Delete Section?"
                      dialog_description="Are you sure you want to delete this section? This action
                      cannot be undone."
                      action={"Delete"}
                    />
                  </>
                </DropdownActions>
              )}
            </div>
            <JourneyUnits
              journey={journey}
              section={section}
              sectionIndex={sectionIndex}
            />
          </Collapsible>
        </>
      )}
    </Draggable>
  );
};

export default JourneySection;
