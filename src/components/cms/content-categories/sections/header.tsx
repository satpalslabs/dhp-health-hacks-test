import { Table } from "@tanstack/table-core";
import { useDeferredValue, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import {
  ChevronDown,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DetailedSection, HealthCondition } from "@/types";
import { SelectHealthCondition } from "../collections/header";

const TableHeader = ({
  table,
  setOpen,
  setSelectedRows,
}: {
  table: Table<DetailedSection>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<DetailedSection[]>>;
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

  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  useEffect(() => {
    table.getColumn("section_name")?.setFilterValue(deferredInputValue);
  }, [deferredInputValue, table]);

  const [selectedHC, setSelectedHC] = useState<HealthCondition | null>(null);
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
              className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-3 border-input-border ">
                <Settings2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[256px] p-2 flex flex-col gap-2"
            >
              <SelectHealthCondition
                selectedHC={selectedHC}
                setSelectedHC={setSelectedHC}
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
                    if (selectedHC) {
                      table
                        .getColumn("associated_conditions")
                        ?.setFilterValue(selectedHC);
                    } else {
                      table
                        .getColumn("associated_conditions")
                        ?.setFilterValue(undefined);
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
            >
              Columns
              <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <Button
          onClick={() => {
            setSelectedRows([]);
            setOpen(true);
          }}
        >
          <Plus className="fill-white" /> Add
        </Button>
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
                className="text-button-filter-text bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3  h-8 capitalize text-sm rounded-[12px] "
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
                {label}: {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
                <X className="transition-transform" />
              </Button>
            )
        )}
        {selectedHC &&
          table.getColumn("associated_conditions")?.getFilterValue() !=
            undefined && (
            <Button
              variant="ghost"
              className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
              onClick={() => {
                setSelectedHC(null);
                table
                  .getColumn("associated_conditions")
                  ?.setFilterValue(undefined);
              }}
              size="sm"
            >
              Health Condition: {selectedHC.name}
              <X className="transition-transform" />
            </Button>
          )}
        {((filterDates.createdAt &&
          table.getColumn("createdAt")?.getFilterValue() != undefined) ||
          (filterDates.updatedAt &&
            table.getColumn("updatedAt")?.getFilterValue() != undefined) ||
          (selectedHC &&
            table.getColumn("associated_conditions")?.getFilterValue() !=
              undefined)) && (
          <Button
            variant="ghost"
            className="text-button-filter-text mb-2 !bg-transparent font-inter  dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
            onClick={() => {
              setSelectedHC(null);
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

export default TableHeader;

export const SelectionControlBar = ({
  data,
  selectedRows,
  setDeleteDialogOpen,
  setOpenEditor,
  setAction,
}: {
  data: DetailedSection[];
  selectedRows: DetailedSection[];
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<
    React.SetStateAction<"Delete" | "Publish" | "Unpublish">
  >;
}) => (
  <div className="flex items-center gap-3  text-button-filter-text font-inter font-medium text-sm mb-4 leading-6">
    <div>
      {selectedRows.length} of {data.length} Sections
    </div>
    <Separator />
    {selectedRows.length > 0 && (
      <>
        {selectedRows.length === 1 && (
          <>
            <div
              onClick={() => {
                setOpenEditor(true);
              }}
            >
              <ActionButton icon={PencilLine} label="Edit" />
            </div>
            <Separator />
          </>
        )}
        {/* {selectedRows.some((article) => article._status === "published") && (
          <>
            <div
              onClick={() => {
                setAction("Unpublish");
                setDeleteDialogOpen(true);
              }}
            >
              <ActionButton icon={Ban} label="Unpublish" />
            </div>
            <Separator />
          </>
        )}
        {selectedRows.some((article) => article._status !== "published") && (
          <>
            <div
              onClick={() => {
                setAction("Publish");
                setDeleteDialogOpen(true);
              }}
            >
              <ActionButton icon={Globe} label="Publish" />
            </div>
            <Separator />
          </>
        )} */}
        <div
          onClick={() => {
            setAction("Delete");
            setDeleteDialogOpen(true);
          }}
        >
          <ActionButton icon={Trash2} label="Delete" />
        </div>
      </>
    )}
  </div>
);

const Separator = () => (
  <span className="my-auto h-3 rounded w-[1px] bg-button-filter-text"></span>
);

const ActionButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <>
    <button className="flex items-center gap-2 [&_svg]:size-4">
      <Icon />
      <span>{label}</span>
    </button>
  </>
);
