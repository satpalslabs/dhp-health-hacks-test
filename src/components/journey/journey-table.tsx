"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { JourneyData } from "@/lib/journey-services";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  Ellipsis,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { NavigationPathContext } from "../providers/top-navigation-provider";
import { DataTable } from "../table/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import TableCells from "../table/table-cells";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import ColorPicker from "../ui/color-picker";

const multiColumnFilterFn: FilterFn<JourneyData> = (row, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.title} `;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

const dateRangeFilter: FilterFn<JourneyData> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const columns: ColumnDef<JourneyData>[] = [
  {
    id: "select",
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <TableCells type="text">{row.getValue("id")}</TableCells>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }) => (
      <TableCells type="text" className="capitalize">
        {row.getValue("title")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "sections",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Section
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }: { row: any }) => (
      <TableCells type="text" className="capitalize">
        {row.getValue("sections").length}
      </TableCells>
    ),
  },
  {
    accessorKey: "primary-color",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Primary color
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }) => (
      <TableCells
        type="color"
        style={{
          background: `${row.getValue("primary-color")}`,
        }}
      >
        {row.getValue("primary-color")}
      </TableCells>
    ),
  },

  {
    accessorKey: "background-color",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Background color
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }) => (
      <TableCells
        type="color"
        style={{
          background: `${row.getValue("background-color")}`,
        }}
      >
        {row.getValue("background-color")}
      </TableCells>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          createdAt
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }) => (
      <TableCells
        type="color"
        style={{
          background: `${row.getValue("createdAt")}`,
        }}
      >
        <>
          {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
            year: "numeric",
            day: "numeric",
            month: "long",
          })}
        </>
      </TableCells>
    ),
    filterFn: dateRangeFilter,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <TableCells
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          updatedAt
          <ChevronsUpDown />
        </TableCells>
      );
    },
    cell: ({ row }) => (
      <TableCells
        type="color"
        style={{
          background: `${row.getValue("updatedAt")}`,
        }}
      >
        <>
          {new Date(row.getValue("updatedAt")).toLocaleDateString("en-US", {
            year: "numeric",
            day: "numeric",
            month: "long",
          })}
        </>
      </TableCells>
    ),
    filterFn: dateRangeFilter,
  },
  {
    accessorKey: "actions",
    header: () => {},
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-8 w-8 float-right focus-visible:ring-0 bg-muted"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-1">
          <div className="flex flex-col w-full ">
            <Button
              variant="ghost"
              className="flex bg-transparent gap-2 justify-center  w-full"
            >
              <PencilLine />
              <div className="text-sm grow text-left font-normal">Edit</div>
            </Button>
            <Button
              variant="ghost"
              className="flex bg-transparent gap-2 justify-center  w-full"
            >
              <Trash2 />
              <div className="text-sm grow text-left font-normal">Delete</div>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const JourneyTable = () => {
  const { data }: { data: JourneyData[] } = useContext(NavigationPathContext);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  return (
    <>
      <TableHeader table={table} />
      <DataTable
        columns={columns}
        table={table}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
  );
};

export default JourneyTable;

const TableHeader = ({ table }: { table: Table<JourneyData> }) => {
  const [color, setColor] = useState("#000000");

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

  return (
    <Collapsible className="group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 py-4">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
            <Input
              placeholder="Search"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
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
              align="end"
              className="w-[256px] p-2 flex flex-col gap-2"
            >
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
                  setFilterDates((prev: any) => ({ ...prev, updatedAt: e }));
                }}
              />
              <hr className=" border-border" />
              <DropdownMenuItem className="w-full p-0">
                <Button
                  className="w-full"
                  onClick={() => {
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
              className=" border border-input-border font-normal"
              onClick={() => {
                table.getColumn("title")?.setFilterValue("");
              }}
            >
              Columns{" "}
              <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <>
                <Plus className="fill-white" /> Add Journey
              </>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[663px] h-fit max-w-[663px] gap-0">
            <DialogHeader>
              <DialogTitle className="text-lg">Add Journey </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-[106px] text-sm">
              <div className="grid gap-2 py-4">
                <div className="flex flex-col gap-[6px]">
                  <Label htmlFor="name" className="text-left">
                    Title
                  </Label>
                  <Input
                    id="name"
                    required
                    defaultValue="Pedro Duarte"
                    className="col-span-3 h-9"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <Label htmlFor="username" className="text-left">
                    Primary Colour
                  </Label>
                  <ColorPicker value={color} onColorChange={setColor} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <Label htmlFor="username" className="text-left">
                    Background Colour
                  </Label>
                  <ColorPicker value={color} onColorChange={setColor} />
                </div>
              </div>
              <Button className="w-fit px-6">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CollapsibleContent className="pb-4 flex gap-2">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <Button
                key={column.id}
                variant={"ghost"}
                className="bg-button-filter-background text-button-filter-text flex gap-1 items-center px-3  h-8 capitalize text-sm rounded-[12px] "
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
                {column.id}
              </Button>
            );
          })}
      </CollapsibleContent>
    </Collapsible>
  );
};
