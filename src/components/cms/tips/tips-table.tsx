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
import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "../../table/table";
import TableHeader, { SelectionControlBar } from "./header";
import { Article, Tip, Pack } from "@/types";
import TableActions from "./table-actions";
import { Ban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import columns from "./columns";
import AddOrEditTipForm from "./manage-tip";
import { TipsContext } from "@/context/tips-data-provider";
import { ToastAction } from "@/components/ui/toast";
import { ArticleContext } from "@/context/article-data-provider";
import { PacksContext } from "@/context/pack-data-provider";

export interface TableRowType extends Tip {
  videosData: Article[];
  categoriesData: Pack[];
}
const TipsTable = ({
  setTips,
}: {
  setTips: React.Dispatch<React.SetStateAction<Tip[]>>;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { tips, updateTips } = useContext(TipsContext);
  const [data, setData] = useState<TableRowType[]>([]);
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
  const [selectedRows, setSelectedRows] = React.useState<TableRowType[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { articles } = useContext(ArticleContext);
  const { packs } = useContext(PacksContext);

  const table = useReactTable({
    data: data,
    columns: [
      ...columns,
      {
        accessorKey: "actions",
        header: () => {},
        cell: ({ row }) => (
          <TableActions
            row={row}
            setSelectedRows={setSelectedRows}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setRowSelection={setRowSelection}
            setOpenEditor={setOpen}
          />
        ),
      },
    ],
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

  useEffect(() => {
    setData(
      tips.map((i) => ({
        ...i,
        videosData: (i.videos ?? [])
          .map((video) =>
            articles.find(
              (article) =>
                article.id &&
                article.id == video &&
                article.content_type?.type == "content-video"
            )
          )
          .filter((i) => i != undefined),
        categoriesData: i.tips_categories
          .map((id) => packs.find((tip) => tip.id == id))
          .filter((i) => i != undefined),
      }))
    );
  }, [tips]);

  useEffect(() => {
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    const selectedRowsData = data.filter(
      (i: TableRowType) => i.id && selectedRowKeys.includes(i.id)
    );
    setSelectedRows(selectedRowsData);
  }, [rowSelection, tips]);

  useEffect(() => {
    if (!tips || tips.length === 0) return; // Prevent updates when data is empty
    const currentRows = table
      .getFilteredRowModel()
      .rows.map((i) => Number(i.id));

    const _tips: Tip[] = tips.filter(
      (i: Tip) => i.id && currentRows.includes(i.id)
    );
    if (selectedRows.length > 0) {
      setTips(selectedRows);
    } else {
      setTips(_tips);
    }
  }, [table, table.getFilteredRowModel().rows, tips, selectedRows]);

  const handleBulkAction = () => {
    const selectedIds = new Set(selectedRows.map((i) => i.id));

    if (selectedIds.size === 0) return; // Prevent running if nothing is selected

    // Process the update logic
    const updatedRows: Tip[] = data.filter((tip) => !selectedIds.has(tip.id));

    // Update state and show success toast
    updateTips(updatedRows);
    setRowSelection({});
    setDeleteDialogOpen(false);

    toast({
      title: `Deleted ${selectedRows.length > 1 ? "Tips" : "Tip"}!`,
      description: `${selectedRows.length} ${
        selectedRows.length > 1 ? "Tips" : "Tip"
      } successfully deleted`,
      action: <ToastAction altText="done">Done</ToastAction>,
    });
  };
  return (
    <>
      <TableHeader
        table={table}
        setOpen={setOpen}
        setSelectedRows={setSelectedRows}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={data}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpen}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<TableRowType>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
        rowClick={(d) => {
          if ("id" in d) {
            if (!Object.keys(rowSelection).includes(String(d.id))) {
              setRowSelection((prev) => ({ ...prev, [String(d.id)]: true }));
            } else {
              setRowSelection((prev) => {
                const updatedSelection: Record<string, boolean> = { ...prev };
                delete updatedSelection[String(d.id)];
                return updatedSelection;
              });
            }
          }
        }}
      />
      <ActionConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        dialog_title={getDialogText(selectedRows.length).title}
        dialog_description={getDialogText(selectedRows.length).description}
        variant={"destructive"}
        icon={<Ban />}
        action={"Delete"}
        handleAction={handleBulkAction}
      />

      <AddOrEditTipForm
        open={open}
        setOpen={setOpen}
        editTip={selectedRows.length > 0 ? selectedRows?.[0]?.id : undefined}
        handleSubmit={() => {
          setSelectedRows([]);
          toast({
            title: `Created Tip!`,
            description: `Your new tip has been successfully created.`,
            action: <ToastAction altText="done">Done</ToastAction>,
          });
        }}
      />
    </>
  );
};

export default TipsTable;

const getDialogText = (count: number) => ({
  title: `Delete ${count > 1 ? "Tips" : "tip"}?`,
  description: `Are you sure you want to Delete ${
    count > 1 ? "these Tips" : "this tip"
  }?`,
});
