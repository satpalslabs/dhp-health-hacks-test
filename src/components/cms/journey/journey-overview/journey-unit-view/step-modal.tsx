import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  Command,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCollections,
  getFilteredSteps,
  getSections,
  getSources,
  getSubSections,
} from "@/lib/journey-services";
import { ChevronDown, LucideIterationCcw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getIcon } from "./usable-components";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  StepCollection,
  StepSubSection,
  StepSection,
  StepSource,
  JourneyStep,
} from "@/types";

export type filterValues = {
  collection: StepCollection | null;
  sub_section: StepSubSection | null;
  section: StepSection | null;
  source: StepSource | null;
};

type filterListData = {
  collection: StepCollection[];
  section: StepSection[];
  sub_section: StepSubSection[];
  source: StepSource[];
};

const StepModal = ({
  open,
  setOpen,
  showStepsInModal,
  handleAddStep,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showStepsInModal:
    | "videos"
    | "articles"
    | "pairs"
    | "multi-select"
    | "single-select"
    | undefined;
  handleAddStep: (values: JourneyStep) => void;
}) => {
  const [filterValues, setFilterValues] = React.useState<filterValues>({
    collection: null,
    sub_section: null,
    section: null,
    source: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredListData, setFilteredListData] = useState<JourneyStep[]>([]);
  const [fetchedData, setFetchedData] = useState<filterListData>({
    collection: [],
    sub_section: [],
    source: [],
    section: [],
  });

  useEffect(() => {
    fetchData();
    setLoading(true);
    setFilterValues({
      collection: null,
      sub_section: null,
      section: null,
      source: null,
    });
  }, [showStepsInModal, open]);

  async function fetchData() {
    const collection = await getCollections();
    const section = await getSections();
    const sub_section = await getSubSections();
    const source = await getSources();

    setFetchedData({
      collection,
      sub_section,
      source,
      section,
    });
    setLoading(false);
  }

  useEffect(() => {
    fetchFilteredData();
  }, [filterValues]);

  async function fetchFilteredData() {
    const list: JourneyStep[] = await getFilteredSteps(
      filterValues,
      showStepsInModal
    );
    setFilteredListData(list);
  }
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={`Search ${showStepsInModal}`}
        className="placeholder:capitalize"
      />
      <div className="flex justify-between items-center px-2 py-[6px]">
        <div className="flex gap-2 items-center ">
          <SelectValues
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            fetchedData={fetchedData}
            dataKey={"section"}
          />
          <SelectValues
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            fetchedData={fetchedData}
            dataKey={"sub_section"}
          />
          <SelectValues
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            fetchedData={fetchedData}
            dataKey={"collection"}
          />
          <SelectValues
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            fetchedData={fetchedData}
            dataKey={"source"}
          />
        </div>
        {Object.values(filterValues).some((i) => i != null) && (
          <button
            className="flex items-center text-sm font-normal text-gray-600 dark:text-gray-300 [&_svg]:size-4 gap-1 font-inter"
            onClick={() => {
              setFilterValues({
                collection: null,
                sub_section: null,
                section: null,
                source: null,
              });
            }}
          >
            <LucideIterationCcw className="rotate-180" />
            Reset{" "}
            {Object.values(filterValues).filter((value) => value !== null)
              .length > 1 && "all"}
          </button>
        )}
      </div>
      <CommandList>
        {loading ? (
          <LoadingSpinner className="mx-auto my-8 w-6 h-6 border-[3px]" />
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            {filteredListData.length > 0 && (
              <CommandGroup heading={`${filteredListData.length} results`}>
                <div className="flex flex-col mt-1">
                  {filteredListData.map((listItem: JourneyStep, ix: number) => (
                    <CommandItem
                      key={ix}
                      className="h-8 !shadow-none !bg-transparent !px-0"
                    >
                      <Button
                        className="py-[6px] w-full px-2 h-8 capitalize hover:bg-muted bg-transparent !shadow-none justify-start  text-foreground font-inter  text-sm font-normal [&_svg]:size-4"
                        onClick={() => {
                          handleAddStep(listItem);
                          setOpen(false);
                        }}
                      >
                        {getIcon(listItem.type)}
                        {listItem.title}
                      </Button>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default StepModal;

const SelectValues = ({
  filterValues,
  setFilterValues,
  dataKey,
  fetchedData,
}: {
  filterValues: filterValues;
  setFilterValues: React.Dispatch<React.SetStateAction<filterValues>>;
  dataKey: keyof filterListData;
  fetchedData: filterListData;
}) => {
  const [open, setOpen] = React.useState(false);

  const value = filterValues[dataKey as keyof typeof filterValues] ?? null;

  if (value) {
    const displayName =
      "collection_name" in value
        ? value.collection_name
        : "section_name" in value
        ? value.section_name
        : "subsection_name" in value
        ? value.subsection_name
        : value.name;

    return (
      <Button
        aria-expanded={open}
        variant={"default"}
        className="py-[6px] px-2 h-8 capitalize  font-inter cursor-text text-sm font-normal "
      >
        {displayName}
        <div
          className="cursor-pointer"
          onClick={() => {
            setFilterValues((prev: filterValues) => ({
              ...prev,
              [dataKey as keyof filterValues]: null,
            }));
          }}
        >
          <X />
        </div>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="group">
        <Button
          role="combobox"
          aria-expanded={open}
          className="py-[6px] px-2 h-8 capitalize hover:shadow-none border data-[state='open']:border-primary justify-between bg-muted text-foreground font-inter text-sm font-normal [&_svg]:size-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {dataKey.replace("_", " ")}
          <ChevronDown className="opacity-50 group-data-[state='open']:rotate-180 text-foreground  transition-transform" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-[312px]  p-0 ">
        <Command>
          <CommandInput placeholder={`Search ${dataKey.replace("_", " ")}`} />
          <CommandList>
            <CommandEmpty>
              No <span className="capitalize">{dataKey.replace("_", " ")}</span>{" "}
              found.
            </CommandEmpty>
            <CommandGroup>
              {fetchedData[dataKey].map((item, ix) => (
                <CommandItem
                  key={ix}
                  onSelect={() => {
                    setFilterValues((prev: filterValues) => ({
                      ...prev,
                      [dataKey as keyof filterValues]: item,
                    }));
                    setOpen(false);
                  }}
                >
                  {"collection_name" in item
                    ? item.collection_name
                    : "section_name" in item
                    ? item.section_name
                    : "subsection_name" in item
                    ? item.subsection_name
                    : item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
