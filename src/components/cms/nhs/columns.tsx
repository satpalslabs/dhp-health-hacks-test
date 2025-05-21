import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import { ChevronsUpDown, Link2 } from "lucide-react";
import { NHSCondition } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import TableCells from "@/components/table/table-cells";

const multiColumnFilterFn: FilterFn<NHSCondition> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const statusSelectionFilters: FilterFn<NHSCondition> = (
  row,
  columnId,
  filterValue
) => {
  const type = row.getValue(columnId);
  return type == filterValue;
};

const dateRangeFilter: FilterFn<NHSCondition> = (
  row,
  columnId,
  filterValue
) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<NHSCondition>;
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

const columns: ColumnDef<NHSCondition>[] = [
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
    size: 200,
    header: "ID",
    cell: ({ row }) => (
      <TableCells type="text">{row.getValue("id")}</TableCells>
    ),
  },
  {
    accessorKey: "name",
    enableResizing: true,
    size: 300,
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("name")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "description",
    enableResizing: true,
    size: 300,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("description")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "status",
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status: string = row.original.articleStatus;
      return (
        <TableCells type="text" className="normal-case">
          <div
            className={` rounded-md capitalize text-sm px-2 py-1 hover:text-red h-fit w-fit ${
              status == "draft"
                ? "bg-button-status-darkGray text-text-darkGray"
                : status == "published"
                ? "bg-green-100 text-[green]"
                : "bg-red-100 text-[red] "
            }`}
          >
            {status}
          </div>
        </TableCells>
      );
    },
    filterFn: statusSelectionFilters,
  },
  {
    accessorKey: "url",
    enableResizing: true,
    size: 100,
    maxSize: 100,
    header: ({ column }) => <SortableHeader column={column} title="URL" />,
    cell: ({ row }) => (
      <TableCells
        type="text"
        className="max-w-[300px] overflow-hidden border rounded-md p-1 px-2 border-border "
      >
        <span className="flex items-center [&_svg]:size-4 hover:underline">
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
