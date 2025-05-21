"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { NHSCondition } from "@/types";
import { DataTable } from "@/components/table/table";
import columns from "./columns";
import TableHeader from "./header";
import { Skeleton } from "@/components/ui/skeleton";

const DetailedTable = ({
  data,
  loading,
}: {
  data: NHSCondition[];
  loading: boolean;
}) => {
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

  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : data),
    [loading, data]
  );
  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((column: ColumnDef<NHSCondition>) => ({
            ...column,
            cell: () => (
              <Skeleton className="!min-w-full !min-h-[25px] animate-pulse" />
            ),
          }))
        : columns,
    [loading, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getRowId: (originalRow) => originalRow.id?.toString() ?? "", // Ensure row ID is uniquely defined
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
    onRowSelectionChange: (e) => {
      setRowSelection(e);
    },
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
        columns={columns as ColumnDef<NHSCondition>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
      />
    </>
  );
};

export default DetailedTable;
