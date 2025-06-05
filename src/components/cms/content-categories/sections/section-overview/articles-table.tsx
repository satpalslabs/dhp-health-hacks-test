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
import React, { useEffect, useState } from "react";
import { Article } from "@/types";
import { Ban, Globe, TriangleAlert } from "lucide-react";
import TableHeader, { SelectionControlBar } from "./header";
import { DataTable } from "@/components/table/table";
import ActionConfirmationDialog from "../../../journey/confirmation-dialog";
import { ArticleTableRow } from ".";
import columns from "./columns";
import TableActions from "./table-actions";
import { toast } from "@/hooks/use-toast";
import { DeleteVideo } from "@/lib/services/video-services.";
import { DeleteArticle } from "@/lib/services/article-services";

const SectionsTable = ({
  initialArticles,
  setArticles,
}: {
  initialArticles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = useState(initialArticles);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedRows, setSelectedRows] = React.useState<ArticleTableRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        accessorKey: "actions",
        header: "Actions",
        enablePinning: true,
        meta: {
          className: "sticky right-0",
        },
        enableHiding: false,
        enableResizing: false,
        cell: ({ row }) => (
          <TableActions
            row={row}
            setAction={setAction}
            setSelectedRows={setSelectedRows}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setRowSelection={setRowSelection}
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
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
  });

  useEffect(() => {
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    const selectedRowsData = data.filter(
      (i: Article) => i.id && selectedRowKeys.includes(i.id)
    );
    setSelectedRows(selectedRowsData);
  }, [rowSelection, data]);

  useEffect(() => {
    const currentRows = table
      .getFilteredRowModel()
      .rows.map((i) => Number(i.id));

    const _articles: ArticleTableRow[] = data.filter(
      (i: ArticleTableRow) => i.id && currentRows.includes(i.id)
    );
    if (selectedRows.length > 0) {
      setArticles(selectedRows);
    } else {
      setArticles(_articles);
    }
  }, [table, data, selectedRows,setArticles]);

  const handleBulkAction = async () => {
    setIsProcessing(true);

    try {
      const selectedIds = [...new Set(selectedRows.map((i) => i.id))];

      if (selectedIds.length === 0) return; // Prevent running if nothing is selected

      let updatedRows: Article[] = [];
      if (action === "Delete") {
        await Promise.all(
          selectedIds.map(async (id: number | null) => {
            if (id) {
              const data_ = data.find((i) => i.id == id);
              if (data_?.content_type?.type == "content-video") {
                await DeleteVideo(id);
              } else {
                await DeleteArticle(id);
              }
            }
          })
        );
        updatedRows = data.filter(
          (article) => !selectedIds.includes(article.id)
        );
        // Update state and show success toast
        setData(updatedRows);
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        setRowSelection({});
        toast({
          title: `${action}ed ${
            selectedRows.length > 1 ? "Articles" : "Article"
          }!`,
          description: `${selectedRows.length} ${
            selectedRows.length > 1 ? "Articles" : "Article"
          } successfully ${action === "Delete" ? "deleted" : "updated"}`,
        });
      } else {
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        setRowSelection({});
        return toast({
          title: `Unable to ${action} `,
          description: `Doesn't support yet`,
          draggable: true,
          className: "[&_.font-semibold]:text-[red]",
        });
      }
    } catch (er) {
      setIsProcessing(false);
      setRowSelection({});
      setDeleteDialogOpen(false);
      toast({
        title: `Something went Wrong!`,
        description: `Unable to ${action} ${
          selectedRows.length > 1 ? "Articles" : "Article"
        }. Please try again later. ${er}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <TableHeader table={table} setSelectedRows={setSelectedRows} />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={data}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setAction={setAction}
        />
      )}
      <DataTable
        columns={columns as ColumnDef<ArticleTableRow>[]}
        table={table}
        pagination={pagination}
        action={setPagination}
        rowClick={(d) => {
          if ("id" in d) {
            if (!Object.keys(rowSelection).includes(String(d.id))) {
              setRowSelection((prev) => ({ ...prev, [String(d.id)]: true }));
            } else {
              setRowSelection((prev) => {
                const updatedSelection = { ...prev };
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
    </>
  );
};

export default SectionsTable;

const getDialogText = (action: string, count: number) => ({
  title: `${action} ${count > 1 ? "Articles" : "Article"}?`,
  description: `${
    action == "Delete"
      ? `Are you sure you want to delete ${
          count > 1 ? "theses articles" : "this article"
        }? This action cannot be undone.`
      : `This will ${action} ${
          count > 1 ? "theses articles" : "the entire article"
        } and all its contents, making them inaccessible to users. <br /> Are you sure want to proceed?`
  }`,
});

const actionIcons: Record<string, JSX.Element> = {
  Delete: <TriangleAlert />,
  Publish: <Globe />,
  Unpublish: <Ban />,
};
