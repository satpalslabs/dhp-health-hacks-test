import { Column, ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import {
  BookmarkMinus,
  Box,
  ChevronsUpDown,
  FileText,
  Youtube,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import TooltipCell from "@/components/table/tooltip-cell";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import TableCells from "@/components/table/table-cells";
import { DetailedSection, HealthCondition } from "@/types";
const ReactJsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

const multiColumnFilterFn: FilterFn<DetailedSection> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const HCSelectionFilters: FilterFn<DetailedSection> = (
  row,
  columnId,
  filterValue
) => {
  const conditions: HealthCondition[] = row.getValue(columnId);
  return conditions && conditions.some((hc) => hc.id === filterValue.id);
};

const dateRangeFilter: FilterFn<DetailedSection> = (
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
  column: Column<DetailedSection>;
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

const columns: ColumnDef<DetailedSection>[] = [
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
    accessorKey: "section_icon",
    enableResizing: true,
    size: 100,
    header: ({ column }) => <SortableHeader column={column} title="Icon" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.original.section_icon ? (
          <Image
            src={row.original.section_icon?.url}
            width={50}
            height={50}
            alt="icon"
          />
        ) : (
          <p className="w-full text-center">-</p>
        )}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "section_name",
    enableResizing: true,
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("section_name")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "section_description",
    enableResizing: true,
    size: 300,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue("section_description");

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
  },
  {
    accessorKey: "section_type",
    enableResizing: true,
    size: 100,
    header: ({ column }) => (
      <SortableHeader column={column} title="Section Type" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="capitalize text-center">
        {row.getValue("section_type")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "associated_conditions",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Health Condition" />
    ),
    cell: ({ row }) => <HealthConditionCell row={row} />,
    filterFn: HCSelectionFilters,
  },
  {
    accessorKey: "content",
    enableResizing: true,
    size: 200,
    header: ({ column }) => <SortableHeader column={column} title="Content" />,
    cell: ({ row }) => {
      const { collections: origCollections = [], sub_sections = [] } =
        row.original;
      const allCollections = [
        ...origCollections,
        ...sub_sections.flatMap((s) => s.collections || []),
      ];
      const articles = allCollections.flatMap((c) => c.articles || []);
      const videos = allCollections.flatMap((c) => c.videos || []);
      const showEmpty =
        articles.length === 0 &&
        videos.length === 0 &&
        sub_sections.length === 0 &&
        allCollections.length === 0;

      return (
        <div className="flex gap-[10px] items-center">
          {sub_sections.length > 0 && (
            <Stat icon={BookmarkMinus} count={sub_sections.length} />
          )}
          {allCollections.length > 0 && (
            <Stat icon={Box} count={allCollections.length} />
          )}
          {articles.length > 0 && (
            <Stat icon={FileText} count={articles.length} />
          )}
          {videos.length > 0 && <Stat icon={Youtube} count={videos.length} />}
          {showEmpty && <p className="grow w-full text-center">-</p>}
        </div>
      );
    },
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

const HealthConditionCell: React.FC<{ row: Row<DetailedSection> }> = ({
  row,
}) => {
  const { resolvedTheme } = useTheme();
  return row.original.associated_conditions.length > 0 ? (
    <TooltipCell
      content={
        <pre
          className="max-w-[450px] text-wrap dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <ReactJsonView
            src={row.original.associated_conditions}
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
        <div className="flex gap-2 justify-center">
          <div
            className={cn(
              buttonVariants({ variant: "outline" }),
              ` px-2 py-1 hover:text-none h-fit w-fit shrink-0`
            )}
          >
            {row.original.associated_conditions[0].name}
          </div>
        </div>
      </TableCells>
    </TooltipCell>
  ) : (
    <p className="text-center">-</p>
  );
};

export const Stat = ({
  icon: Icon,
  count,
}: {
  icon: React.ElementType;
  count: number;
}) => (
  <div
    className={cn(
      buttonVariants({ variant: "outline" }),
      "px-2 py-1 hover:text-none h-fit w-fit shrink-0"
    )}
  >
    <Icon />
    {count}
  </div>
);
