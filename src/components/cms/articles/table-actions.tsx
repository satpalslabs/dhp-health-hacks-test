import { Row, RowSelectionState } from "@tanstack/table-core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Check,
  Ellipsis,
  Globe,
  PencilLine,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import nProgress from "nprogress";
import { usePathname, useRouter } from "next/navigation";
import { Article } from "@/types";
import { Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { AuthContext } from "@/context/auth-provider";
import { cn } from "@/lib/utils";

type TableActionsProps = {
  row: Row<Article>;
  setSelectedRows: Dispatch<SetStateAction<Article[]>>;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  setAction: Dispatch<SetStateAction<"Delete" | Article["status"]>>;
};
const TableActions = ({
  row,
  setSelectedRows,
  setDeleteDialogOpen,
  setRowSelection,
  setAction,
}: TableActionsProps) => {
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
        <DropDownContentItems
          row={row}
          setSelectedRows={setSelectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setRowSelection={setRowSelection}
          setAction={setAction}
        />
      </DropdownMenu>
    </div>
  );
};

export default TableActions;

const DropDownContentItems = ({
  row,
  setSelectedRows,
  setDeleteDialogOpen,
  setRowSelection,
  setAction,
}: TableActionsProps) => {
  const currentStatus = row.getValue("status");
  const { user } = useContext(AuthContext);

  const dropdownItems: {
    name: string;
    value: Article["status"];
    role: string[];
    visible: boolean;
    icon: ReactNode;
  }[] = [
    {
      name: "Submit for Review",
      value: "Submitted for Review",
      role: ["superuser"],
      visible: currentStatus === "Draft",
      icon: <Upload />,
    },
    {
      name: "Approve",
      value: "Approved",
      role: ["superuser"],
      visible: currentStatus === "Submitted for Review",
      icon: <Check />,
    },
    {
      name: "Publish",
      value: "Published",
      role: ["superuser"],
      visible: currentStatus === "Approved",
      icon: <Globe />,
    },
    {
      name: "Reject",
      value: "Rejected",
      role: ["superuser"],
      visible:
        currentStatus === "Approved" ||
        currentStatus === "Published" ||
        currentStatus === "Submitted for Review",
      icon: <X />,
    },
  ];

  return (
    <DropdownMenuContent
      className="w-60 p-1"
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
      }}
    >
      <DropdownMenuGroup className="flex flex-col w-full ">
        {dropdownItems.map(({ name, value, role, visible, icon }) => {
          if (visible && value && user?.role && role.includes(user.role)) {
            return (
              <DropdownMenuItem
                key={value}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex bg-transparent gap-2 justify-center  w-full"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setAction(value);
                  setSelectedRows([row.original]);
                  setRowSelection({
                    [String(row.id)]: true,
                  });
                  setDeleteDialogOpen(true);
                }}
              >
                {icon}
                <div className="text-sm grow text-left font-normal">{name}</div>
              </DropdownMenuItem>
            );
          }
          return null;
        })}
        <DropdownMenuItem
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex bg-transparent gap-2 justify-center  w-full"
          )}
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
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};
