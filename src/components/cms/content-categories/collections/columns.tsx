import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  BookmarkMinus,
  ChevronsUpDown,
  FileText,
  FolderClosed,
  Youtube,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TooltipCell from "@/components/table/tooltip-cell";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { HealthConditionCell } from "../sub-sections/columns";
import { Collection, HealthCondition, Section, SubSection } from "@/types";
import RoundedBorder from "@/rounded-border.svg";
import TableCells from "@/components/table/table-cells";
import { Stat } from "../sections/columns";

const multiColumnFilterFn: FilterFn<Collection> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = JSON.stringify(row);
  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};
const HCSelectionFilters: FilterFn<Collection> = (
  row,
  columnId,
  filterValue
) => {
  const conditions: HealthCondition[] = row.getValue(columnId);
  return conditions && conditions.some((hc) => hc.id === filterValue.id);
};

const dateRangeFilter: FilterFn<Collection> = (row, columnId, filterValue) => {
  const dateValue = new Date(row.getValue(columnId));
  const [startDate, endDate] = filterValue;

  return dateValue >= startDate && dateValue <= endDate;
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Collection>;
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

const columns: ColumnDef<Collection>[] = [
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
    accessorKey: "collection_name",
    enableResizing: true,
    size: 200,
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case">
        {row.getValue("collection_name")}
      </TableCells>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "collection_description",
    enableResizing: true,
    size: 300,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue("collection_description");

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
    accessorKey: "content_path",
    enableResizing: true,
    size: 200,
    header: ({ column }) => (
      <SortableHeader column={column} title="Content path" />
    ),
    cell: ({ row }) => (
      <ContentPath
        section={
          (row.original.section || row.original.sub_section?.section) ??
          undefined
        }
        sub_section={row.original.sub_section ?? undefined}
      />
    ),
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
    accessorKey: "content",
    enableResizing: true,
    size: 200,
    header: ({ column }) => <SortableHeader column={column} title="Content" />,
    cell: ({ row }) => {
      const { articles, videos } = row.original;
      const showEmpty = articles.length === 0 && videos.length === 0;

      return (
        <div className="flex gap-[10px] items-center">
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
    accessorKey: "bg_color",
    enableResizing: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Background color" />
    ),
    cell: ({ row }) => (
      <TableCells type="text" className="normal-case flex justify-center">
        {row.getValue("bg_color") ? (
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
        ) : (
          "-"
        )}
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

const ContentPath: React.FC<{
  section?: Section;
  sub_section?: SubSection;
}> = ({ section, sub_section }) => {
  return (
    <>
      {section || sub_section ? (
        <div
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "w-fit overflow-hidden h-6 text-xs text-left px-[6px] hover:bg-transparent cursor-text rounded-[6px] flex gap-4 border-[#E2E8F0] dark:border-muted font-inter",
            })
          )}
        >
          {section && (
            <Link href={`/sections/${section?.id}`} className=" relative  ">
              <div className="flex gap-[6px] items-center leading-4 [&_svg]:size-[14px]">
                <FolderClosed />
                {section?.section_name}
              </div>
              <span className="[&_svg]:size-6">
                <RoundedBorder className="text-[#E2E8F0] dark:text-muted absolute right-0 translate-x-full -top-[4px] h-full" />
              </span>
            </Link>
          )}
          {sub_section && (
            <Link
              href={`/sub-sections/${sub_section.id}`}
              className=" relative "
            >
              <div className="flex gap-[6px] items-center leading-4 [&_svg]:size-[14px] ">
                <BookmarkMinus />
                {sub_section?.subsection_name}
              </div>
            </Link>
          )}
        </div>
      ) : (
        <p className="text-center">-</p>
      )}
    </>
  );
};
