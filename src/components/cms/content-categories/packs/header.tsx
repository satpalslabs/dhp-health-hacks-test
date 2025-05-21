import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Pack } from "@/types";
import { PackTableRowType } from ".";
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

type filterType = {
  dateFilter: {
    updatedAt: undefined | DateRange;
    createdAt: undefined | DateRange;
  };
  inputValue: string;
  type: {
    label: "All" | "Quiz" | "Tip";
    value: "all" | "quiz-pack" | "tip-pack";
  };
};
const PackTableHeader = ({
  setOpenDialog,
  setData,
  initialData,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<Pack[]>>;
  initialData: PackTableRowType[];
}) => {
  const [filters, setFilters] = useState<filterType>({
    dateFilter: {
      updatedAt: {
        from: undefined,
        to: undefined,
      },
      createdAt: {
        from: undefined,
        to: undefined,
      },
    },
    inputValue: "",
    type: {
      label: "All",
      value: "all",
    },
  });
  const [finalFilters, setFinalFilters] = useState<filterType>({
    dateFilter: {
      updatedAt: {
        from: undefined,
        to: undefined,
      },
      createdAt: {
        from: undefined,
        to: undefined,
      },
    },
    inputValue: "",
    type: {
      label: "All",
      value: "all",
    },
  });

  const [dateFilters, setDateFilters] = useState({
    updatedAt: false,
    createdAt: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData((prev) => [
        ...prev.filter((i: Pack) =>
          JSON.stringify(i)
            .toLowerCase()
            .includes(filters.inputValue.toLowerCase())
        ),
      ]);
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters.inputValue, initialData, setData]);

  const applyFilters = () => {
    const { inputValue, type, dateFilter } = filters;
    const input = inputValue.toLowerCase();

    const hasUpdatedAtFilter =
      dateFilters.updatedAt &&
      !!dateFilter.updatedAt?.from &&
      !!dateFilter.updatedAt?.to;
    const hasCreatedAtFilter =
      dateFilters.createdAt &&
      !!dateFilter.createdAt?.from &&
      !!dateFilter.createdAt?.to;

    const isDefaultFilter =
      type.value === "all" && !hasUpdatedAtFilter && !hasCreatedAtFilter;

    // Helper function
    const isWithinRange = (dateStr?: string, from?: Date, to?: Date) => {
      if (!dateStr || !from || !to) return false;
      const date = new Date(dateStr);
      return date > from && date < to;
    };

    let _filteredData = initialData;

    // If it's the default case — just input text search
    if (isDefaultFilter) {
      _filteredData = initialData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(input)
      );
    } else {
      // Start with type filter (if applied)
      if (type.value !== "all") {
        _filteredData = _filteredData.filter(
          (item) => item.type === type.value
        );
      }

      // Apply updatedAt filter
      if (hasUpdatedAtFilter) {
        _filteredData = _filteredData.filter((item) =>
          isWithinRange(
            item.updatedAt,
            dateFilter.updatedAt?.from,
            dateFilter.updatedAt?.to
          )
        );
      }

      // Apply createdAt filter
      if (hasCreatedAtFilter) {
        _filteredData = _filteredData.filter((item) =>
          isWithinRange(
            item.createdAt,
            dateFilter.createdAt?.from,
            dateFilter.createdAt?.to
          )
        );
      }

      // Optionally apply input search if any text is typed
      if (inputValue.trim()) {
        _filteredData = _filteredData.filter((item) =>
          JSON.stringify(item).toLowerCase().includes(input)
        );
      }
    }

    setData(_filteredData);
    setFinalFilters({
      ...filters,
      dateFilter: {
        updatedAt: hasUpdatedAtFilter ? dateFilter.updatedAt : undefined,
        createdAt: hasCreatedAtFilter ? dateFilter.createdAt : undefined,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
            <Input
              placeholder="Search"
              className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setFilters((prev: filterType) => ({
                  ...prev,
                  inputValue: e.target.value,
                }));
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-3 border-input-border ">
                <Settings2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[256px] p-2 flex flex-col gap-2"
            >
              <SelectType
                setTypeSelect={(type) => {
                  setFilters((prev) => ({
                    ...prev,
                    type: type,
                  }));
                }}
                typeSelection={filters.type}
              />
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
                date={filters.dateFilter.createdAt}
                setDate={(e: DateRange | undefined) => {
                  setFilters((prev: filterType) => ({
                    ...prev,
                    inputValue: prev.inputValue,
                    dateFilter: {
                      ...prev.dateFilter,
                      createdAt: e,
                    },
                  }));
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
                date={filters.dateFilter.updatedAt}
                setDate={(e) => {
                  setFilters((prev: filterType) => ({
                    ...prev,
                    inputValue: prev.inputValue,
                    dateFilter: {
                      ...prev.dateFilter,
                      updatedAt: e,
                    },
                  }));
                }}
              />
              <hr className=" border-border" />
              <DropdownMenuItem className="w-full p-0">
                <Button
                  className="w-full"
                  onClick={() => {
                    applyFilters();
                  }}
                >
                  Apply
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={() => {
            setOpenDialog((prev) => !prev);
          }}
        >
          <>
            <Plus className="fill-white" /> Add Pack
          </>
        </Button>
      </div>
      <div className="flex gap-2">
        {[
          {
            key: "createdAt",
            label: "Created at",
            dateRange: finalFilters.dateFilter.createdAt,
            resetFilters: () => {
              setFinalFilters((prev) => {
                const _filters: filterType = {
                  ...prev,
                  dateFilter: {
                    ...prev.dateFilter,
                    createdAt: { from: undefined, to: undefined },
                  },
                };
                setData(filterDataFn(initialData, _filters));
                setDateFilters((prev) => ({
                  ...prev,
                  createdAt: false,
                }));
                setFilters(_filters);
                return _filters;
              });
            },
          },
          {
            key: "updatedAt",
            label: "Updated at",
            dateRange: finalFilters.dateFilter.updatedAt,
            resetFilters: () => {
              setFinalFilters((prev) => {
                const _filters: filterType = {
                  ...prev,
                  dateFilter: {
                    ...prev.dateFilter,
                    updatedAt: { from: undefined, to: undefined },
                  },
                };
                setDateFilters((prev) => ({
                  ...prev,
                  updatedAt: false,
                }));
                setData(filterDataFn(initialData, _filters));
                setFilters(_filters);
                return _filters;
              });
            },
          },
        ].map(
          ({ key, label, dateRange, resetFilters }) =>
            dateRange?.from &&
            dateRange?.to && (
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
        {finalFilters.type.value != "all" && (
          <Button
            variant="ghost"
            className="text-button-filter-text mb-2 bg-button-filter-background font-inter dark:bg-accent dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
            onClick={() => {
              setFinalFilters((prev) => {
                const _filters: filterType = {
                  ...prev,
                  type: {
                    label: "All",
                    value: "all",
                  },
                };
                const data = filterDataFn(initialData, _filters);
                setData(data);

                setFilters(_filters);
                return _filters;
              });
            }}
            size="sm"
          >
            Pack type: {finalFilters.type.label}
            <X className="transition-transform" />
          </Button>
        )}
        {((finalFilters.dateFilter.createdAt?.from &&
          finalFilters.dateFilter.createdAt?.to) ||
          (finalFilters.dateFilter.updatedAt?.from &&
            finalFilters.dateFilter.updatedAt?.to) ||
          finalFilters.type.value != "all") && (
          <Button
            variant="ghost"
            className="text-button-filter-text mb-2 !bg-transparent font-inter  dark:text-button-filter-background font-medium flex gap-1 items-center px-3 h-8 text-sm rounded-[12px]"
            onClick={() => {
              setFilters({
                dateFilter: {
                  updatedAt: {
                    from: undefined,
                    to: undefined,
                  },
                  createdAt: {
                    from: undefined,
                    to: undefined,
                  },
                },
                inputValue: "",
                type: {
                  label: "All",
                  value: "all",
                },
              });
              setFinalFilters({
                dateFilter: {
                  updatedAt: {
                    from: undefined,
                    to: undefined,
                  },
                  createdAt: {
                    from: undefined,
                    to: undefined,
                  },
                },
                inputValue: "",
                type: {
                  label: "All",
                  value: "all",
                },
              });

              setDateFilters({
                updatedAt: false,
                createdAt: false,
              });
              setData([...initialData]);
            }}
            size="sm"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default PackTableHeader;

const SelectType = ({
  typeSelection,
  setTypeSelect,
}: {
  typeSelection: filterType["type"];
  setTypeSelect: (e: filterType["type"]) => void;
}) => {
  const quizTypes: filterType["type"][] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Quiz",
      value: "quiz-pack",
    },
    {
      label: "Tip",
      value: "tip-pack",
    },
  ];
  return (
    <div className="flex flex-col gap-2 font-inter mb-2">
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
              <CommandEmpty>No Question type found.</CommandEmpty>
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

const filterDataFn = (
  data: PackTableRowType[],
  filters: filterType
): PackTableRowType[] => {
  const { inputValue, type, dateFilter } = filters;

  const input = inputValue.toLowerCase();

  const isDefaultFilter =
    type.value === "all" &&
    !dateFilter.updatedAt?.from &&
    !dateFilter.updatedAt?.to &&
    !dateFilter.createdAt?.from &&
    !dateFilter.createdAt?.to;

  // Helper to check if a date is within a range
  const isWithinRange = (dateStr?: string, from?: Date, to?: Date) => {
    if (!dateStr || !from || !to) return false;
    const date = new Date(dateStr);
    return date > from && date < to;
  };

  // Basic text filter only
  if (isDefaultFilter) {
    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(input)
    );
  }

  let filtered = [...data];

  // Filter by type
  if (type.value !== "all") {
    filtered = filtered.filter((item) => item.type === type.value);
  }

  // Filter by updatedAt range
  if (dateFilter.updatedAt?.from && dateFilter.updatedAt?.to) {
    filtered = filtered.filter((item) =>
      isWithinRange(
        item.updatedAt,
        dateFilter.updatedAt?.from,
        dateFilter.updatedAt?.to
      )
    );
  }

  // Filter by createdAt range
  if (dateFilter.createdAt?.from && dateFilter.createdAt?.to) {
    filtered = filtered.filter((item) =>
      isWithinRange(
        item.createdAt,
        dateFilter.createdAt?.from,
        dateFilter.createdAt?.to
      )
    );
  }

  return filtered;
};
