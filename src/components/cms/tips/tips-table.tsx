"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DataTable } from "../../table/table";
import TableHeader, { SelectionControlBar } from "./header";
import { Tip } from "@/types";
import TableActions from "./table-actions";
import { Ban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import columns from "./columns";
import AddOrEditTipForm from "./manage-tip";
import { TipsContext } from "@/context/tips-data-provider";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteTip, getTips } from "@/lib/services/tips-services";

const TipsTable = ({
  setTips,
  loading,
  setLoading,
}: {
  setTips: Dispatch<SetStateAction<Tip[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { tips, updateTips } = useContext(TipsContext);
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRows, setSelectedRows] = React.useState<Tip[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    if (tips.length == 0) {
      getTips().then((res) => {
        updateTips(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [tips, updateTips, setLoading]);

  const tableData = useMemo(
    () => (loading ? Array(5).fill({}) : tips),
    [loading, tips]
  );

  const tableColumns = useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<Tip>) => ({
              ...column,
              cell: () => (
                <Skeleton className="!min-w-full !min-h-[25px] animate-pulse" />
              ),
            })),
            {
              accessorKey: "actions",
              header: "Actions",
              enablePinning: true,
              maxSize: 40,
              meta: {
                className: "sticky right-0",
              },
              enableHiding: false,
              enableResizing: false,
              cell: () => (
                <div className="flex gap-2 items-center justify-center h-full">
                  <Skeleton className="!min-w-6 !min-h-6 animate-pulse" />
                  <Skeleton className="!min-w-6 !min-h-6 animate-pulse" />
                </div>
              ),
            },
          ]
        : [
            ...columns,
            {
              accessorKey: "actions",
              header: "Actions",
              maxSize: 40,
              enablePinning: true,
              meta: {
                className: "sticky right-0",
              },
              cell: ({ row }: { row: Row<Tip> }) => (
                <TableActions
                  row={row}
                  setSelectedRows={setSelectedRows}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                  setRowSelection={setRowSelection}
                  setOpenEditor={setOpenEditor}
                />
              ),
              enableHiding: false,
              enableResizing: false,
            },
          ],
    [loading]
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
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
  });
  const filteredRows = table.getFilteredRowModel().rows;

  useEffect(() => {
    if (!tips.length) return;
    let filteredData = tips;
    // Select rows based on current selection state
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    filteredData = filteredData.filter(
      (i) => i.id && selectedRowKeys.includes(i.id)
    );
    setSelectedRows((prev) =>
      JSON.stringify(prev) === JSON.stringify(filteredData)
        ? prev
        : filteredData
    );

    // Update tips based on filtered table rows
    if (filteredData.length > 0) {
      setTips(filteredData);
    } else {
      const currentRows = filteredRows.map((i) => i.original);
      setTips(currentRows);
    }
  }, [tips, rowSelection, table, setTips, filteredRows]);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    try {
      const selectedIds = [...new Set(selectedRows.map((i) => i.id))];

      await Promise.all(
        selectedIds.map(async (id) => {
          if (id) {
            await DeleteTip(id);
          }
        })
      );
      const updatedRows: Tip[] = tips.filter(
        (tip) => !selectedIds.includes(tip.id)
      );
      // Update state and show success toast
      updateTips(updatedRows);
      setRowSelection({});
      setDeleteDialogOpen(false);
      setIsProcessing(false);

      toast({
        title: `Deleted ${selectedRows.length > 1 ? "Tips" : "Tip"}!`,
        description: `${selectedRows.length} ${
          selectedRows.length > 1 ? "Tips" : "Tip"
        } successfully deleted`,
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Error deleting tip:", error);
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <TableHeader
        table={table}
        setOpen={setOpenEditor}
        setSelectedRows={setSelectedRows}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={tips}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpenEditor}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<Tip>[]}
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
        showLoader={isProcessing}
        handleAction={handleBulkAction}
      />

      <AddOrEditTipForm
        open={openEditor}
        setOpen={setOpenEditor}
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
