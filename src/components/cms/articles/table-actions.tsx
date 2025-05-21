import { Row, RowSelectionState } from "@tanstack/table-core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, Ellipsis, Globe, PencilLine, Trash2 } from "lucide-react";
import nProgress from "nprogress";
import { usePathname, useRouter } from "next/navigation";
import { Article } from "@/types";
const TableActions = ({
  row,
  setSelectedRows,
  setDeleteDialogOpen,
  setRowSelection,
  setAction,
}: {
  row: Row<Article>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Article[]>>;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  setAction: React.Dispatch<
    React.SetStateAction<"Delete" | "Rejected" | "Approved">
  >;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex gap-2 h-full items-center  p-3 ml-[-1px] ">
      <Button
        variant="secondary"
        className="h-8 w-8 float-right !bg-transparent focus-visible:ring-0 "
        onClick={(event) => {
          event.stopPropagation(); // Stop bubbling
          nProgress.start(); // Start the top loader
          router.push(
            `/${pathname.includes("articles") ? "articles" : "videos"}/edit/${
              row.id
            }`
          ); // Navigate
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
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenuGroup className="flex flex-col w-full ">
            <Button
              variant="ghost"
              className="flex bg-transparent gap-2 justify-center  w-full"
              onClick={(e) => {
                e.stopPropagation();
                setAction(
                  row.getValue("status") == "Approved" ? "Rejected" : "Approved"
                );
                setSelectedRows([row.original]);
                setRowSelection({
                  [String(row.id)]: true,
                });
                setDeleteDialogOpen(true);
              }}
            >
              {row.getValue("status") == "Approved" ? <Ban /> : <Globe />}
              <div className="text-sm grow text-left font-normal">
                {row.getValue("status") == "Approved" ? "Rejected" : "Approved"}
              </div>
            </Button>
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
};

export default TableActions;
