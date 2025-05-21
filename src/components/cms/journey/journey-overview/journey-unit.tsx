import { Button } from "@/components/ui/button";
import {
  type JourneyData,
  type JourneyUnit,
  type JourneySection,
} from "@/types";
import {
  Ban,
  Globe,
  GripVertical,
  Inbox,
  PencilLine,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DropdownActions from "./dropdown-actions";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import AddOrEditUnitDialog from "./add-edit-unit";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import ActionConfirmationDialog from "../confirmation-dialog";
import { AddButton } from "@/components/ui/add-button";
import { JourneyContext } from "@/context/journey-data-provider";

export function handleUnit(
  operation: string,
  journeyID: number,
  section: JourneySection,
  unitIndex: number | null,
  currentData: JourneyData[],
  values?: {
    title: string;
    "heart-points": number;
    gems: number;
  }
): JourneyData[] {
  const updatedSection = section;
  const updatedData: JourneyData[] = currentData;
  const activeJourney = updatedData.findIndex((i) => i.id == journeyID);

  const sectionIndex = updatedData[activeJourney].sections.findIndex(
    (i) => i.id == section.id
  );
  if (operation == "delete") {
    if (unitIndex != null) {
      updatedSection.units.splice(unitIndex, 1);
    }
  } else if (operation == "publish") {
    if (unitIndex != null) {
      updatedSection.units[unitIndex].published =
        !updatedSection.units[unitIndex].published;
    }
  } else if (operation == "add") {
    if (values) {
      updatedSection.units.push({
        ...values,
        published: true,
        id: Date.now() + Math.random(),
        steps: [],
      });
    }
  } else if (operation == "edit") {
    if (unitIndex != null && values) {
      updatedSection.units[unitIndex] = {
        ...updatedSection.units[unitIndex],
        ...values,
      };
    }
  }
  updatedData[activeJourney].sections.splice(sectionIndex, 1, updatedSection);

  return [...updatedData];
}

const JourneyUnits = ({
  section,
  sectionIndex,
  journey,
}: {
  section: JourneySection;
  sectionIndex: number;
  journey: number;
}) => {
  const { journeys: data, updateJourneys: setData } =
    useContext(JourneyContext);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  return (
    <>
      <Droppable
        isDropDisabled={false}
        direction="vertical"
        isCombineEnabled={false}
        ignoreContainerClipping={true}
        droppableId={sectionIndex.toString() + "_unit"}
        type="unit"
      >
        {(unit_provided) => (
          <CollapsibleContent
            className="border-t mt-2 border-border"
            ref={unit_provided.innerRef}
            {...unit_provided.droppableProps}
          >
            {section.units.length > 0 ? (
              section.units.map((unit: JourneyUnit, unitIndex: number) => (
                <JourneyUnit
                  section={section}
                  unit={unit}
                  unitIndex={unitIndex}
                  journey={journey}
                  key={unitIndex}
                  setSelectedRow={setSelectedRow}
                  setOpen={setOpenAddDialog}
                />
              ))
            ) : (
              <div className="flex flex-col gap-2 py-6 text-center items-center text-gray-400">
                <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
                <div className="font-inter text-sm">
                  {"You haven't added any Units yet."}
                  <br />
                  {"Tap 'Add Unit to create a new unit."}
                </div>
              </div>
            )}
            {unit_provided.placeholder}
            <AddButton
              className="w-full"
              onClick={() => {
                setSelectedRow(null);
                setOpenAddDialog(true);
              }}
              text="Add Unit"
            />
          </CollapsibleContent>
        )}
      </Droppable>
      <AddOrEditUnitDialog
        selectedRowIx={selectedRow}
        open={openAddDialog}
        setOpen={(e: boolean) => {
          setOpenAddDialog(e);
          setSelectedRow(null);
        }}
        handleSubmit={(values) => {
          let result = data;
          result = handleUnit(
            selectedRow != null ? "edit" : "add",
            journey,
            section,
            selectedRow,
            data,
            values
          );
          setData([...result]);
          setOpenAddDialog(false);
          setSelectedRow(null);
        }}
        section={section}
      />
    </>
  );
};

export default JourneyUnits;

const JourneyUnit = ({
  section,
  unit,
  unitIndex,
  journey,
  setSelectedRow,
  setOpen,
}: {
  section: JourneySection;
  unit: JourneyUnit;
  unitIndex: number;
  journey: number;
  setSelectedRow: React.Dispatch<React.SetStateAction<number | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { journeys: data, updateJourneys: setData } =
    useContext(JourneyContext) ?? {};
  const [deleteJourneyDialog, setDeleteJourneyDialog] = useState(false);

  return (
    <Draggable
      key={unit.id}
      draggableId={
        unit.id.toString() + unitIndex.toString() + section.id.toString()
      }
      index={unitIndex}
    >
      {(unit_drag) => (
        <div
          className="flex justify-between text-sm font-inter leading-6 items-center p-2"
          ref={unit_drag.innerRef}
          {...unit_drag.draggableProps}
        >
          <div className="flex items-center gap-2 p-1">
            <div {...unit_drag.dragHandleProps}>
              <GripVertical className="stroke-gray-400 w-4 h-4" />
            </div>
            <div>{unit.title}</div>
          </div>
          <div className="flex gap-2 items-center">
            {!unit.published && (
              <div className=" bg-red-100 cursor-text hover:bg-red-100 rounded text-sm px-2 py-1 hover:text-red text-[red] h-fit w-fit">
                Unpublished
              </div>
            )}
            <div className="flex gap-1 items-center px-3">
              <Heart className="grow w-[22px] h-fit" />
              <div className="w-[72px]">{unit["heart-points"]}</div>
            </div>
            <div className="flex gap-1 items-center px-3">
              <Diamond className="grow w-[22px] h-fit" />
              <div className="w-[72px]">{unit.gems}</div>
            </div>
            <Link
              href={`/journey/${journey}/${section.id}/${unit.id}`}
              className="bg-muted hover:shadow-none h-[32px] shrink-0 font-medium w-fit font-inter text-primary dark:text-white flex gap-2 items-center py-2 px-3 [&_svg]:size-4 text-[13px] rounded-md"
            >
              <PencilLine />
              Edit Content
            </Link>
            <DropdownActions>
              <>
                <Button
                  variant="ghost"
                  className="hover:bg-muted bg-transparent items-center  w-full"
                  onClick={() => {
                    setSelectedRow(unitIndex);
                    setOpen(true);
                  }}
                >
                  <PencilLine />
                  <div className="text-sm grow text-left font-normal ">
                    Edit
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className=" bg-transparent hover:bg-muted w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const result = handleUnit(
                      "publish",
                      journey,
                      section,
                      unitIndex,
                      data
                    );
                    setData([...result]);
                  }}
                >
                  <DropdownMenuItem className="w-full flex items-center outline-none gap-2">
                    <>{unit.published ? <Ban /> : <Globe />}</>
                    <div className="text-sm grow text-left font-normal ">
                      {unit.published ? "Unpublish" : "Publish"}
                    </div>
                  </DropdownMenuItem>
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-muted bg-transparent items-center  w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteJourneyDialog(true);
                  }}
                >
                  <Trash2 />
                  <div className="text-sm grow text-left font-normal ">
                    Delete
                  </div>
                </Button>

                <ActionConfirmationDialog
                  open={deleteJourneyDialog}
                  setOpen={setDeleteJourneyDialog}
                  icon={<TriangleAlert />}
                  handleAction={() => {
                    const result = handleUnit(
                      "delete",
                      journey,
                      section,
                      unitIndex,
                      data
                    );

                    setData([...result]);

                    setDeleteJourneyDialog(false);
                  }}
                  dialog_title="Delete Unit?"
                  dialog_description="Are you sure you want to delete this Unit? This action cannot be undone."
                  action={"Delete"}
                />
              </>
            </DropdownActions>
          </div>
        </div>
      )}
    </Draggable>
  );
};
