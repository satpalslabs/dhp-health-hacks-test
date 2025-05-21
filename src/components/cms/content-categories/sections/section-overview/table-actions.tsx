import { Row, RowSelectionState } from "@tanstack/table-core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, PencilLine, Trash2 } from "lucide-react";
import nProgress from "nprogress";
import { useParams, useRouter } from "next/navigation";
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
    React.SetStateAction<"Delete" | "Publish" | "Unpublish">
  >;
}) => {
  const { sectionID } = useParams();
  const router = useRouter();
  return (
    <div className="flex gap-2 h-full items-center  p-3 ml-[-1px] ">
      <Button
        variant="secondary"
        className="h-8 w-8 float-right !bg-transparent focus-visible:ring-0 "
        onClick={(event) => {
          event.stopPropagation(); // Stop bubbling
          nProgress.start(); // Start the top loader
          if (row.original.content_type?.type == "content-video") {
            router.push(`/sections/${sectionID}/video/edit/${row.id}`);
          } else {
            router.push(`/sections/${sectionID}/article/edit/${row.id}`);
          }
        }}
      >
        <PencilLine />
      </Button>
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
