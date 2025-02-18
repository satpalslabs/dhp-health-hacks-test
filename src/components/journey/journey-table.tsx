"use client";
import { JourneyData } from "@/lib/journey-services";
import { ChevronRight, Inbox, Plus } from "lucide-react";
import React, { useContext, useState } from "react";
import JourneyTableHeader from "./header";
import { DataContext } from "../providers/data-provider";
import AddOrEditJourneyDialog from "./add-edit-journey";
import { Button } from "../ui/button";
import Link from "next/link";

const JourneyTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { data } = useContext(DataContext) ?? {};
  const [filteredData, setFilteredData] = useState<JourneyData[]>([...data]);

  return (
    <div className="flex flex-col gap-4">
      <JourneyTableHeader
        setOpenDialog={setOpenDialog}
        setData={setFilteredData}
      />
      <div className="flex flex-col border border-border rounded-lg">
        {filteredData.length > 0 ? (
          filteredData.map((journey: JourneyData, ix: number) => (
            <TableRow journey={journey} ix={ix} key={ix} />
          ))
        ) : (
          <div className="flex flex-col gap-5 py-6 px-4">
            <div className="flex flex-col gap-2  text-center items-center text-gray-400">
              <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
              <div className="font-inter text-sm">
                {"You haven't added any Journey yet."}
                <br />
                {"Tap ‘Add Journey’ to create a new journey."}
              </div>
            </div>
            <Button
              variant="default"
              className="bg-muted w-full hover:shadow-sm text-primary dark:text-white"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <Plus /> Add Journey
            </Button>
          </div>
        )}
      </div>
      <AddOrEditJourneyDialog
        open={openDialog}
        setOpen={setOpenDialog}
        id={null}
      />
    </div>
  );
};

export default JourneyTable;

const TableRow = ({ journey, ix }: { journey: JourneyData; ix: number }) => (
  <Link
    href={`/journey/${journey.id}`}
    className={`flex justify-between items-center p-4 ${
      ix != 0 ? "border-t border-border" : ""
    }`}
  >
    <div className="flex flex-col gap-3 font-inter ">
      <div className="flex gap-2 items-center">
        <p className="font-medium">{journey.title}</p>
        <p className=" text-gray-500">{journey.sections.length} sections</p>
      </div>
      <div className="flex gap-2 items-center text-xs">
        <div className="flex gap-2 items-center border border-border py-1 px-[6px] rounded-md">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ background: journey["primary-color"] }}
          ></div>
          <p className="leading-4">{journey["primary-color"]}</p>
        </div>
        <div className="flex gap-2 items-center border border-border py-1 px-[6px] rounded-md">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ background: journey["background-color"] }}
          ></div>
          <p className="leading-4">{journey["background-color"]}</p>
        </div>
      </div>
    </div>
    <Button
      variant={"ghost"}
      className="p-2 h-fit text-gray-800 [&_svg]:size-5"
    >
      <ChevronRight />
    </Button>
  </Link>
);
