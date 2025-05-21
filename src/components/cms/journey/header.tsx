import { useContext, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Plus, Search, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { JourneyData } from "@/types";
import { JourneyContext } from "../../../context/journey-data-provider";

type filterType = {
  dateFilter: {
    updatedAt: undefined | DateRange;
    createdAt: undefined | DateRange;
  };
  inputValue: string;
};
const JourneyTableHeader = ({
  setOpenDialog,
  setData,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<JourneyData[]>>;
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
  });
  const { journeys: data } = useContext(JourneyContext) ?? {};

  const [dateFilters, setDateFilters] = useState({
    updatedAt: false,
    createdAt: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData(() =>
        data.filter((i: JourneyData) =>
          i.title.toLowerCase().includes(filters.inputValue.toLowerCase())
        )
      );
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters.inputValue, data, setData]);

  return (
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
                  let _filteredData = data;
                  if (dateFilters.updatedAt) {
                    _filteredData = data.filter((i: JourneyData) => {
                      if (
                        filters.dateFilter.updatedAt?.from &&
                        new Date(i.updatedAt) >
                          filters.dateFilter.updatedAt?.from &&
                        filters.dateFilter.updatedAt?.to &&
                        new Date(i.updatedAt) < filters.dateFilter.updatedAt?.to
                      ) {
                        return true;
                      }
                    });
                  }
                  if (dateFilters.createdAt) {
                    _filteredData = [
                      ...new Set([
                        ..._filteredData,
                        ...data.filter((i: JourneyData) => {
                          if (
                            filters.dateFilter.createdAt?.from &&
                            new Date(i.createdAt) >
                              filters.dateFilter.createdAt?.from &&
                            filters.dateFilter.createdAt?.to &&
                            new Date(i.createdAt) <
                              filters.dateFilter.createdAt?.to
                          ) {
                            return true;
                          }
                        }),
                      ]),
                    ];
                  }
                  setData(_filteredData);
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
          <Plus className="fill-white" /> Add Journey
        </>
      </Button>
    </div>
  );
};

export default JourneyTableHeader;
