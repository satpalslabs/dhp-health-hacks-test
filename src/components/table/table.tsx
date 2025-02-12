"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  Table as TypeTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { JourneyData } from "@/lib/journey-services";

export type Journey = {
  id: string;
  title: string;
  "card-color": string;
  sections: string;
};

export function DataTable({
  columns,
  table,
  pagination,
  setPagination,
}: {
  columns: ColumnDef<JourneyData>[];
  table: TypeTable<JourneyData>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
}) {
  const router = useRouter();
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      if (header.id == "select" || header.id == "actions") {
        colSizes[`--header-${header.id}-size`] = 40;
        colSizes[`--col-${header.column.id}-size`] = 40;
      } else {
        colSizes[`--header-${header.id}-size`] = header.getSize();
        colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
      }
    }

    return colSizes;
  }, [table]); // ✅ Added 'table' to dependencies

  return (
    <div className="w-full flex flex-col grow overflow-hidden">
      <div className="rounded-md border grow w-full overflow-x-hidden ">
        <Table
          className="relative h-fit min-w-full"
          {...{
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
          <TableHeader className="bg-background sticky top-0 pointer-events-auto">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`relative ${header.id == "select" && "!w-4"}`}
                      style={{
                        width:
                          header.id !== "select"
                            ? `calc(var(--header-${header?.id}-size) * 1px)`
                            : "16px",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.id != "select" && (
                        <div
                          className="absolute h-full right-0 top-0 w-[1px] cursor-col-resize bg-border z-10 pointer-events-auto"
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                          }}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className=" border ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`!border-b cursor-pointer`}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => router.push(`/journey/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.id !== "select" ? "" : "!w-4"}`}
                      style={{
                        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-8">
          <div className="font-medium text-sm">Rows per page</div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="p-3 border-input-border font-normal flex gap-[26px] items-center focus-visible:ring-0"
                >
                  <div> {pagination.pageSize}</div>
                  <ChevronsUpDown className="stroke-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[10, 25, 50, 100].map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column}
                      className="capitalize"
                      checked={pagination.pageSize == column}
                      onCheckedChange={() =>
                        setPagination((prev) => ({ ...prev, pageSize: column }))
                      }
                    >
                      {column}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="font-medium text-sm">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: pagination.pageIndex - 1,
                }));
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: pagination.pageIndex + 1,
                }));
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: table.getPageCount() - 1,
                }));
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
