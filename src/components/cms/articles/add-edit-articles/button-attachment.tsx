import type React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";
import type { Control } from "react-hook-form";
import type { z } from "zod";
import { formSchema } from "./form-schema";

interface ContentTypeOption {
  type: string;
  label: string;
  description: string;
  component: React.ElementType;
}

interface ButtonAttachmentProps {
  control: Control<z.infer<typeof formSchema>>;
  options: ContentTypeOption[];
  name: keyof z.infer<typeof formSchema>;
  label: string;
  tooltip: string;
  required?: boolean;
  columns?: number;
}

/**
 * A reusable button attachment component for selecting options
 * Can be used for content types or any other button-based selection
 */
const ButtonAttachment = ({
  control,
  options,
  name,
  label,
  tooltip,
  required = false,
  columns = 4,
}: ButtonAttachmentProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
            <div>{label}</div>
            {required && <span className="text-[red]">*</span>}
            <InputTooltip tooltip={tooltip}>
              <InfoCircled className="w-[13px] h-auto" />
            </InputTooltip>
          </FormLabel>
          <div className={`grid grid-cols-${columns} gap-3 mt-2`}>
            {options.map((option, ix) => {
              const isSelected = option;
              return (
                <button
                  type="button"
                  key={ix}
                  className={`px-[33px] py-4 text-center border-2 rounded-lg flex flex-col gap-2 [&_svg]:size-6 items-center transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    field.onChange({
                      type: option.type,
                      description: option.description,
                    });
                  }}
                >
                  <option.component />
                  <p className="font-inter font-medium text-sm">
                    {option.label}
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

export default ButtonAttachment;
