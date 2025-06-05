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
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DataTable } from "../../table/table";
import columns from "./article-columns";
import ArticleTableHeader, { SelectionControlBar } from "./header";
import { Article } from "@/types";
import TableActions from "./table-actions";
import { Ban, Check, Globe, TriangleAlert, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import { ArticleContext } from "../../../context/article-data-provider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  changeStatusOfArticleOrVideo,
  DeleteArticle,
  getArticles,
} from "@/lib/services/article-services";

export const statusItems: {
  name: string;
  value: Article["status"];
  icon: ReactNode;
}[] = [
  {
    name: "Submit for Review",
    value: "Submitted for Review",
    icon: <Upload />,
  },
  {
    name: "Approve",
    value: "Approved",
    icon: <Check />,
  },
  {
    name: "Publish",
    value: "Published",
    icon: <Globe />,
  },
  {
    name: "Reject",
    value: "Rejected",
    icon: <X />,
  },
];

const ArticleTable = ({
  setArticles,
  loading,
  setLoading,
}: {
  setArticles: Dispatch<SetStateAction<Article[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { articles, updateArticles } = useContext(ArticleContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Article[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [action, setAction] = useState<"Delete" | Article["status"]>("Delete");

  async function fetchData() {
    try {
      if (articles.length == 0) {
        const _articles = await getArticles();
        updateArticles(_articles);
        setArticles(_articles);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      updateArticles([]);
      setArticles([]);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-red-500" />
            <span>Error Data Fetching</span>
          </div>
        ) as unknown as string,
        description: `Unable to fetch articles`,
        variant: "destructive",
        className: "border border-red-500 bg-red-50 text-red-900",
      });
      console.error("Error fetching collections or articles:", error);
    }
  }

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const tableData = useMemo(
    () => (loading ? Array(5).fill({}) : articles),
    [loading, articles]
  );

  const tableColumns = useMemo(
    () =>
      loading
        ? [
            ...columns.map((column: ColumnDef<Article>) => ({
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
              maxSize: 40,
              meta: {
                className: "sticky right-0",
              },
              enableHiding: false,
              enableResizing: false,
              cell: ({ row }: { row: Row<Article> }) => (
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
    // Pin the "actions" column to the right
  });

  const filteredRows = table.getFilteredRowModel().rows;

  useEffect(() => {
    if (!articles.length) return;
    let filteredData = articles;
    // Select rows based on current selection state
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    filteredData = filteredData.filter(
      (i: Article) => i.id && selectedRowKeys.includes(i.id)
    );
    setSelectedRows((prev) =>
      JSON.stringify(prev) === JSON.stringify(filteredData)
        ? prev
        : filteredData
    );

    // Update articles based on filtered table rows
    if (filteredData.length > 0) {
      setArticles(filteredData);
    } else {
      const currentRows = filteredRows.map((i) => i.original);
      setArticles(currentRows);
    }
  }, [articles, rowSelection, setArticles, table, filteredRows]);

  const activeAction = useMemo(() => {
    if (statusItems.some((i) => i.value === action)) {
      return statusItems.find((i) => i.value === action);
    }
  }, [action]);

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
              await DeleteArticle(id);
            }
          })
        );
        updatedRows = articles.filter(
          (col) => col.id && !selectedIds.includes(col.id)
        );

        // Update state and show success toast
        updateArticles(updatedRows);
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
        await Promise.all(
          selectedIds.map(async (id: number | null) => {
            if (id) {
              await changeStatusOfArticleOrVideo("article", id, action);
            }
          })
        );
        updatedRows = articles.map((col) => {
          if (col.id && selectedIds.includes(col.id)) {
            col.status = action;
          }
          return col;
        });

        // Update state and show success toast
        updateArticles(updatedRows);
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        setRowSelection({});
        toast({
          title: `${action} ${
            selectedRows.length > 1 ? "Articles" : "Article"
          }!`,
          description: `${selectedRows.length} ${
            selectedRows.length > 1 ? "Articles" : "Article"
          } successfully ${action}`,
        });
      }
    } catch (er) {
      setIsProcessing(false);
      toast({
        title: `Something went Wrong!`,
        description: ` ${er}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ArticleTableHeader
        table={table}
        // setOpenDialog={setOpenDialog}
        setSelectedRows={setSelectedRows}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={articles}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setAction={setAction}
        />
      )}
      <DataTable
        columns={columns}
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
        setOpen={(value) => {
          if (!isProcessing) {
            setDeleteDialogOpen(value);
          }
        }}
        dialog_title={
          getDialogText(activeAction?.name ?? "", selectedRows.length).title
        }
        dialog_description={
          getDialogText(activeAction?.name ?? "", selectedRows.length)
            .description
        }
        showLoader={isProcessing}
        variant={
          action === "Delete" || action == "Rejected"
            ? "destructive"
            : "secondary"
        }
        icon={activeAction?.icon ?? <Ban />}
        action={activeAction?.name ?? "Delete"}
        handleAction={handleBulkAction}
      />
    </>
  );
};

export default ArticleTable;

const getDialogText = (action: string | null, count: number) => ({
  title: `${action} ${count > 1 ? "Articles" : "Article"}?`,
  description: `Are you sure you want to ${action} ${
    count > 1 ? "these Articles" : "this Article"
  }?`,
});

