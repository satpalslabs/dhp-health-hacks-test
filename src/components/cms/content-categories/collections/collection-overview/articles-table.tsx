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
import { Article, Collection } from "@/types";
import { Ban, Globe, Inbox, TriangleAlert } from "lucide-react";
import TableHeader, { SelectionControlBar } from "./header";
import { DataTable } from "@/components/table/table";
import { ArticleTableRow } from ".";
import TableActions from "./table-actions";
import ActionConfirmationDialog from "@/components/cms/journey/confirmation-dialog";
import { DeleteArticle } from "@/lib/services/article-services";
import { toast } from "@/hooks/use-toast";
import { DeleteVideo } from "@/lib/services/video-services.";
import columns from "./columns";
import { AddButton } from "@/components/ui/add-button";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

const ArticleTable = ({
  articles,
  setArticles,
  collection,
}: {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  collection: Collection;
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedRows, setSelectedRows] = React.useState<Article[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [action, setAction] = React.useState<
    "Delete" | "Publish" | "Unpublish"
  >("Delete");

  const table = useReactTable({
    data: articles as Article[],
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
    let isMounted = true;
    const filteredData = [...collection.articles, ...collection.videos];

    // Update selectedRows based on rowSelection and articles
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
      const updatedArticles: Article[] = filteredData.filter(
        (i: Article) => i.id && currentRows.includes(i.id)
      );

      setArticles((prev) =>
        JSON.stringify(prev) === JSON.stringify(updatedArticles)
          ? prev
          : updatedArticles
      );
    }

    return () => {
      isMounted = false;
    };
  }, [collection, rowSelection, table, setArticles]);

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
              const data = articles.find((i) => i.id == id);
              if (data?.content_type?.type == "content-video") {
                await DeleteVideo(id);
              } else {
                await DeleteArticle(id);
              }
            }
          })
        );
        updatedRows = articles.filter(
          (article) => !selectedIds.includes(article.id)
        );
        // Update state and show success toast
        setArticles(updatedRows);
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
      <TableHeader
        table={table}
        setSelectedRows={setSelectedRows}
        data={articles as ArticleTableRow[]}
      />
      {selectedRows.length > 0 && (
        <SelectionControlBar
          data={articles as ArticleTableRow[]}
          selectedRows={selectedRows}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setAction={setAction}
        />
      )}
      {articles.length > 0 ? (
        <DataTable
          columns={columns as ColumnDef<Article>[]}
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
      ) : (
        <div className="flex flex-col  h-full rounded-lg justify-center">
          <div className="flex flex-col gap-5 py-6 px-4">
            <div className="flex flex-col gap-2  text-center items-center text-gray-500">
              <Inbox className="w-[83px] h-[74px] stroke--gray-600 stroke-[0.8px]" />
              <div className="font-inter text-sm">
                {"You haven't added any Content."}
                <br />
                {"Tap ‘Add’ to create a new article."}
              </div>
            </div>

            <AddButton
              className="w-[190px] mx-auto"
              text="Add"
              onClick={() => {
                setSelectedRows([]);
                nProgress.start(); // Start the top loader
                router.push(`/collections/${collection.id}/article/add`);
              }}
            />
          </div>
        </div>
      )}
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
    </>
  );
};

export default ArticleTable;

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
