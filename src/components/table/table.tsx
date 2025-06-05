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

type DataTableProps<TData> = {
  action: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  columns: ColumnDef<TData>[];
  table: TypeTable<TData>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  rowClick?: (e: TData) => void;
};

export function DataTable<TData>({
  action,
  columns,
  table,
  pagination,
  rowClick,
}: DataTableProps<TData>) {
  const tableWrapperRef = React.useRef<HTMLDivElement>(null);
  const [showRightShadow, setShowRightShadow] = React.useState(false);

  const checkForScrollShadow = () => {
    if (tableWrapperRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = tableWrapperRef.current;
      // Show right shadow if there's more content to scroll to
      setShowRightShadow(
        scrollWidth > clientWidth && scrollWidth > scrollLeft + clientWidth
      );
    }
  };

  React.useEffect(() => {
    // Check on mount
    checkForScrollShadow();

    // Add event listener for scroll
    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("scroll", checkForScrollShadow);
    }

    // Add event listener for resize
    window.addEventListener("resize", checkForScrollShadow);

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("scroll", checkForScrollShadow);
      }
      window.removeEventListener("resize", checkForScrollShadow);
    };
  }, []);

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      if (header.id === "select") {
        colSizes[`--header-${header.id}-size`] = 40; // Fixed width for select
        colSizes[`--col-${header.column.id}-size`] = 40;
      } else if (header.id === "actions") {
        colSizes[`--header-${header.id}-size`] = 80; // Fixed width for actions
        colSizes[`--col-${header.column.id}-size`] = 80;
      } else {
        colSizes[`--header-${header.id}-size`] = header.getSize();
        colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
      }
    }

    return colSizes;
  }, [table]); // ✅ Use a stable reference to avoid re-renders

  const tableRows = table?.getRowModel().rows;
  return (
    <div className="w-full flex flex-col grow overflow-hidden">
      <div className="rounded-md border grow w-full overflow-x-hidden ">
        <div
          ref={tableWrapperRef}
          className="relative w-full h-full overflow-auto"
        >
          <Table
            className="relative h-fit w-full min-w-full"
            {...{
              style: {
                ...columnSizeVars, //Define column sizes on the <table> element
                width: table.getTotalSize(),
              },
            }}
          >
            <TableHeader className="bg-background sticky top-0 pointer-events-auto z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`relative ${
                          header.id === "select" ? "!w-10" : ""
                        } ${header.id === "actions" ? "!w-20" : ""} ${
                          header.column.getIsPinned()
                            ? "sticky p-0 right-0 top-0 z-[50] bg-background [&_.absolute]:hidden"
                            : ""
                        }`}
                        style={{
                          width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        }}
                      >
                        <div
                          className={`transition-shadow ${
                            header.column.getIsPinned()
                              ? `h-full border-l border-b p-4 -mb-[2px]`
                              : "bg-transparent"
                          }`}
                          style={{
                            boxShadow:
                              header.column.getIsPinned() && showRightShadow
                                ? "-6px 0px 6px 0px rgba(0, 0, 0, 0.10)"
                                : undefined,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                        {header.id !== "select" && header.id !== "actions" && (
                          <div
                            className="absolute h-full right-[-1px] top-0 w-[1px] cursor-col-resize bg-border z-10 pointer-events-auto"
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
            <TableBody className="relative">
              {tableRows?.length ? (
                tableRows.map((row, ix) => (
                  <TableRow
                    key={ix}
                    className={`!border-b border-border cursor-pointer `}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      if (rowClick) {
                        rowClick(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`p-0 ${
                          cell.id.includes("select") ? "!w-10" : ""
                        } ${cell.id.includes("actions") ? "!w-20" : ""} ${
                          cell.column.getIsPinned()
                            ? "sticky right-0 shadow-sm bg-background p-0"
                            : ""
                        }`}
                        style={{
                          width: cell.column.getIsPinned()
                            ? "fit-content"
                            : `calc(var(--col-${cell.column.id}-size) * 1px)`,
                        }}
                      >
                        <div
                          className={` border-l  border-border h-full ${
                            showRightShadow ? "shadow-sm" : ""
                          } ${
                            cell.column.getIsPinned()
                              ? " border-b -mb-[1px]"
                              : "p-4 -mb-[2px]"
                          }`}
                          style={{
                            boxShadow:
                              cell.column.getIsPinned() && showRightShadow
                                ? "-6px 3px 10px 0px rgba(0, 0, 0, 0.10)"
                                : "none",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
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
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
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
                        action((prev) => ({ ...prev, pageSize: column }))
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
                action((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                action((prev) => ({
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
                action((prev) => ({
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
                action((prev) => ({
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
