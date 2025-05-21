import { Column, ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import { ChevronsUpDown, FolderClosed } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import TooltipCell from "@/components/table/tooltip-cell";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { HealthCondition, DetailedSubSection } from "@/types";
import TableCells from "@/components/table/table-cells";
const ReactJsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

const multiColumnFilterFn: FilterFn<DetailedSubSection> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const HCSelectionFilters: FilterFn<DetailedSubSection> = (
  row,
  columnId,
  filterValue
) => {
  const conditions: HealthCondition[] = row.getValue(columnId);
  return conditions && conditions.some((hc) => hc.id === filterValue.id);
};

const dateRangeFilter: FilterFn<DetailedSubSection> = (
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
  column: Column<DetailedSubSection>;
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

const columns: ColumnDef<DetailedSubSection>[] = [
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
    accessorKey: "subsection_name",
    size: 300,
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("subsection_name")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "subsection_description",
    enableResizing: true,
    size: 300,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue("subsection_description");

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
    accessorKey: "section",
    enableResizing: true,
    size: 300,
    header: ({ column }) => <SortableHeader column={column} title="Section" />,
    cell: ({ row }) => <SectionCell row={row} />,
  },
  {
    accessorKey: "associated_conditions",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Health Condition" />
    ),
    cell: ({ row }) => (
      <HealthConditionCell
        HConditionsData={row.original.associated_conditions}
      />
    ),
    filterFn: HCSelectionFilters,
  },
  {
    accessorKey: "bg_color",
    enableResizing: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Background color" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        <div className="w-fit h-fit rounded bg-white text-black">
          <div
            className="rounded h-6 w-fit px-2 py-1 text-xs font-inter"
            style={{
              background: row.getValue("bg_color") + "33",
            }}
          >
            {row.getValue("bg_color")}
          </div>
        </div>
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

export const HealthConditionCell: React.FC<{
  HConditionsData: HealthCondition[];
}> = ({ HConditionsData }) => {
  const { resolvedTheme } = useTheme();
  return HConditionsData && HConditionsData.length > 0 ? (
    <TooltipCell
      content={
        <pre
          className="max-w-[450px] text-wrap dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <ReactJsonView
            src={HConditionsData}
            name="associated_conditions"
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
        <div className="flex justify-center mx-auto w-fit">
          <div
            className={cn(
              buttonVariants({ variant: "outline" }),
              ` px-2 py-1 hover:text-red h-fit w-fit shrink-0`
            )}
          >
            {HConditionsData[0].name}
          </div>
        </div>
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};

const SectionCell: React.FC<{ row: Row<DetailedSubSection> }> = ({ row }) => {
  const { resolvedTheme } = useTheme();
  return row.original.section ? (
    <TooltipCell
      content={
        <pre
          className="max-w-[450px] text-wrap dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <ReactJsonView
            src={row.original.section}
            name="section"
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
        <div
          className="flex gap-2 justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/sections/${row.original.section?.id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              ` px-2 py-1 hover:text-red h-fit w-fit shrink-0`
            )}
          >
            <FolderClosed />
            {row.original.section?.section_name}
          </Link>
        </div>
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};
