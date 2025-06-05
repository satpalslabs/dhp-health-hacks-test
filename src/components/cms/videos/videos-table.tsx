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
import columns from "@/components/cms/articles/article-columns";
import ArticleTableHeader, {
  SelectionControlBar,
} from "@/components/cms/articles/header";
import { Article } from "@/types";
import TableActions from "@/components/cms/articles/table-actions";
import { Ban,  TriangleAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ActionConfirmationDialog from "../journey/confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteVideo, getVideos } from "@/lib/services/video-services.";
import { VideoContext } from "@/context/video-data-provider";
import { statusItems } from "../articles/article-table";
import { changeStatusOfArticleOrVideo } from "@/lib/services/article-services";

const ArticleTable = ({
  setVideos,
  loading,
  setLoading,
}: {
  setVideos: Dispatch<SetStateAction<Article[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { videos, updateVideos } = useContext(VideoContext);
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
      if (videos.length == 0) {
        const _videos = await getVideos();
        updateVideos(_videos);
        setVideos(_videos);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      updateVideos([]);
      setVideos([]);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-red-500" />
            <span>Error Data Fetching</span>
          </div>
        ) as unknown as string,
        description: `Unable to fetch Videos`,
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
    () => (loading ? Array(5).fill({}) : videos),
    [loading, videos]
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
    if (!videos.length) return;
    let filteredData = videos;
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

    // Update videos based on filtered table rows
    if (filteredData.length > 0) {
      setVideos(filteredData);
    } else {
      const currentRows = filteredRows.map((i) => i.original);
      setVideos(currentRows);
    }
  }, [videos, rowSelection, setVideos, table, filteredRows]);

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
              await DeleteVideo(id);
            }
          })
        );
        updatedRows = videos.filter(
          (col) => col.id && !selectedIds.includes(col.id)
        );

        // Update state and show success toast
        updateVideos(updatedRows);
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        setRowSelection({});
        toast({
          title: `${action}ed ${selectedRows.length > 1 ? "videos" : "Video"}!`,
          description: `${selectedRows.length} ${
            selectedRows.length > 1 ? "videos" : "Video"
          } successfully ${action === "Delete" ? "deleted" : "updated"}`,
        });
      } else {
        await Promise.all(
          selectedIds.map(async (id: number | null) => {
            if (id) {
              await changeStatusOfArticleOrVideo("video", id, action);
            }
          })
        );
        updatedRows = videos.map((col) => {
          if (col.id && selectedIds.includes(col.id)) {
            col.status = action;
          }
          return col;
        });

        // Update state and show success toast
        updateVideos(updatedRows);
        setDeleteDialogOpen(false);
        setIsProcessing(false);
        setRowSelection({});
        toast({
          title: `${action}ed ${
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
          data={videos}
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

const getDialogText = (action: string, count: number) => ({
  title: `${action} ${count > 1 ? "Videos" : "Video"}?`,
  description: `Are you sure you want to ${action} ${
    count > 1 ? "these Videos" : "this Video"
  }?`,
});
