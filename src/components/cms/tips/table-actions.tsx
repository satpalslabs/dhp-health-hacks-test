import { Row, RowSelectionState } from "@tanstack/table-core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, PencilLine, Trash2 } from "lucide-react";
import { TableRowType } from "./tips-table";
const TableActions = ({
  row,
  setSelectedRows,
  setDeleteDialogOpen,
  setRowSelection,
  setOpenEditor,
}: {
  row: Row<TableRowType>;
  setSelectedRows: React.Dispatch<React.SetStateAction<TableRowType[]>>;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="h-8 w-8 float-right focus-visible:ring-0 bg-muted"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 p-1"
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuGroup className="flex flex-col w-full ">
          <Button
            variant="ghost"
            className="flex bg-transparent gap-2 justify-center  w-full"
            onClick={(event) => {
              event.stopPropagation(); // Stop bubbling
              setSelectedRows([row.original]);
              setOpenEditor(true);
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
  </>
);

export default TableActions;
