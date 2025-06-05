import { Column, ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import TableCells from "../../table/table-cells";
import { ChevronsUpDown, Link2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import dynamic from "next/dynamic";
const ReactJsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

import { useTheme } from "next-themes";
import TooltipCell from "@/components/table/tooltip-cell";
import { Article } from "@/types";
import { ContentPath } from "../content-categories/sections/section-overview/columns";
import StatusButton from "@/components/ui/status-button";

const multiColumnFilterFn: FilterFn<Article> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

const dateRangeFilter: FilterFn<Article> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const statusSelectionFilters: FilterFn<Article> = (
  row,
  columnId,
  filterValue
) => {
  const status = row.getValue(columnId);
  return status == filterValue;
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
        className="max-h-[57px]"
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
        className="max-h-[57px]"
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
    size: 450,
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <TooltipCell
        content={
          <pre className="max-w-[450px] text-wrap font-inter text-sm overflow-y-auto">
            {row.getValue("title")}
          </pre>
        }
      >
        <TableCells
          type="text"
          className={`w-full ${
            row.getValue("title") ? "text-left" : "text-center"
          } normal-case`}
        >
          {row.getValue("title") || "-"}
        </TableCells>
      </TooltipCell>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "content_path",
    enableResizing: true,
    size: 350,
    header: ({ column }) => (
      <SortableHeader column={column} title="Content Path" />
    ),
    cell: ({ row }) => {
      return <ContentPathCell row={row} />;
    },
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

      return description ? (
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
            {description || "-"}
          </TableCells>
        </TooltipCell>
      ) : (
        <p className={`text-center`}>-</p>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "content_type",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Content Type" />
    ),
    cell: ({ row }: { row: { getValue: <T = unknown>(key: string) => T } }) => {
      const content_type = row.getValue<{ type: string }>("content_type");
      return (
        <TableCells type="text" className="normal-case">
          {content_type?.type}
        </TableCells>
      );
    },
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: "thumbnail_icon",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Thumbnail Icon" />
    ),
    cell: ({ row }) => {
      const thumbnail = row.getValue<{ url: string; name: string }>(
        "thumbnail_icon"
      );
      return thumbnail ? (
        <TooltipCell
          content={
            <div className="flex flex-col gap-1">
              <Image
                className="h-[150px] max-w-[600px] w-auto rounded-lg"
                src={thumbnail?.url}
                alt={thumbnail?.name}
                width={600}
                height={600}
              />
              <a
                href={thumbnail?.url}
                target="_blank"
                className="w-full hover:underline text-sm text-center"
              >
                {thumbnail?.name}
              </a>
            </div>
          }
        >
          <Image
            className="h-6 w-6 mx-auto rounded-full object-cover"
            src={thumbnail.url}
            alt={thumbnail.name}
            width={200}
            height={200}
          />
        </TooltipCell>
      ) : (
        <p className="text-center">-</p>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "quiz",
    enableResizing: true,
    size: 250,
    header: ({ column }) => <SortableHeader column={column} title="Quiz" />,
    cell: ({ row }) => <QuizCell row={row} />, // ✅ Use the component here
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "url",
    enableResizing: true,
    size: 100,
    maxSize: 100,
    header: ({ column }) => <SortableHeader column={column} title="URL" />,
    cell: ({ row }) => (
      <TableCells type="text" className="max-w-[300px]  py-0 overflow-hidden ">
        <span className="flex items-center [&_svg]:size-4 hover:underline  border rounded-md px-2 border-border h-6 max-w-fit">
          <Link2 className="-rotate-45 shrink-0" />
          <a
            href={row.getValue("url")}
            target="_blank"
            className="ml-1 truncate"
          >
            {row.getValue("url")}
          </a>
        </span>
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "status",
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }: { row: { getValue: <T = unknown>(key: string) => T } }) => {
      const status: string = row.getValue("status");
      return (
        <TableCells type="text" className="normal-case h-6">
          <StatusButton status={status} />
        </TableCells>
      );
    },
    filterFn: statusSelectionFilters,
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

const QuizCell: React.FC<{ row: Row<Article> }> = ({ row }) => {
  const { resolvedTheme } = useTheme();
  return row.original.quiz?.length > 0 ? (
    <TooltipCell
      content={
        <pre className="max-w-[450px] text-wrap dark:text-white">
          <ReactJsonView
            src={row.original.quiz}
            name="quiz"
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
        {row.original.quiz.map((i) => i.question)}
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};

const ContentPathCell: React.FC<{ row: Row<Article> }> = ({ row }) => {
  return row.original.collection ? (
    <TableCells type="text" className="text-left normal-case ">
      <ContentPath
        collection_data={row.original.collection ?? undefined}
        section={
          row.original.collection.section ||
          row.original.collection.sub_section?.section ||
          undefined
        }
        sub_section={row.original.collection?.sub_section ?? undefined}
      />
    </TableCells>
  ) : (
    <p className="text-center">-</p>
  );
};
