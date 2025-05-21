import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import { Button } from "@/components/ui/button";
import InfoCircled from "@/info-circled.svg";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Option, SelectFieldWrapperProps } from ".";
import { memo, useDeferredValue, useEffect, useState } from "react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TypeOf, z } from "zod";
import { Control, Path, UseFormReturn } from "react-hook-form";
import {
  Article,
  Collection,
  HealthCondition,
  Pack,
  Quiz,
  Section,
  ContentProvider,
  Tip,
  SubSection,
  NHSCondition,
} from "@/types";
import { Input } from "@/components/ui/input";

type Options =
  | ContentProvider
  | Section
  | SubSection
  | Collection
  | Article
  | HealthCondition
  | Tip
  | Pack
  | NHSCondition
  | Quiz;

const SelectField = <T extends z.ZodType>({
  form,
  control,
  name,
  label,
  tooltip,
  placeholder,
  dataKey,
  options: initalOptions,
  selectType = "single-select",
  required = false,
  showLoader = false,
  onSelect,
}: {
  form?: UseFormReturn<z.infer<T>>;
  control: Control<z.infer<z.ZodType>>;
  name: string;
  label: string;
  tooltip: string;
  placeholder?: string;
  required?: boolean;
  selectType?: "single-select" | "multi-select";
  dataKey: string;
  options: Options[];
  onSelect?: (id: number) => void;
  showLoader?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] =
    useState<SelectFieldWrapperProps["options"]>(initalOptions);

  const getOptionLabel = (option: Option): string => {
    const _option = option[dataKey as keyof Option];
    return typeof _option == "string" ? _option.split("_")[0] : "";
  };

  useEffect(() => {
    setOptions(initalOptions);
    if (initalOptions.length === 0 && form && !showLoader) {
      form.resetField(name as Path<TypeOf<T>>);
    }
  }, [initalOptions]);

  const deferredOptions = useDeferredValue(options);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOptions =
          selectType === "single-select"
            ? deferredOptions.filter((opt) => opt.id === field.value)
            : deferredOptions.filter(
                (opt) =>
                  Array.isArray(field.value) && field.value.includes(opt.id)
              );

        return (
          <FormItem>
            <FormLabel className="flex grow gap-1 font-inter text-sm items-center [&_svg]:size-3">
              <span className="capitalize">{label}</span>
              {required && <span className="text-red-500">*</span>}
              <InputTooltip tooltip={tooltip}>
                <InfoCircled />
              </InputTooltip>
            </FormLabel>
            <div className="flex gap-3">
              <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                  <FormControl
                    className={selectType != "single-select" ? "min-h-fit" : ""}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-between font-normal relative hover:bg-transparent data-[state='open']:border-foreground ${
                        showLoader ? "animate-pulse bg-muted" : ""
                      }`}
                    >
                      {selectedOptions.length > 0 ? (
                        <div className="flex flex-wrap w-full gap-1 items-center">
                          {selectedOptions.map((selectedOption, ix) => (
                            <div
                              key={ix}
                              className={`flex gap-4 items-center relative font-inter p-2 text-sm rounded-md ${
                                selectType === "single-select"
                                  ? "w-full grow"
                                  : "bg-muted pr-8 first:-ml-2"
                              }`}
                            >
                              {selectedOption.id && (
                                <span className="text-gray-500">
                                  {selectedOption.id.toString().substring(0, 2)}
                                </span>
                              )}
                              {getOptionLabel(selectedOption)}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectType === "single-select") {
                                    field.onChange(null);
                                  } else {
                                    const newValue = Array.isArray(field.value)
                                      ? field.value.filter(
                                          (id) => id !== selectedOption.id
                                        )
                                      : [];
                                    field.onChange(newValue);
                                  }
                                }}
                                className="absolute right-2 text-button-filter-text cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {showLoader ? "Loading.... " : placeholder}
                        </span>
                      )}

                      <ChevronsUpDown className="text-gray-500 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width]   border border-border rounded-md p-0 my-2">
                  <Command>
                    <div className="relative h-11 w-full">
                      <Input
                        placeholder={`Search ${label}`}
                        className="focus-visible:ring-0 pl-8 h-full rounded-none border-0"
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setOptions(() =>
                            initalOptions.filter(
                              (option) =>
                                getOptionLabel(option)
                                  .toLowerCase()
                                  .includes(e.target.value.toLowerCase()) ||
                                option.id?.toString().includes(e.target.value)
                            )
                          );
                        }}
                      />
                      <Search className="left-3 h-4 absolute top-1/2 -translate-y-1/2 w-4 shrink-0 opacity-50" />
                    </div>
                    {showLoader ? (
                      <div className="w-full h-[140px] flex items-center justify-center">
                        <LoadingSpinner className="w-6 h-6" />
                      </div>
                    ) : (
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>No {label} found.</CommandEmpty>
                        <CommandGroup>
                          {deferredOptions.map((item, ix) => (
                            <CommandItem
                              key={ix}
                              value={JSON.stringify(item)}
                              className="text-sm p-2 w-full"
                              onSelect={() => {
                                setOpen(false);
                                if (selectType === "single-select") {
                                  field.onChange(item.id);
                                  if (onSelect && item.id) {
                                    onSelect(item.id);
                                  }
                                } else {
                                  const currentValue = Array.isArray(
                                    field.value
                                  )
                                    ? field.value
                                    : [];
                                  const isSelected = currentValue.includes(
                                    item.id
                                  );

                                  if (isSelected) {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== item.id
                                      )
                                    );
                                  } else {
                                    field.onChange([...currentValue, item.id]);
                                  }
                                }
                              }}
                            >
                              <span className="text-gray-500 mr-2">
                                {ix + 1}
                              </span>
                              {getOptionLabel(item)}
                              {selectedOptions.some(
                                (i) => i.id === item.id
                              ) && (
                                <span className="ml-auto">
                                  <Check className="h-4 w-4" />
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        );
      }}
    />
  );
};

export default memo(SelectField);
