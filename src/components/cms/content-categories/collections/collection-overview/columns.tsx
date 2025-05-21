import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import TableCells from "@/components/table/table-cells";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentPath } from "../../sections/section-overview/columns";
import { Article } from "@/types";

const searchFilter: FilterFn<Article> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const typeSelectionFilter: FilterFn<Article> = (row, columnId, filterValue) => {
  const content_type: { type: string } = row.getValue(columnId);
  return content_type.type == filterValue;
};

const filterBy_subSection_OR_collection: FilterFn<Article> = (
  row,
  columnId,
  filterValue
) => {
  let isValid = true;
  const collection_Data = row.original.collection;
  if (filterValue.collection) {
    if (collection_Data?.id == filterValue.collection.id) {
      isValid = true;
    } else {
      isValid = false;
    }
  }
  return isValid;
};

const dateRangeFilter: FilterFn<Article> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Article>;
  title: string;
}) => (
  <TableCells
    type="button"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ChevronsUpDown />
  </TableCells>
);

const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    accessorKey: "select",
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    enableResizing: false,
    size: 40,
    header: "ID",
    cell: ({ row }) => (
      <TableCells type="text">{row.getValue("id")}</TableCells>
    ),
  },
  {
    accessorKey: "old_id",
    enableResizing: false,
    size: 40,
    header: ({ column }) => <SortableHeader column={column} title="Old ID" />,
    cell: ({ row }) => (
      <TableCells type="text" className="text-center">
        {row.getValue("old_id") ?? "-"}
      </TableCells>
    ),
  },
  {
    accessorKey: "title",
    enableResizing: true,
    size: 300,
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("title")}
      </TableCells>
    ),
    filterFn: searchFilter,
  },
  {
    accessorKey: "content_path",
    enableResizing: true,
    size: 300,
    header: ({ column }) => (
      <SortableHeader column={column} title="Content Path" />
    ),
    cell: ({ row }) => {
      return (
        <ContentPath
          section={
            row.original.collection?.section ||
            row.original.collection?.sub_section?.section ||
            undefined
          }
          collection_data={row.original.collection ?? undefined}
          sub_section={row.original.collection?.sub_section ?? undefined}
        />
      );
    },
    filterFn: filterBy_subSection_OR_collection,
  },
  {
    accessorKey: "content_type",
    enableResizing: true,
    size: 200,
    header: ({ column }) => <SortableHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const content_type = row.getValue<{ type: string }>("content_type");
      return (
        <div className="flex justify-center">
          <div
            className={cn(
              buttonVariants({ variant: "outline" }),
              ` px-2 font-inter hover:text-red h-6 w-fit shrink-0 text-xs mx-auto`
            )}
          >
            {content_type.type === "content-video"
              ? "Video"
              : content_type.type === "content-page"
              ? "Article"
              : content_type.type === "content-webpage"
              ? "Webpage"
              : "Unknown"}
          </div>
        </div>
      );
    },
    filterFn: typeSelectionFilter,
  },

  {
    accessorKey: "createdAt",
    enableResizing: false,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="capitalize">
        {new Date(row.getValue("createdAt"))
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace("at", " ")}
      </TableCells>
    ),
    filterFn: dateRangeFilter,
  },
  {
    accessorKey: "updatedAt",
    enableResizing: false,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="capitalize">
        {new Date(row.getValue("updatedAt"))
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace("at", " ")}
      </TableCells>
    ),
    filterFn: dateRangeFilter,
  },
];

export default columns;
