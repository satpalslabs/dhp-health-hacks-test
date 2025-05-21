import { Column, ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import TableCells from "../../table/table-cells";
import { ChevronsUpDown } from "lucide-react";
import { Quiz } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import TooltipCell from "@/components/table/tooltip-cell";

const multiColumnFilterFn: FilterFn<Quiz> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const typeSelectionFilters: FilterFn<Quiz> = (row, columnId, filterValue) => {
  const type = row.getValue(columnId);
  return type == filterValue;
};

const dateRangeFilter: FilterFn<Quiz> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Quiz>;
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

const columns: ColumnDef<Quiz>[] = [
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
    accessorKey: "question",
    enableResizing: true,
    size: 300,
    header: ({ column }) => <SortableHeader column={column} title="Question" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("question")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "answers",
    enableResizing: true,
    size: 250,
    header: ({ column }) => <SortableHeader column={column} title="Answers" />,
    cell: ({ row }) => <OptionsCell row={row} />, // ✅ Use the component here
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: "type",
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="Type" />,
    cell: ({ row }: { row: { getValue: <T = unknown>(key: string) => T } }) => {
      const _question_type: string = row.getValue("type");
      return (
        <TableCells type="text" className="normal-case">
          <div>{_question_type}</div>
        </TableCells>
      );
    },
    filterFn: typeSelectionFilters,
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

const OptionsCell: React.FC<{ row: Row<Quiz> }> = ({ row }) => {
  const options = row.getValue("answers") as Quiz["answers"];

  return options.length > 0 ? (
    <TooltipCell
      content={
        <pre className="max-w-[450px] text-wrap dark:text-white  font-inter no-tailwind">
          <ul className="ml-4">
            {options.map((option: Quiz["answers"][0], ix: number) => (
              <li className="list-disc" key={ix}>
                {option.answer}
              </li>
            ))}
          </ul>
        </pre>
      }
    >
      <TableCells type="text" className="text-left normal-case ">
        {options[0].answer}
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};
