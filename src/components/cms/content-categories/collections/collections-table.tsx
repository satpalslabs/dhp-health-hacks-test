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
import React, { useContext, useEffect, useState } from "react";
import TableHeader, { SelectionControlBar } from "./header";
import { Collection } from "@/types";
import TableActions from "./table-actions";
import { Ban, Globe, TriangleAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import columns from "./columns"; // Ensure columns is typed as ColumnDef<Collection>[]
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { CollectionContext } from "@/context/collection-data-provider";
import { DataTable } from "@/components/table/table";
import ActionConfirmationDialog from "../../journey/confirmation-dialog";
import AddOrEditCollection from "./manage-collection";
import {
  DeleteCollection,
  getCollections,
} from "@/lib/services/collection-services";
import { Skeleton } from "@/components/ui/skeleton";

const CollectionTable = ({
  setCollections,
  loading,
  setLoading,
}: {
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { collections, updateCollections } = useContext(CollectionContext);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Collection[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");

  async function fetchCollections() {
    if (collections.length > 0) {
      setLoading(false);
      return; // Prevent fetching if data is already present
    }
    setLoading(true);
    getCollections().then((res) => {
      updateCollections(res);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : collections),
    [loading, collections]
  );

  const tableColumns = React.useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<Collection>) => ({
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
              cell: ({ row }: { row: Row<Collection> }) => (
                <TableActions
                  row={row}
                  setAction={setAction}
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

  // Extract filtered rows to a variable for useEffect dependency
  const filteredRows = table.getFilteredRowModel().rows;

  // Update collections when the table data changes
  useEffect(() => {
    if (!collections.length) return;
    let filteredData = collections;
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

    // Update articles based on filtered table rows
    if (filteredData.length > 0) {
      setCollections(filteredData);
    } else {
      const currentRows = filteredRows.map((i) => i.original);
      setCollections(currentRows);
    }
  }, [collections, rowSelection, setCollections, table, filteredRows]);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    try {
      const selectedIds = new Set(selectedRows.map((i) => i.id));
      let updatedRows: Collection[] = [];

      if (action === "Delete") {
        const _collections = collections.filter((collection) =>
          selectedIds.has(collection.id)
        );
        if (_collections.some((subSection) => subSection.articles.length > 0)) {
          setDeleteDialogOpen(false);
          setIsProcessing(false);
          setShowErrorDialog(true);
          return null;
        } else {
          await Promise.all(
            _collections.map(async (collection) => {
              if (collection.id) {
                await DeleteCollection(collection.id);
              }
            })
          );
          updatedRows = collections.filter((col) => !selectedIds.has(col.id));
        }
      } else {
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        return toast({
          title: "Unable to Publish",
          description: `Doesn't support yet`,
          draggable: true,
          className: "[&_.font-semibold]:text-[red]",
        });
      }

      // Update state and show success toast
      updateCollections(updatedRows);
      setRowSelection({});
      setDeleteDialogOpen(false);
      setIsProcessing(false);
      toast({
        title: `${action}ed ${
          selectedRows.length > 1 ? "Collections" : "Collection"
        }!`,
        description: `Your ${selectedRows.length} ${
          selectedRows.length > 1 ? "Collections" : "Collection"
        } has been successfully ${action === "Delete" ? "deleted" : "updated"}`,
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Error deleting collections:", error);
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
          data={collections}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpenEditor}
          setAction={setAction}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<Collection>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
        rowClick={(d) => {
          if ("id" in d) {
            nProgress.start();
            router.push(`/collections/${d.id}`);
          }
        }}
      />
      <ActionConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        dialog_title={getDialogText(action, selectedRows.length).title}
        dialog_description={
          getDialogText(action, selectedRows.length).description
        }
        showLoader={isProcessing}
        variant={action === "Delete" ? "destructive" : "secondary"}
        icon={actionIcons[action] || <Ban />}
        action={action ?? "Delete"}
        handleAction={handleBulkAction}
      />
      {/* Show Error Dialog if getting any error while deleting a section (e.g: Suppose if any section has collections and we are trying to delete section without deleting collections) */}
      <ActionConfirmationDialog
        open={showErrorDialog}
        setOpen={setShowErrorDialog}
        dialog_title={`Unable to Delete ${
          selectedRows.length > 0 ? "Collections" : "Collection"
        }`}
        dialog_description={`${
          selectedRows.length > 1
            ? "Some <b>Collections</b>"
            : "This <b>Collection</b>"
        } contains <b>Articles</b> and cannot be deleted. To proceed, please remove all items within this collection first, then try again. `}
        variant={action === "Delete" ? "destructive" : "secondary"}
        icon={<TriangleAlert />}
      />

      <AddOrEditCollection
        open={openEditor}
        setOpen={(e: boolean) => {
          setSelectedRows([]);
          setOpenEditor(e);
        }}
        editCollection={
          selectedRows.length > 0 ? selectedRows?.[0]?.id : undefined
        }
        handleSubmit={(id) => {
          setLoading(true);
          setSelectedRows([]);
          if (id) {
            getCollections().then((res) => {
              updateCollections(res);
              setLoading(false);
            });
          }
        }}
      />
    </>
  );
};

export default CollectionTable;

const getDialogText = (action: string, count: number) => ({
  title: `${action} ${count > 1 ? "collections" : "collection"}?`,
  description: `${
    action == "Delete"
      ? `Are you sure you want to delete ${
          count > 1 ? "theses collections" : "this collection"
        }? This action cannot be undone.`
      : `This will ${action} ${
          count > 1 ? "theses collections" : "the entire collection"
        } and all its contents, making them inaccessible to users. <br /> Are you sure want to proceed?`
  }`,
});

const actionIcons: Record<string, JSX.Element> = {
  Delete: <TriangleAlert />,
  Publish: <Globe />,
  Unpublish: <Ban />,
};
