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
import { DetailedSubSection, SubSection } from "@/types";
import TableActions from "./table-actions";
import { Ban, Globe, TriangleAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import columns from "./columns";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import AddOrEditSubSection from "./manage-sub-section";
import { SubSectionContext } from "@/context/sub-section-data-provider";
import { DataTable } from "@/components/table/table";
import ActionConfirmationDialog from "../../journey/confirmation-dialog";
import {
  DeleteSubsection,
  getSubSections,
} from "@/lib/services/sub-section-service";
import { Skeleton } from "@/components/ui/skeleton";

const SubSectionsTable = ({
  setSubSections,
  loading,
  setLoading,
}: {
  setSubSections: (data: DetailedSubSection[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { subSections, updateSubSections } = useContext(SubSectionContext);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const [selectedRows, setSelectedRows] = React.useState<DetailedSubSection[]>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");
  const router = useRouter();

  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : subSections),
    [loading, subSections]
  );

  const tableColumns = React.useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<DetailedSubSection>) => ({
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
              enablePinning: true,
              meta: {
                className: "sticky right-0",
              },
              cell: ({ row }: { row: Row<DetailedSubSection> }) => (
                <TableActions
                  row={row}
                  setAction={setAction}
                  setSelectedRows={setSelectedRows}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                  setRowSelection={setRowSelection}
                  setOpenEditor={setOpen}
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

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchSubSections();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchSubSections() {
    if (subSections.length > 0) {
      setLoading(false);
      return; // Prevent fetching if data is already present
    }
    setLoading(true);
    getSubSections().then((res) => {
      updateSubSections(res);
      setSubSections(res as unknown as DetailedSubSection[]);
      setLoading(false);
    });
  }
  const filteredRows = table.getFilteredRowModel().rows;

  useEffect(() => {
    if (!subSections.length) return;
    if (!loading) {
      let filteredData = subSections as unknown as DetailedSubSection[];
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
        setSubSections(filteredData);
      } else {
        const currentRows = filteredRows.map((i) => i.original);
        setSubSections(currentRows);
      }
    }
  }, [subSections, rowSelection, loading, setSubSections, table, filteredRows]);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    try {
      const selectedIds = new Set(selectedRows.map((i) => i.id));

      if (selectedIds.size === 0) return; // Prevent running if nothing is selected
      let updatedRows: SubSection[] = [];
      if (action === "Delete") {
        const sub_sections = subSections.filter((_subSection) =>
          selectedIds.has(_subSection.id)
        );
        if (
          sub_sections.some((subSection) => subSection.collections.length > 0)
        ) {
          setDeleteDialogOpen(false);
          setIsProcessing(false);
          setShowErrorDialog(true);
          return null;
        } else {
          await Promise.all(
            sub_sections.map(async (subsection) => {
              if (subsection.id) {
                await DeleteSubsection(subsection.id);
              }
            })
          );
          updatedRows = subSections.filter(
            (_sub_section) => !selectedIds.has(_sub_section.id)
          );
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
      updateSubSections(updatedRows);
      setRowSelection({});
      setDeleteDialogOpen(false);
      setIsProcessing(false);
      toast({
        title: `${action}ed ${
          selectedRows.length > 1 ? "Sub Sections" : "Sub Section"
        }!`,
        description: `Your ${selectedRows.length} ${
          selectedRows.length > 1 ? "Sub Sections" : "Sub Section"
        } has been successfully ${action === "Delete" ? "deleted" : "updated"}`,
      });
    } catch (error) {
      setDeleteDialogOpen(false);
      setIsProcessing(false);
      console.error("Error deleting Subsection:", error);
      toast({
        title: "Error",
        description: `An error occurred while deleting the Subsection. ${error}`,
        variant: "destructive",
      });
    }
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
          data={subSections as unknown as DetailedSubSection[]}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpen}
          setAction={setAction}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<DetailedSubSection>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
        rowClick={(d) => {
          if ("id" in d) {
            nProgress.start();
            router.push(`/sub-sections/${d.id}`);
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
          selectedRows.length > 0 ? "Sub Sections" : "Sub Section"
        }`}
        dialog_description={`${
          selectedRows.length > 1
            ? "Some <b>Sub Sections</b>"
            : "This <b>Sub Section</b>"
        } contains <b>Collections</b> and cannot be deleted. To proceed, please remove all items within this sub section first, then try again. `}
        variant={action === "Delete" ? "destructive" : "secondary"}
        icon={<TriangleAlert />}
      />

      <AddOrEditSubSection
        open={open}
        setOpen={(e) => {
          setOpen(e);
          setSelectedRows([]);
        }}
        editSub_Section={
          selectedRows.length > 0 ? selectedRows?.[0]?.id : undefined
        }
        handleSubmit={() => {
          setLoading(true);
          setSelectedRows([]);
          getSubSections().then((res) => {
            updateSubSections(res);
            setLoading(false);
          });
        }}
      />
    </>
  );
};

export default SubSectionsTable;

const getDialogText = (action: string, count: number) => ({
  title: `${action} Sub ${count > 1 ? "Sections" : "Section"}?`,
  description: `${
    action == "Delete"
      ? `Are you sure you want to delete ${
          count > 1 ? "theses sub sections" : "this sub section"
        }? This action cannot be undone.`
      : `This will ${action} ${
          count > 1 ? "theses sub sections" : "the entire sub section"
        } and all its contents, making them inaccessible to users. <br /> Are you sure want to proceed?`
  }`,
});

const actionIcons: Record<string, JSX.Element> = {
  Delete: <TriangleAlert />,
  Publish: <Globe />,
  Unpublish: <Ban />,
};
