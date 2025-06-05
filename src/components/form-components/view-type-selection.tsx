"use client";

import { Control } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ViewTypSelection = ({
  formControl,
}: {
  formControl: Control<z.infer<z.ZodType>>;
}) => (
  <FormField
    control={formControl}
    name="view_type"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex gap-[2px] font-inter text-sm items-center">
          <div>View Type</div>
          <span className="text-[red]">*</span>
          <InputTooltip tooltip="Select Content Type">
            <InfoCircled className="w-[13px] h-auto" />
          </InputTooltip>
        </FormLabel>
        <Tabs
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value as "grid" | "horizontal");
          }}
        >
          <TabsList className="w-full gap-2 items-center [&_svg]:size-6 justify-between font-inter">
            <TabsTrigger
              className="!text-foreground px-[29px] w-1/2 dark:data-[state=active]:bg-background"
              value="grid"
            >
              Grid View
            </TabsTrigger>
            <TabsTrigger
              className="!text-foreground px-[29px] w-1/2 dark:data-[state=active]:bg-background"
              value="horizontal"
            >
              Horizontal Scroll View
            </TabsTrigger>
            <TabsTrigger
              className="!text-foreground px-[29px] w-1/2 dark:data-[state=active]:bg-background"
              value="Vertical"
            >
              Vertical Scroll View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </FormItem>
    )}
  />
);
