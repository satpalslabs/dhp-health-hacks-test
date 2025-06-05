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
import QuizTableHeader, { SelectionControlBar } from "./header";
import { Quiz } from "@/types";
import TableActions from "./table-actions";
import { Ban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import { QuizContext } from "@/context/quiz-data-provider";
import columns from "./columns";
import AddOrEditQuizForm from "./manage-quiz";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteQuiz, getQuizzes } from "@/lib/services/quiz-services";

const QuizTable = ({
  setQuizzes,
  loading,
  setLoading,
}: {
  setQuizzes: Dispatch<SetStateAction<Quiz[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { quizzes, updateQuizzes } = useContext(QuizContext);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Quiz[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    if (quizzes.length == 0) {
      getQuizzes().then((res) => {
        updateQuizzes(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [quizzes, updateQuizzes, setLoading]);

  const tableData = useMemo(
    () => (loading ? Array(5).fill({}) : quizzes),
    [loading, quizzes]
  );

  const tableColumns = useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<Quiz>) => ({
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
              cell: ({ row }: { row: Row<Quiz> }) => (
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

  // Extract filtered rows to a variable for useEffect dependency
  const filteredRows = table.getFilteredRowModel().rows;

  useEffect(() => {
    if (!quizzes.length) return;
    let filteredData = quizzes;
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

    // Update quizzes based on filtered table rows
    if (filteredData.length > 0) {
      setQuizzes(filteredData);
    } else {
      const currentRows = filteredRows.map((i) => i.original);
      setQuizzes(currentRows);
    }
  }, [quizzes, table, rowSelection, setQuizzes, filteredRows]);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    try {
      const selectedIds = [...new Set(selectedRows.map((i) => i.id))];

      await Promise.all(
        selectedIds.map(async (id) => {
          if (id) {
            await DeleteQuiz(id);
          }
        })
      );
      const updatedRows: Quiz[] = quizzes.filter(
        (quiz) => !selectedIds.includes(quiz.id)
      );
      // Update state and show success toast
      updateQuizzes(updatedRows);
      setRowSelection({});
      setDeleteDialogOpen(false);
      setIsProcessing(false);

      toast({
        title: `Deleted ${selectedRows.length > 1 ? "Quizzes" : "Quiz"}!`,
        description: `${selectedRows.length} ${
          selectedRows.length > 1 ? "Quizzes" : "Quiz"
        } successfully deleted`,
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Error deleting quiz:", error);
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <QuizTableHeader
        table={table}
        setOpen={setOpenEditor}
        setSelectedRows={setSelectedRows}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={quizzes}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setOpenEditor={setOpenEditor}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<Quiz>[]}
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
        showLoader={isProcessing}
        action={"Delete"}
        handleAction={handleBulkAction}
      />

      <AddOrEditQuizForm
        open={openEditor}
        setOpen={setOpenEditor}
        editQuiz={selectedRows.length > 0 ? selectedRows?.[0]?.id : undefined}
        handleSubmit={() => {
          setSelectedRows([]);
        }}
      />
    </>
  );
};

export default QuizTable;

const getDialogText = (count: number) => ({
  title: `Delete ${count > 1 ? "Quizzes" : "Quiz"}?`,
  description: `Are you sure you want to Delete ${
    count > 1 ? "these Quizzes" : "this Quiz"
  }?`,
});
