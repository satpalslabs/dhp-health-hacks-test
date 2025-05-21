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
import { DataTable } from "../../table/table";
import columns from "./article-columns";
import ArticleTableHeader, { SelectionControlBar } from "./header";
import { Article } from "@/types";
import TableActions from "./table-actions";
import { Ban, Globe, TriangleAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import { ArticleContext } from "../../../context/article-data-provider";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteArticle, getArticles } from "@/lib/services/article-services";
import { DeleteVideo, getVideos } from "@/lib/services/video-services.";

const ArticleTable = ({
  setArticles,
  loading,
  setLoading,
}: {
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const { articles: initialData, updateArticles: setData } =
    useContext(ArticleContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actualData, setActualData] = useState<Article[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<Article[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [action, setAction] = React.useState<
    "Delete" | "Rejected" | "Approved"
  >("Delete");

  const fetchData = async () => {
    try {
      const fetchData = pathname.includes("article") ? getArticles : getVideos;
      const articles = await fetchData();
      setActualData(articles);
      setData(articles);
      setArticles(articles);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setActualData([]);
      setData([]);
      setArticles([]);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-red-500" />
            <span>Error Data Fetching</span>
          </div>
        ) as unknown as string,
        description: `Unable to fetch ${
          pathname.includes("article") ? "articles" : "Videos"
        }.`,
        variant: "destructive",
        className: "border border-red-500 bg-red-50 text-red-900",
      });
      console.error("Error fetching collections or articles:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : actualData),
    [loading, actualData]
  );
  const tableColumns = React.useMemo(
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
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
    // Pin the "actions" column to the right
  });

  useEffect(() => {
    let isMounted = true;
    if (!initialData.length) return;
    const filteredData = initialData;
    if (isMounted) {
      setActualData((prevData) =>
        JSON.stringify(prevData) === JSON.stringify(filteredData)
          ? prevData
          : filteredData
      );
    }

    // Select rows based on current selection state
    const selectedRowKeys = Object.keys(rowSelection).map(Number);
    const selectedRowsData = filteredData.filter(
      (i: Article) => i.id && selectedRowKeys.includes(i.id)
    );

    if (isMounted) {
      setSelectedRows((prev) =>
        JSON.stringify(prev) === JSON.stringify(selectedRowsData)
          ? prev
          : selectedRowsData
      );
    }

    // Update articles based on filtered table rows
    if (isMounted && filteredData.length > 0) {
      const currentRows = table
        .getFilteredRowModel()
        .rows.map((i) => Number(i.id));
      const articles: Article[] = filteredData.filter(
        (i: Article) => i.id && currentRows.includes(i.id)
      );

      setArticles((prev) =>
        JSON.stringify(prev) === JSON.stringify(articles) ? prev : articles
      );
    }

    return () => {
      isMounted = false;
    };
  }, [initialData, rowSelection, table.getFilteredRowModel().rows]);

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
              if (pathname.includes("articles")) {
                await DeleteArticle(id);
              } else {
                await DeleteVideo(id);
              }
            }
          })
        );
        updatedRows = actualData.filter(
          (col) => col.id && !selectedIds.includes(col.id)
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
      <ArticleTableHeader
        table={table}
        // setOpenDialog={setOpenDialog}
        setSelectedRows={setSelectedRows}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={actualData}
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
        dialog_title={getDialogText(action, selectedRows.length).title}
        dialog_description={
          getDialogText(action, selectedRows.length).description
        }
        showLoader={isProcessing}
        variant={action === "Delete" ? "destructive" : "secondary"}
        icon={actionIcons[action] || <Ban />}
        action={
          action == "Approved"
            ? "Publish"
            : action == "Rejected"
            ? "Unpublish"
            : "Delete"
        }
        handleAction={handleBulkAction}
      />
    </>
  );
};

export default ArticleTable;

const getDialogText = (action: string, count: number) => ({
  title: `${action} ${count > 1 ? "Articles" : "Article"}?`,
  description: `Are you sure you want to ${action} ${
    count > 1 ? "these Articles" : "this Article"
  }?`,
});

const actionIcons: Record<string, JSX.Element> = {
  Delete: <TriangleAlert />,
  Publish: <Globe />,
  Unpublish: <Ban />,
};
