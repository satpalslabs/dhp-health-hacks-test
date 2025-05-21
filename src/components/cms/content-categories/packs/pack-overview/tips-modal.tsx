import { HConditionContext } from "@/context/health-conditions-provider";
import { TipsContext } from "@/context/tips-data-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import InfoCircled from "@/info-circled.svg";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Quiz, Tip } from "@/types";
import { ChevronDown, LucideIterationCcw, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/quiz-data-provider";

const StepModal = ({
  open,
  setOpen,
  handleAddTip,
  selectedTips,
  type,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTip: (values: Tip | Quiz) => void;
  selectedTips: number[];
  type: "tip-pack" | "quiz-pack";
}) => {
  const [selectedHealthCondition, setSelectedHealthCondition] = useState<
    number | null
  >(null);
  const [filteredListData, setFilteredListData] = useState<Tip[] | Quiz[]>([]);
  const { tips } = useContext(TipsContext);
  const { quizzes } = useContext(QuizContext);

  useEffect(() => {
    let filteredTips = tips;
    if (selectedHealthCondition) {
      filteredTips = filteredTips.filter((i) =>
        i.associated_conditions?.includes(selectedHealthCondition)
      );
    }
    setFilteredListData(
      type == "tip-pack"
        ? [...filteredTips.filter((i) => i.id && !selectedTips.includes(i.id))]
        : quizzes.filter((i) => i.id && !selectedTips.includes(i.id))
    );
  }, [selectedHealthCondition, selectedTips, open]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={`Search Tips`}
        className="placeholder:capitalize"
      />
      {type == "tip-pack" && (
        <div className="flex justify-between items-center px-2 py-[6px]">
          <SelectValues
            selectedHealthCondition={selectedHealthCondition}
            setSelectedHealthCondition={setSelectedHealthCondition}
          />
          <button
            className="flex items-center text-sm font-normal text-gray-600 dark:text-gray-300 [&_svg]:size-4 gap-1 font-inter"
            onClick={() => {
              setSelectedHealthCondition(null);
            }}
          >
            <LucideIterationCcw className="rotate-180" />
            Reset
          </button>
        </div>
      )}
      <CommandList>
        <>
          <CommandGroup heading={`${filteredListData.length} results`}>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="flex flex-col mt-1">
              {filteredListData.map((listItem: Tip | Quiz, ix: number) => (
                <CommandItem
                  key={ix}
                  className="h-8 !shadow-none !bg-transparent !px-0"
                >
                  <Button
                    className="py-[6px] w-full [&_svg]:[14.3px] px-2 h-8 capitalize hover:bg-muted bg-transparent !shadow-none justify-start  text-foreground font-inter  text-sm font-normal "
                    onClick={() => {
                      handleAddTip(listItem);
                      setOpen(false);
                    }}
                  >
                    <InfoCircled />
                    {"title" in listItem ? listItem.title : listItem.question}
                  </Button>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </>
      </CommandList>
    </CommandDialog>
  );
};

export default StepModal;
const SelectValues = ({
  setSelectedHealthCondition,
  selectedHealthCondition,
}: {
  setSelectedHealthCondition: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  selectedHealthCondition: number | null;
}) => {
  const [open, setOpen] = useState(false);
  const { HConditions } = useContext(HConditionContext);
  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    const select_HC = HConditions.find((i) => i.id === selectedHealthCondition);
    if (select_HC) {
      setDisplayName(select_HC.name);
    }
  }, []);

  if (selectedHealthCondition) {
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
            setSelectedHealthCondition(null);
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
          Health Condition
          <ChevronDown className="opacity-50 group-data-[state='open']:rotate-180 text-foreground  transition-transform" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-[312px]  p-0 ">
        <Command>
          <CommandInput placeholder={`Search Health Condition`} />
          <CommandList>
            <CommandEmpty>No Health Condition found.</CommandEmpty>
            <CommandGroup>
              {HConditions.map((item, ix) => (
                <CommandItem
                  key={ix}
                  onSelect={() => {
                    setSelectedHealthCondition(item.id ?? null);
                    setDisplayName(item.name);
                    setOpen(false);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
