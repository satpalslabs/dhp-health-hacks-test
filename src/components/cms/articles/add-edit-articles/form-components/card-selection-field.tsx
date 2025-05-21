import { Path, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import InfoCircled from "@/info-circled.svg";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";

export const CardSelectionField = <T extends z.ZodType>({
  form,
  name,
  label,
  options,
}: {
  form: UseFormReturn<z.infer<T>>;
  name: Path<z.infer<T>>;
  label: string;
  options: {
    value: string;
    label: string;
    icon: React.ElementType;
  }[];
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
            <div>{label}</div>
            <span className="text-[red]">*</span>
            <InputTooltip tooltip="Select Content Type">
              <InfoCircled className="w-[13px] h-auto" />
            </InputTooltip>
          </FormLabel>
          <div
            className={`grid gap-3 mt-2`}
            style={{
              gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
            }}
          >
            {options.map((contentType) => {
              const isSelected = field.value === contentType.value;
              return (
                <button
                  type="button"
                  key={contentType.value}
                  className={`px-[33px] py-4 text-center border-2 rounded-lg flex flex-col gap-2 [&_svg]:size-6 items-center transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/25"
                  }`}
                  onClick={() => {
                    form.reset();
                    form.clearErrors(name);
                    setTimeout(() => {
                      field.onChange(contentType.value);
                    });
                  }}
                >
                  <contentType.icon className="w-6 h-6 " />
                  <p className="font-inter font-medium text-sm">
                    {contentType.label}
                  </p>
                </button>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
