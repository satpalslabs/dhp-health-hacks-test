"use client";

import { ChevronRight, Inbox } from "lucide-react";
import React, { useState } from "react";
import PackTableHeader from "./header";
import { Pack } from "@/types";
import { ContentPath } from "../sections/section-overview/columns";
import AddOrEditPack from "./manage-pack";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { PackTableRowType } from ".";
import { AddButton } from "@/components/ui/add-button";
import { Button } from "@/components/ui/button";

const PackTable = ({
  filteredData,
  setFilteredData,
  initialData,
}: {
  filteredData: PackTableRowType[];
  setFilteredData: React.Dispatch<React.SetStateAction<PackTableRowType[]>>;
  initialData: PackTableRowType[];
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full grow overflow-auto">
      <PackTableHeader
        setOpenDialog={setOpenDialog}
        setData={setFilteredData}
        initialData={initialData}
      />
      <div className="grow">
        {filteredData.length > 0 ? (
          <div className="flex flex-col border border-border grow rounded-lg">
            {filteredData.map((pack: Pack, ix: number) => (
              <TableRow pack={pack} ix={ix} key={ix} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col border border-border h-full rounded-lg justify-center">
            <div className="flex flex-col gap-5 py-6 px-4">
              <div className="flex flex-col gap-2  text-center items-center text-gray-400">
                <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
                <div className="font-inter text-sm">
                  {"You haven't added any Pack yet."}
                  <br />
                  {"Tap ‘Add Pack to create a new Pack."}
                </div>
              </div>

              <AddButton
                className="w-fit mx-auto"
                text="Add Pack"
                onClick={() => {
                  setOpenDialog(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <AddOrEditPack open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default PackTable;

const TableRow = ({ pack, ix }: { pack: PackTableRowType; ix: number }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        nProgress.start();
        router.push(`packs/${pack.id}`);
      }}
      className={`flex justify-between items-center p-4 ${
        ix != 0 ? "border-t border-border" : ""
      }`}
    >
      <div className="flex flex-col gap-3 font-inter ">
        <div className="flex gap-2 items-center">
          <p className="font-medium">{pack.name}</p>
          <p className=" text-gray-500">
            as {pack.type == "tip-pack" ? "Tips" : "Quiz"}
          </p>
        </div>
        <div
          className="flex gap-2 items-center text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <ContentPath
            collection_data={pack.collection_data}
            section={pack.section}
            sub_section={pack.sub_section}
          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {pack._status !== "published" && (
          <div
            className={` rounded-md capitalize text-sm px-2 py-1 hover:text-red h-fit w-fit ${
              pack._status == "draft"
                ? "bg-button-status-darkGray text-text-darkGray"
                : "bg-red-100 text-[red] "
            }`}
          >
            {pack._status}
          </div>
        )}
        <Button
          variant={"ghost"}
          className="p-2 h-fit text-text-darkGray [&_svg]:size-5"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
