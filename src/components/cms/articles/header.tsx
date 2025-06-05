import { Table } from "@tanstack/table-core";
import {
  ReactNode,
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  Globe,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Article } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AuthContext } from "@/context/auth-provider";

type StatusType = {
  value: Article["status"] | "all";
  label: "All" | "Draft" | "In Review" | "Rejected" | "Approved" | "Published";
};

const ArticleTableHeader = ({
  table,
  // setOpenDialog,
  setSelectedRows,
}: {
  table: Table<Article>;
  // setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Article[]>>;
}) => {
  const [filterDates, setFilterDates] = useState<{
    updatedAt: undefined | DateRange;
    createdAt: undefined | DateRange;
  }>({
    updatedAt: {
      from: undefined,
      to: undefined,
    },
    createdAt: {
      from: undefined,
      to: undefined,
    },
  });
  const [dateFilters, setDateFilters] = useState({
    updatedAt: false,
    createdAt: false,
  });
  const [selectedStatus, setSelectedStatus] = useState<StatusType>({
    value: "all",
    label: "All",
  });
  const waitingForApprovalCount = table
    .getPrePaginationRowModel()
    .rows.filter((i) => i.original.status === "Submitted for Review");
  const rejectedArticleCount = table
    .getPrePaginationRowModel()
    .rows.filter((i) => i.original.status === "Rejected");
  const pathname = usePathname();

  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  useEffect(() => {
    table.getColumn("title")?.setFilterValue(deferredInputValue);
  }, [deferredInputValue, table]);

  function handleFilterButtonClick(
    status: Article["status"],
    label: StatusType["label"]
  ) {
    setSelectedStatus((prev) => {
      if (prev.value != status) {
        table.getColumn("status")?.setFilterValue(status);
        setTimeout(() => {
          table.toggleAllRowsSelected();
        }, 10);
        return {
          label: label,
          value: status,
        };
      } else {
        table.toggleAllRowsSelected();
        table.getColumn("status")?.setFilterValue(undefined);
        return {
          label: "All",
          value: "all",
        };
      }
    });
  }
  return (
    <Collapsible className="group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
            <Input
              placeholder="Search"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              className="max-w-sm w-[264px] max-[1580px]:w-[200px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-3 border-input-border ">
                <Settings2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[256px] p-2 flex flex-col gap-2"
            >
              <SelectStatus
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
              <div className="flex items-center gap-2 w-full">
                <Checkbox
                  id="createdAt"
                  checked={dateFilters.createdAt}
                  onCheckedChange={(e: boolean) => {
                    setDateFilters(
                      (prev: { updatedAt: boolean; createdAt: boolean }) => ({
                        ...prev,
                        createdAt: e,
                      })
                    );
                  }}
                />
                <label
                  htmlFor="createdAt"
                  className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Created At
                </label>
              </div>
              <DatePickerWithRange
                className="w-full"
                disabled={!dateFilters.createdAt}
                date={filterDates.createdAt}
                setDate={(e: DateRange | undefined) => {
                  setFilterDates(
                    (prev: {
                      updatedAt: undefined | DateRange;
                      createdAt: undefined | DateRange;
                    }) => ({ ...prev, createdAt: e })
                  );
                }}
              />
              <hr className="border-border" />
              <div className="flex items-center w-full gap-2">
                <Checkbox
                  id="updatedAt"
                  checked={dateFilters.updatedAt}
                  onCheckedChange={(e: boolean) => {
                    setDateFilters(
                      (prev: { updatedAt: boolean; createdAt: boolean }) => ({
                        ...prev,
                        updatedAt: e,
                      })
                    );
                  }}
                />
                <label
                  htmlFor="updatedAt"
                  className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Updated At
                </label>
              </div>
              <DatePickerWithRange
                className="w-full"
                disabled={!dateFilters.updatedAt}
                date={filterDates.updatedAt}
                setDate={(e) => {
                  setFilterDates(
                    (prev: {
                      updatedAt: undefined | DateRange;
                      createdAt: undefined | DateRange;
                    }) => ({ ...prev, updatedAt: e })
                  );
                }}
              />
              <hr className=" border-border" />
              <DropdownMenuItem className="w-full p-0">
                <Button
                  className="w-full"
                  onClick={() => {
                    if (selectedStatus.value != "all") {
                      table
                        .getColumn("status")
                        ?.setFilterValue(selectedStatus.value);
                    } else {
                      table.getColumn("status")?.setFilterValue(undefined);
                    }
                    if (dateFilters.updatedAt) {
                      table
                        .getColumn("updatedAt")
                        ?.setFilterValue([
                          filterDates.updatedAt?.from,
                          filterDates.updatedAt?.to,
                        ]);
                    } else {
                      table.getColumn("updatedAt")?.setFilterValue(undefined);
                    }
                    if (dateFilters.createdAt) {
                      table
                        .getColumn("createdAt")
                        ?.setFilterValue([
                          filterDates.createdAt?.from,
                          filterDates.createdAt?.to,
                        ]);
                    } else {
                      table.getColumn("createdAt")?.setFilterValue(undefined);
                    }
                  }}
                >
                  Apply
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className=" border border-input-border font-normal group-data-[state=open]:ring-1 ring-foreground"
              onClick={() => {
                table.getColumn("title")?.setFilterValue("");
              }}
            >
              Columns
              <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center gap-2">
          {rejectedArticleCount.length > 0 && (
            <Button
              variant="secondary"
              className={` font-medium font-inter border ring-foreground text-button-status-rejectedButton ${
                selectedStatus.value == "Rejected" &&
                table.getIsAllRowsSelected() &&
                table.getColumn("status")?.getFilterValue() == "Rejected"
                  ? "border-primary"
                  : "border-input-border"
              }`}
              onClick={() => handleFilterButtonClick("Rejected", "Rejected")}
            >
              {rejectedArticleCount.length} Rejected
            </Button>
          )}
          {waitingForApprovalCount.length > 0 && (
            <Button
              variant="secondary"
              className={` font-medium font-inter border ring-foreground text-button-status-inReviewButton  ${
                selectedStatus.value == "Submitted for Review" &&
                table.getIsAllRowsSelected() &&
                table.getColumn("status")?.getFilterValue() ==
                  "Submitted for Review"
                  ? "border-primary"
                  : "border-input-border"
              }`}
              onClick={() =>
                handleFilterButtonClick("Submitted for Review", "In Review")
              }
            >
              {waitingForApprovalCount.length} Awaiting for Approval
            </Button>
          )}
          <Link
            href={
              pathname.includes("articles") ? "/articles/add" : "/videos/add"
            }
            className={cn(buttonVariants())}
            onClick={() => {
              // setOpenDialog((prev) => !prev);
              setSelectedRows([]);
            }}
          >
            <Plus className="fill-white" /> Add
          </Link>
        </div>
      </div>

      <CollapsibleContent className="flex gap-2 mt-4 flex-wrap group-data-[state=open]:pb-4">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <Button
                key={column.id}
                variant={"ghost"}
                className="text-button-filter-text bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background  font-medium flex gap-1 items-center px-3  h-8 capitalize text-sm rounded-[12px] "
                onClick={() => {
                  column.toggleVisibility(!column.getIsVisible());
                }}
                size={"sm"}
              >
                <Plus
                  className={`transition-transform ${
                    column.getIsVisible() ? "rotate-45" : ""
                  }`}
                />
                {column.id.replaceAll("_", " ")}
              </Button>
            );
          })}
      </CollapsibleContent>
      <div className="flex gap-2">
        {[
          {
            key: "createdAt",
            label: "Created at",
            dateRange: filterDates.createdAt,
            resetFilters: () => {
              setDateFilters((prev) => ({ ...prev, createdAt: false }));
              setFilterDates((prev) => ({
                ...prev,
                createdAt: { from: undefined, to: undefined },
              }));
              table.getColumn("createdAt")?.setFilterValue(undefined);
            },
          },
          {
            key: "updatedAt",
            label: "Updated at",
            dateRange: filterDates.updatedAt,
            resetFilters: () => {
              setDateFilters((prev) => ({ ...prev, updatedAt: false }));
              setFilterDates((prev) => ({
                ...prev,
                updatedAt: { from: undefined, to: undefined },
              }));
              table.getColumn("updatedAt")?.setFilterValue(undefined);
            },
          },
        ].map(
          ({ key, label, dateRange, resetFilters }) =>
            dateRange?.from &&
            dateRange?.to &&
            table.getColumn(key)?.getFilterValue() != undefined && (
              <Button
                key={key}
                variant="ghost"
                className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
                onClick={resetFilters}
                size="sm"
              >
                {label}: {format(dateRange.from, "LLL dd, y")} -
                {format(dateRange.to, "LLL dd, y")}
                <X className="transition-transform" />
              </Button>
            )
        )}
        {selectedStatus.value != "all" &&
          table.getColumn("status")?.getFilterValue() != undefined && (
            <Button
              variant="ghost"
              className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
              onClick={() => {
                table.toggleAllRowsSelected(false);
                setSelectedStatus({ label: "All", value: "all" });
                table.getColumn("status")?.setFilterValue(undefined);
              }}
              size="sm"
            >
              Status: {selectedStatus.label}
              <X className="transition-transform" />
            </Button>
          )}
        {((filterDates.createdAt &&
          table.getColumn("createdAt")?.getFilterValue() != undefined) ||
          (filterDates.updatedAt &&
            table.getColumn("updatedAt")?.getFilterValue() != undefined)) && (
          <Button
            variant="ghost"
            className="text-button-filter-text mb-2 !bg-transparent font-inter  dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
            onClick={() => {
              setDateFilters({
                updatedAt: false,
                createdAt: false,
              });
              table.resetColumnFilters();
            }}
            size="sm"
          >
            Clear all
          </Button>
        )}
      </div>
    </Collapsible>
  );
};

export default ArticleTableHeader;

export const SelectionControlBar = ({
  data,
  selectedRows,
  setDeleteDialogOpen,
  setAction,
}: {
  data: Article[];
  selectedRows: Article[];
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<React.SetStateAction<"Delete" | Article["status"]>>;
}) => {
  const pathname = usePathname();
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
      visible: selectedRows.every((i) => i.status == "Draft"),
      icon: <Upload />,
    },
    {
      name: "Approve",
      value: "Approved",
      role: ["superuser"],
      visible: selectedRows.every((i) => i.status == "Submitted for Review"),
      icon: <Check />,
    },
    {
      name: "Publish",
      value: "Published",
      role: ["superuser"],
      visible: selectedRows.every((i) => i.status == "Approved"),
      icon: <Globe />,
    },
    {
      name: "Reject",
      value: "Rejected",
      role: ["superuser"],
      visible: selectedRows.every(
        (i) =>
          i.status == "Approved" ||
          i.status == "Published" ||
          i.status == "Submitted for Review"
      ),
      icon: <X />,
    },
  ];
  return (
    <div className="flex items-center gap-3 text-button-filter-text font-inter font-medium text-sm mb-4 leading-6">
      <div>
        {selectedRows.length} of {data.length}
        {pathname.includes("articles") ? " Articles" : " Videos"}
      </div>
      <Separator />
      {selectedRows.length > 0 && (
        <>
          {selectedRows.length === 1 && (
            <>
              <Link
                href={
                  pathname?.includes("articles")
                    ? `/articles/edit/${selectedRows[0].id}`
                    : `/videos/edit/${selectedRows[0].id}`
                }
              >
                <ActionButton icon={<PencilLine />} label="Edit" />
              </Link>
              <Separator />
            </>
          )}
          {user?.role &&
            dropdownItems
              .filter((item) => item.visible && item.role.includes(user.role))
              .map((item, index) => (
                <span className="flex items-center gap-3" key={index}>
                  <div
                    key={index}
                    onClick={() => {
                      setAction(item.value);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <ActionButton icon={item.icon} label={item.name} />
                  </div>
                  <Separator />
                </span>
              ))}

          <div
            onClick={() => {
              setAction("Delete");
              setDeleteDialogOpen(true);
            }}
          >
            <ActionButton icon={<Trash2 />} label="Delete" />
          </div>
        </>
      )}
    </div>
  );
};

const SelectStatus = ({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: StatusType;
  setSelectedStatus: React.Dispatch<React.SetStateAction<StatusType>>;
}) => {
  const quizTypes: StatusType[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Approved",
      value: "Approved",
    },
    {
      label: "In Review",
      value: "Submitted for Review",
    },
    {
      label: "Draft",
      value: "Draft",
    },
    {
      label: "Rejected",
      value: "Rejected",
    },
    {
      label: "Published",
      value: "Published",
    },
  ];
  return (
    <div className="flex flex-col gap-2 font-inter mb-2">
      <p className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Status
      </p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full font-normal justify-between"
          >
            {selectedStatus ? (
              selectedStatus.label
            ) : (
              <span className="text-gray-500">Select Type</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="right"
          className="w-[--radix-popover-trigger-width] p-0 mt-0 ml-1"
        >
          <Command className="w-full">
            <CommandList>
              <CommandGroup>
                {quizTypes.map((item, ix) => (
                  <CommandItem
                    value={item.value ?? ""}
                    key={ix}
                    onSelect={() => {
                      setSelectedStatus(item);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedStatus?.value === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Separator = () => (
  <span className="my-auto h-3 rounded w-[1px] bg-button-filter-text"></span>
);

const ActionButton = ({
  icon: Icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) => (
  <>
    <button className="flex items-center gap-2 [&_svg]:size-4">
      {Icon}
      <span>{label}</span>
    </button>
  </>
);
