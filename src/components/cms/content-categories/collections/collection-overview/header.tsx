import { Table } from "@tanstack/table-core";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { Article } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Checkbox } from "@/components/ui/checkbox";
import nProgress from "nprogress";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ActionConfirmationDialog from "@/components/cms/journey/confirmation-dialog";
import { DeleteCollection } from "@/lib/services/collection-services";
import { CollectionContext } from "@/context/collection-data-provider";
import { toast } from "@/hooks/use-toast";
import { ArticleTableRow } from ".";

type TypeOptions = {
  value: "all" | "content-video" | "content-page" | "content-webpage";
  label: "All" | "Video" | "Article" | "Webpage";
};

const TableHeader = ({
  data,
  table,
  setSelectedRows,
}: {
  data: ArticleTableRow[];
  table: Table<Article>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Article[]>>;
}) => {
  const [filterDates, setFilterDates] = useState<{
    updatedAt: undefined | DateRange;
    createdAt: undefined | DateRange;
  }>({ updatedAt: undefined, createdAt: undefined });
  const [dateFilters, setDateFilters] = useState({
    updatedAt: false,
    createdAt: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false);
  const [isProcession, setIsProcession] = useState<boolean>(false);
  const deferredInputValue = useDeferredValue(inputValue);
  const [typeSelection, setTypeSelect] = useState<TypeOptions>({
    value: "all",
    label: "All",
  });
  const { collections, updateCollections } = useContext(CollectionContext);
  const { collectionID } = useParams();
  const router = useRouter();

  useEffect(() => {
    table.getColumn("title")?.setFilterValue(deferredInputValue);
  }, [deferredInputValue, table]);

  return (
    <div>
      <Collapsible className="group font-inter">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="p-3 border-input-border ">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[256px] p-2 flex flex-col gap-2"
              >
                <SelectType
                  setTypeSelect={setTypeSelect}
                  typeSelection={typeSelection}
                />
                <hr className="border-border" />
                <div className="flex items-center gap-2 w-full">
                  <Checkbox
                    id="createdAt"
                    checked={dateFilters.createdAt}
                    onCheckedChange={(e: boolean) => {
                      setDateFilters(
                        (prev: { updatedAt: boolean; createdAt: boolean }) => ({
                          ...prev,
                          createdAt: e,
                        })
                      );
                    }}
                  />
                  <label
                    htmlFor="createdAt"
                    className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Created At
                  </label>
                </div>
                <DatePickerWithRange
                  className="w-full"
                  disabled={!dateFilters.createdAt}
                  date={filterDates.createdAt}
                  setDate={(e: DateRange | undefined) => {
                    setFilterDates(
                      (prev: {
                        updatedAt: undefined | DateRange;
                        createdAt: undefined | DateRange;
                      }) => ({ ...prev, createdAt: e })
                    );
                  }}
                />
                <hr className="border-border" />
                <div className="flex items-center w-full gap-2">
                  <Checkbox
                    id="updatedAt"
                    checked={dateFilters.updatedAt}
                    onCheckedChange={(e: boolean) => {
                      setDateFilters(
                        (prev: { updatedAt: boolean; createdAt: boolean }) => ({
                          ...prev,
                          updatedAt: e,
                        })
                      );
                    }}
                  />
                  <label
                    htmlFor="updatedAt"
                    className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Updated At
                  </label>
                </div>
                <DatePickerWithRange
                  className="w-full"
                  disabled={!dateFilters.updatedAt}
                  date={filterDates.updatedAt}
                  setDate={(e) => {
                    setFilterDates(
                      (prev: {
                        updatedAt: undefined | DateRange;
                        createdAt: undefined | DateRange;
                      }) => ({ ...prev, updatedAt: e })
                    );
                  }}
                />
                <hr className=" border-border mb-1" />
                <DropdownMenuItem className="w-full p-0">
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (dateFilters.updatedAt) {
                        table
                          .getColumn("updatedAt")
                          ?.setFilterValue([
                            filterDates.updatedAt?.from,
                            filterDates.updatedAt?.to,
                          ]);
                      } else {
                        table.getColumn("updatedAt")?.setFilterValue(undefined);
                      }
                      if (typeSelection.value != "all") {
                        table
                          .getColumn("content_type")
                          ?.setFilterValue(typeSelection.value);
                      } else {
                        table
                          .getColumn("content_type")
                          ?.setFilterValue(undefined);
                      }
                      if (dateFilters.createdAt) {
                        table
                          .getColumn("createdAt")
                          ?.setFilterValue([
                            filterDates.createdAt?.from,
                            filterDates.createdAt?.to,
                          ]);
                      } else {
                        table.getColumn("createdAt")?.setFilterValue(undefined);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className=" border border-input-border font-normal group-data-[state=open]:ring-1 ring-foreground"
              >
                Columns
                <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center gap-2">
            {data.length == 0 && (
              <Button
                variant="destructive"
                className="text-button-status-rejectedButton bg-button-status-rejectedButton/10 hover:bg-button-status-rejectedButton/20 font-inter  dark:text-button-status-rejectedButton dark:hover:bg-button-status-rejectedButton/20"
                onClick={() => {
                  setOpenDeleteDialogue(true);
                }}
              >
                <Trash2 /> Delete
              </Button>
            )}
            <Button
              onClick={() => {
                setSelectedRows([]);
                nProgress.start(); // Start the top loader
                router.push(`/collections/${collectionID}/article/add`);
              }}
            >
              <Plus className="fill-white" /> Add
            </Button>
          </div>
        </div>

        <CollapsibleContent className="flex gap-2 mt-4 flex-wrap group-data-[state=open]:pb-4">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <Button
                  key={column.id}
                  variant={"ghost"}
                  className="text-button-filter-text bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3  h-8 capitalize text-sm rounded-[12px] "
                  onClick={() => {
                    column.toggleVisibility(!column.getIsVisible());
                  }}
                  size={"sm"}
                >
                  <Plus
                    className={`transition-transform ${
                      column.getIsVisible() ? "rotate-45" : ""
                    }`}
                  />
                  {column.id.replaceAll("_", " ")}
                </Button>
              );
            })}
        </CollapsibleContent>
        <div className="flex gap-2">
          {[
            {
              key: "createdAt",
              label: "Created at",
              dateRange: filterDates.createdAt,
              resetFilters: () => {
                setDateFilters((prev) => ({ ...prev, createdAt: false }));
                setFilterDates((prev) => ({
                  ...prev,
                  createdAt: { from: undefined, to: undefined },
                }));
                table.getColumn("createdAt")?.setFilterValue(undefined);
              },
            },
            {
              key: "updatedAt",
              label: "Updated at",
              dateRange: filterDates.updatedAt,
              resetFilters: () => {
                setDateFilters((prev) => ({ ...prev, updatedAt: false }));
                setFilterDates((prev) => ({
                  ...prev,
                  updatedAt: { from: undefined, to: undefined },
                }));
                table.getColumn("updatedAt")?.setFilterValue(undefined);
              },
            },
          ].map(
            ({ key, label, dateRange, resetFilters }) =>
              dateRange?.from &&
              dateRange?.to &&
              table.getColumn(key)?.getFilterValue() != undefined && (
                <Button
                  key={key}
                  variant="ghost"
                  className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
                  onClick={resetFilters}
                  size="sm"
                >
                  {label}: {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                  <X className="transition-transform" />
                </Button>
              )
          )}

          {typeSelection &&
            table.getColumn("content_type")?.getFilterValue() != undefined && (
              <Button
                variant="ghost"
                className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
                onClick={() => {
                  setTypeSelect({
                    value: "all",
                    label: "All",
                  });
                  table.getColumn("content_type")?.setFilterValue(undefined);
                }}
                size="sm"
              >
                Type: {typeSelection.label}
                <X className="transition-transform" />
              </Button>
            )}
          {((filterDates.createdAt &&
            table.getColumn("createdAt")?.getFilterValue() != undefined) ||
            (filterDates.updatedAt &&
              table.getColumn("updatedAt")?.getFilterValue() != undefined) ||
            (typeSelection &&
              table.getColumn("content_type")?.getFilterValue() !=
                undefined)) && (
            <Button
              variant="ghost"
              className="text-button-filter-text mb-2 !bg-transparent font-inter  dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
              onClick={() => {
                setTypeSelect({
                  value: "all",
                  label: "All",
                });
                setDateFilters({
                  updatedAt: false,
                  createdAt: false,
                });
                table.resetColumnFilters();
              }}
              size="sm"
            >
              Clear all
            </Button>
          )}
        </div>
      </Collapsible>
      <ActionConfirmationDialog
        open={openDeleteDialogue}
        setOpen={setOpenDeleteDialogue}
        dialog_title={"Delete collection?"}
        dialog_description={
          "Are you sure you want to delete this collection? This action cannot be undone."
        }
        showLoader={isProcession}
        variant={"destructive"}
        icon={<Trash2 />}
        action={"Delete"}
        handleAction={async () => {
          try {
            setIsProcession(true);
            await DeleteCollection(Number(collectionID));
            const updatedData = collections.filter(
              (collection) => collection.id !== Number(collectionID)
            );
            updateCollections(updatedData);
            router.push("/collections");
            toast({
              title: `Deleted Collection!`,
              description: `Your Collection has been successfully deleted.`,
            });
          } catch (error) {
            setIsProcession(false);
            console.error("Error deleting collection:", error);
            toast({
              title: "Error",
              description: `${error}`,
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default TableHeader;

export const SelectionControlBar = ({
  data,
  selectedRows,
  setDeleteDialogOpen,
  setAction,
}: {
  data: Article[];
  selectedRows: Article[];
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<
    React.SetStateAction<"Delete" | "Publish" | "Unpublish">
  >;
}) => {
  const { collectionID } = useParams();

  return (
    <div className="flex items-center gap-3  text-button-filter-text font-inter font-medium text-sm mb-4 leading-6">
      <div>
        {selectedRows.length} of {data.length} Articles
      </div>
      <Separator />
      {selectedRows.length > 0 && (
        <>
          {selectedRows.length === 1 && (
            <>
              <Link
                href={`/collections/${collectionID}/${
                  selectedRows[0].content_type?.type == "content-video"
                    ? "video"
                    : "article"
                }/edit/${selectedRows[0].id}`}
              >
                <ActionButton icon={PencilLine} label="Edit" />
              </Link>
              <Separator />
            </>
          )}
          <div
            onClick={() => {
              setAction("Delete");
              setDeleteDialogOpen(true);
            }}
          >
            <ActionButton icon={Trash2} label="Delete" />
          </div>
        </>
      )}
    </div>
  );
};

const SelectType = ({
  typeSelection,
  setTypeSelect,
}: {
  typeSelection: TypeOptions;
  setTypeSelect: React.Dispatch<React.SetStateAction<TypeOptions>>;
}) => {
  const quizTypes: TypeOptions[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Article",
      value: "content-page",
    },
    {
      label: "Video",
      value: "content-video",
    },
    {
      label: "Webpage",
      value: "content-webpage",
    },
  ];
  return (
    <div className="flex flex-col gap-2 font-inter ">
      <p className="text-sm cursor-pointer grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Type
      </p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full font-normal justify-between"
          >
            {typeSelection ? (
              typeSelection.label
            ) : (
              <span className="text-gray-500">Select Type</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="right"
          className="w-[--radix-popover-trigger-width] p-0 mt-0 ml-1"
        >
          <Command className="w-full">
            <CommandList>
              <CommandEmpty>No content-type found.</CommandEmpty>
              <CommandGroup>
                {quizTypes.map((item, ix) => (
                  <CommandItem
                    value={item.value}
                    key={ix}
                    onSelect={() => {
                      setTypeSelect(item);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        typeSelection?.value === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Separator = () => (
  <span className="my-auto h-3 rounded w-[1px] bg-button-filter-text"></span>
);

const ActionButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <>
    <button className="flex items-center gap-2 [&_svg]:size-4">
      <Icon />
      <span>{label}</span>
    </button>
  </>
);
