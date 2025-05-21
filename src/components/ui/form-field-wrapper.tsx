import { Control } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import InputTooltip from "./input-info-tooltip";
import InfoCircled from "@/info-circled.svg";

const FormFieldWrapper = ({
  control,
  name,
  label = "",
  tooltip,
  placeholder,
  component: Component,
  className = "",
  required = false,
  type = "text",
  disable = false,
  showMessage = true,
  onFocus,
  showTooltip = true,
}: {
  control: Control<z.infer<z.ZodType>>;
  name: string;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  component: React.ElementType;
  className?: string;
  required?: boolean;
  type?: string;
  disable?: boolean;
  showMessage?: boolean;
  onFocus?: () => void;
  showTooltip?: boolean;
}) => (
  <FormField
    control={control}
    name={name}
    disabled={disable}
    render={({ field }) => (
      <FormItem className="font-inter">
        {label && (
          <FormLabel className="flex gap-[2px] text-sm font-inter [&_svg]:size-[12px]">
            <span dangerouslySetInnerHTML={{ __html: label }} />
            {required && <span className="text-[red]">*</span>}
            {showTooltip && (
              <InputTooltip tooltip={tooltip ?? ""}>
                <span className="flex  items-center">
                  <InfoCircled />
                </span>
              </InputTooltip>
            )}
          </FormLabel>
        )}
        <FormControl>
          <Component
            {...field}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              let value: string | number | null = e.target.value;
              if (type === "number") {
                value = Number(value);
              }
              if (value == 0) {
                value = null;
              }
              field.onChange(value);
            }}
            type={type}
            min="0"
            max="100"
            onFocus={onFocus}
            value={field.value ?? ""}
            placeholder={placeholder}
            className={className}
          />
        </FormControl>
        {showMessage && <FormMessage />}
      </FormItem>
    )}
  />
);

export default FormFieldWrapper;
