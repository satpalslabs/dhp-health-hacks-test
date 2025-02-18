import { JourneyData } from "@/lib/journey-services";
import { useContext, useState } from "react";
import { DateRange } from "react-day-picker";
import { Plus, Search, Settings2 } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { DataContext } from "../providers/data-provider";

const JourneyTableHeader = ({
  setOpenDialog,
  setData,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<JourneyData[]>>;
}) => {
  const [filterDates, setFilterDates] = useState<{
    updatedAt: undefined | DateRange;
    createdAt: undefined | DateRange;
  }>({
    updatedAt: {
      from: undefined,
      to: undefined,
    },
    createdAt: {
      from: undefined,
      to: undefined,
    },
  });
  const { data } = useContext(DataContext) ?? {};

  const [dateFilters, setDateFilters] = useState({
    updatedAt: false,
    createdAt: false,
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 ">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-sidebar-foreground top-1/2 -translate-y-1/2 left-3" />
          <Input
            placeholder="Search"
            className="max-w-sm w-[264px] pl-[36px] border-input-border focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => {
              setData(() =>
                data.filter((i: JourneyData) =>
                  i.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
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
            <hr className=" border-border" />
            <DropdownMenuItem className="w-full p-0">
              <Button
                className="w-full"
                onClick={() => {
                  if (dateFilters.updatedAt) {
                    setData(() => {
                      return data.filter((i: JourneyData) => {
                        if (
                          filterDates.updatedAt?.from &&
                          new Date(i.updatedAt) > filterDates.updatedAt?.from &&
                          filterDates.updatedAt?.to &&
                          new Date(i.updatedAt) < filterDates.updatedAt?.to
                        ) {
                          return true;
                        }
                      });
                    });
                  } else {
                    setData(data);
                  }
                  if (dateFilters.createdAt) {
                    setData(() => {
                      return data.filter((i: JourneyData) => {
                        if (
                          filterDates.createdAt?.from &&
                          new Date(i.createdAt) > filterDates.createdAt?.from &&
                          filterDates.createdAt?.to &&
                          new Date(i.createdAt) < filterDates.createdAt?.to
                        ) {
                          return true;
                        }
                      });
                    });
                  } else {
                    setData(data);
                  }
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
