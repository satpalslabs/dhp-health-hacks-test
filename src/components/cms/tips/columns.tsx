import { Column, ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import TableCells from "../../table/table-cells";
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import TooltipCell from "@/components/table/tooltip-cell";
import youtube_parser from "@/lib/you-tube-thumbnail";
import { Tip } from "@/types";
const ReactJsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

const multiColumnFilterFn: FilterFn<Tip> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const categorySelectionFilters: FilterFn<Tip> = (
  row,
  columnId,
  filterValue
) => {
  const categories: number[] = row.getValue(columnId);
  return categories.includes(filterValue.id);
};

const dateRangeFilter: FilterFn<Tip> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Tip>;
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

const columns: ColumnDef<Tip>[] = [
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
    accessorKey: "title",
    enableResizing: true,
    size: 300,
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("title")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "description",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue("description");

      return (
        <TooltipCell
          content={
            <pre className="max-w-[450px] text-wrap font-inter text-sm overflow-y-auto">
              {description}
            </pre>
          }
        >
          <TableCells
            type="text"
            className={`w-full ${
              description ? "text-left" : "text-center"
            } normal-case`}
          >
            {row.getValue("description") || "-"}
          </TableCells>
        </TooltipCell>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "tips_categories",
    enableResizing: true,
    size: 250,
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
    cell: ({ row }) => <TipCategoryCell row={row} />,
    filterFn: categorySelectionFilters,
  },
  {
    accessorKey: "videos",
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="videos" />,
    cell: ({ row }) => <VideoDetailCell row={row} />,
    filterFn: multiColumnFilterFn,
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

const TipCategoryCell: React.FC<{ row: Row<Tip> }> = ({ row }) => {
  const { resolvedTheme } = useTheme();
  return row.original.tips_categories.length > 0 ? (
    <TooltipCell
      content={
        <pre className="max-w-[450px] text-wrap dark:text-white">
          <ReactJsonView
            src={row.original.tips_categories}
            name="tip_categories"
            displayDataTypes={false}
            iconStyle="square"
            theme={
              resolvedTheme === "dark" ? "threezerotwofour" : "rjv-default"
            }
            collapsed={2}
          />
        </pre>
      }
    >
      <TableCells type="text" className="text-left normal-case ">
        <div className="flex gap-2">
          <div
            className={`rounded-md font-inter font-medium text-sm px-2 py-1 hover:text-red h-fit w-fit shrink-0`}
            style={{
              background: row.original.tips_categories[0].background_color
                ? row.original.tips_categories[0].background_color + "66"
                : "transparent",
            }}
          >
            {row.original.tips_categories[0].name}
          </div>
        </div>
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};

const VideoDetailCell: React.FC<{ row: Row<Tip> }> = ({ row }) => {
  const { resolvedTheme } = useTheme();
  return row.original.videos.length > 0 ? (
    <TooltipCell
      content={
        <pre className="max-w-[450px] text-wrap dark:text-white">
          <ReactJsonView
            src={row.original.videos}
            name="videos"
            displayDataTypes={false}
            iconStyle="square"
            theme={
              resolvedTheme === "dark" ? "threezerotwofour" : "rjv-default"
            }
            collapsed={2}
          />
        </pre>
      }
    >
      <TableCells
        type="text"
        className="text-left normal-case font-inter flex gap-[10px] items-center font-medium text-sm hover:text-red h-fit w-full shrink-0"
      >
        {row.original.videos[0].thumbnail_icon || row.original.videos[0].url ? (
          <Image
            src={
              row.original.videos[0].thumbnail_icon?.url
                ? row.original.videos[0].thumbnail_icon.url
                : row.original.videos[0].url
                ? youtube_parser(row.original.videos[0].url)
                : ""
            }
            width={400}
            height={400}
            className="h-6 w-9 rounded object-cover"
            alt="thumbnail-image"
          />
        ) : (
          <></>
        )}
        <p className="line-clamp-1">{row.original.videos[0].title}</p>
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};
