import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InfoCircled from "@/info-circled.svg";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import { JourneySection } from "@/lib/journey-services";
import { useEffect } from "react";

const AddOrEditUnitDialog = ({
  open,
  setOpen,
  selectedRowIx,
  section,
  handleSubmit,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  selectedRowIx: null | number;
  section: JourneySection;
  handleSubmit: (values: {
    title: string;
    "heart-points": number;
    gems: number;
  }) => void;
}) => {
  //   const { data, setData } = useContext(DataContext) ?? {};

  const formSchema = z.object({
    title: z.string().nonempty({
      message: "Journey title is required",
    }),
    "heart-points": z.coerce
      .number()
      .min(0, {
        message: "Heart Points should be greater or equal to 0",
      })
      .refine((val) => !isNaN(val), {
        message: "Heart Points must be a number",
      }),
    gems: z.coerce
      .number()
      .min(0, {
        message: "Gems should be greater or equal to 0",
      })
      .refine((val) => !isNaN(val), {
        message: "Gems must be a number",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      "heart-points": undefined,
      gems: undefined,
    },
  });

  const fieldConfigs = [
    {
      name: "title",
      label: "Title",
      type: "string",
      placeholder: "Write journey title",
      tooltip: "Journey title",
      icon: null,
    },
    {
      name: "heart-points",
      label: "Heart Points",
      type: "number",
      placeholder: "Enter heart points",
      tooltip: "Heart points for the journey",
      icon: (
        <Heart className="w-[22px] h-fit absolute left-3 top-1/2 -translate-y-1/2" />
      ),
    },
    {
      name: "gems",
      label: "Gems",
      type: "number",
      placeholder: "Enter gems",
      tooltip: "Gems for the journey",
      icon: (
        <Diamond className="w-[22px] h-fit absolute left-3 top-1/2 -translate-y-1/2" />
      ),
    },
  ];

  useEffect(() => {
    if (selectedRowIx != null) {
      form.setValue("title", section.units[selectedRowIx]?.title);
      form.setValue("gems", section.units[selectedRowIx]?.gems);
      form.setValue(
        "heart-points",
        section.units[selectedRowIx]["heart-points"]
      );
    } else {
      form.reset();
    }
  }, [selectedRowIx, section, form, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(e: boolean) => {
        setOpen(e);
        form.clearErrors();
        form.reset();
      }}
    >
      <DialogContent className="w-[663px] font-inter h-fit max-w-[663px] gap-4">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {typeof selectedRowIx == "number" ? "Edit" : "Add"} Unit
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              handleSubmit(values);
              form.reset();
            })}
            className="space-y-[6px] text-sm"
          >
            {fieldConfigs.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as "title" | "heart-points" | "gems"}
                render={({ field: formField }) => (
                  <FormItem className="space-y-[6px]">
                    <FormLabel className="flex gap-[2px]">
                      <div>{field.label}</div>
                      <span className="text-[red]">*</span>
                      <InputTooltip tooltip={field.tooltip}>
                        <InfoCircled className="w-[13px] h-auto" />
                      </InputTooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={field.placeholder}
                          type={field.type}
                          className={`focus-visible:ring-0 ${
                            field.icon ? "pl-[36px]" : ""
                          }`}
                          {...formField}
                        />
                        {field.icon}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="!mt-[116px]">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrEditUnitDialog;
