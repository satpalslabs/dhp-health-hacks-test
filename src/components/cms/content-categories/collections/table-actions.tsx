import { Row, RowSelectionState } from "@tanstack/table-core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, PencilLine, Trash2 } from "lucide-react";
import { Collection } from "@/types";

const TableActions = ({
  row,
  setSelectedRows,
  setDeleteDialogOpen,
  setRowSelection,
  setOpenEditor,
  setAction,
}: {
  row: Row<Collection>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Collection[]>>;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<
    React.SetStateAction<"Delete" | "Publish" | "Unpublish">
  >;
}) => (
  <div className="flex gap-2 h-full items-center  p-3 ml-[-1px] ">
    <Button
      variant="secondary"
      className="h-8 w-8 float-right !bg-transparent focus-visible:ring-0 "
      onClick={(event) => {
        event.stopPropagation(); // Stop bubbling
        setSelectedRows([row.original]);
        setOpenEditor(true);
      }}
    >
      <PencilLine />
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="h-8 w-8 float-right focus-visible:ring-0 !bg-transparent"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 p-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuGroup className="flex flex-col w-full ">
          <Button
            variant="ghost"
            className="flex bg-transparent gap-2 justify-center  w-full"
            onClick={(e) => {
              e.stopPropagation();
              setAction("Delete");
              setSelectedRows([row.original]);
              setRowSelection({
                [String(row.id)]: true,
              });
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 />
            <div className="text-sm grow text-left font-normal ">Delete</div>
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default TableActions;
