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
import { DetailedSection, Section } from "@/types";
import TableActions from "./table-actions";
import { Ban, Globe, TriangleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import columns from "./columns";
import { SectionContext } from "@/context/section-data-provider";
import AddOrEditSection from "./manage-section";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import ActionConfirmationDialog from "../../journey/confirmation-dialog";
import { DataTable } from "@/components/table/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteSection, getSections } from "@/lib/services/section-service";

const SectionsTable = ({
  setSections,
  loading,
  setLoading,
}: {
  setSections: React.Dispatch<React.SetStateAction<DetailedSection[]>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { sections, updateSections } = useContext(SectionContext);
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
  const [selectedRows, setSelectedRows] = React.useState<DetailedSection[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");
  const router = useRouter();

  const tableColumns = React.useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<DetailedSection>) => ({
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
              cell: ({ row }: { row: Row<DetailedSection> }) => (
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
    [loading, columns]
  );
  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : sections),
    [loading, sections]
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
      getSections().then((res) => {
        updateSections(res);
        setSections(res as unknown as DetailedSection[]);
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    const selectedRowsData = sections.filter(
      (i) => i.id && selectedRowKeys.includes(i.id)
    );
    setSelectedRows(selectedRowsData as unknown as DetailedSection[]);
  }, [rowSelection, sections]);

  useEffect(() => {
    if (!sections || sections.length === 0) return; // Prevent updates when data is empty
    const currentRows = table
      .getFilteredRowModel()
      .rows.map((i) => Number(i.id));

    const _sections = sections.filter(
      (i) => i.id && currentRows.includes(i.id)
    );
    if (selectedRows.length > 0) {
      setSections(selectedRows);
    } else {
      setSections(_sections as unknown as DetailedSection[]);
    }
  }, [table, table.getFilteredRowModel().rows, sections, selectedRows]);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    try {
      const selectedIds = new Set(selectedRows.map((i) => i.id));

      if (selectedIds.size === 0) return; // Prevent running if nothing is selected

      // const requiredFields: (keyof DetailedSection)[] = [
      //   "section_name",
      //   "section_description",
      //   "associated_conditions",
      // ];

      // // Check if any selected article is missing required fields
      // const hasMissingFields = selectedRows.some((article) =>
      //   requiredFields.some((field) => !article[field])
      // );

      // if (action === "Publish" && hasMissingFields) {
      //   setDeleteDialogOpen(false);
      //   return toast({
      //     title: "Unable to Publish",
      //     description: `You're almost there! ${
      //       selectedRows.length > 1
      //         ? "Some selected drafts have"
      //         : "Selected draft has"
      //     } missing data. Fill in the required fields to proceed with publishing.`,
      //     draggable: true,
      //     className: "[&_.font-semibold]:text-[red]",
      //   });
      // }

      // Process the update logic
      let updatedRows: Section[] = [];
      if (action === "Delete") {
        const _sections = sections.filter((section) =>
          selectedIds.has(section.id)
        );
        if (
          _sections.some(
            (section) =>
              section.collections.length > 0 || section.sub_sections.length > 0
          )
        ) {
          setDeleteDialogOpen(false);
          setShowErrorDialog(true);
          return null;
        } else {
          await Promise.all(
            _sections.map(async (section) => {
              if (section.id) {
                await DeleteSection(section.id);
              }
            })
          );
          updatedRows = sections.filter(
            (section) => !selectedIds.has(section.id)
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
      updateSections(updatedRows);
      setRowSelection({});
      setDeleteDialogOpen(false);
      toast({
        title: `${action}ed ${
          selectedRows.length > 1 ? "Sections" : "Section"
        }!`,
        description: `Your ${selectedRows.length} ${
          selectedRows.length > 1 ? "Sections" : "Section"
        } has been successfully ${action === "Delete" ? "deleted" : "updated"}`,
      });
    } catch (error) {
      setDeleteDialogOpen(false);
      setIsProcessing(false);
      console.error("Error deleting Section:", error);
      toast({
        title: "Error",
        description: `An error occurred while deleting the Section. ${error}`,
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
          data={sections as unknown as DetailedSection[]}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpen}
          setAction={setAction}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<DetailedSection>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
        rowClick={(d) => {
          if ("id" in d) {
            nProgress.start();
            router.push(`/sections/${d.id}`);
          }
        }}
      />
      <ActionConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        showLoader={isProcessing}
        dialog_title={getDialogText(action, selectedRows.length).title}
        dialog_description={
          getDialogText(action, selectedRows.length).description
        }
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
          selectedRows.length > 0 ? "Sections" : "Section"
        }`}
        dialog_description={`${
          selectedRows.length > 1
            ? "Some <b>Sections</b>"
            : "This <b>Section</b>"
        } contains <b>Sub sections</b> or <b>Collections</b> and cannot be deleted. To proceed, please remove all items within this section first, then try again. `}
        variant={action === "Delete" ? "destructive" : "secondary"}
        icon={<TriangleAlert />}
      />

      <AddOrEditSection
        open={open}
        setOpen={(e) => {
          setOpen(e);
          setSelectedRows([]);
        }}
        editSection={
          selectedRows.length > 0 ? selectedRows?.[0]?.id : undefined
        }
        handleSubmit={() => {
          setLoading(true);
          setSelectedRows([]);
          getSections().then((res) => {
            updateSections(res);
            setLoading(false);
          });
        }}
      />
    </>
  );
};

export default SectionsTable;

const getDialogText = (action: string, count: number) => ({
  title: `${action} ${count > 1 ? "Sections" : "Section"}?`,
  description: `${
    action == "Delete"
      ? `Are you sure you want to delete ${
          count > 1 ? "theses sections" : "this section"
        }? This action cannot be undone.`
      : `This will ${action} ${
          count > 1 ? "theses sections" : "the entire section"
        } and all its contents, making them inaccessible to users. <br /> Are you sure want to proceed?`
  }`,
});

export const actionIcons: Record<string, JSX.Element> = {
  Delete: <TriangleAlert />,
  Publish: <Globe />,
  Unpublish: <Ban />,
};
