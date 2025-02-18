import { useContext, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JourneyData } from "@/lib/journey-services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { InfoIcon as InfoCircled } from "lucide-react";
import { DataContext } from "@/components/providers/data-provider";

const AddOrEditJourneyDialog = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: null | number;
}) => {
  const { data, setData } = useContext(DataContext) ?? {};

  const formSchema = z.object({
    title: z.string().nonempty({
      message: "Journey title is required",
    }),
    "primary-color": z.string().nonempty({
      message: "Primary color is required",
    }),
    "background-color": z.string().nonempty({
      message: "Background color is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      "primary-color": "#ffffff",
      "background-color": "#ffffff",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (setData) {
      if (id) {
        setData((prev: JourneyData[]) => {
          const selectedRowIndex = prev.findIndex(
            (item: JourneyData) => item.id == id
          );
          prev[selectedRowIndex] = {
            ...data[selectedRowIndex],
            title: values.title,
            updatedAt: new Date(),
            "primary-color": values["primary-color"],
            "background-color": values["background-color"],
          };
          return [...prev];
        });
      } else {
        setData((prev: JourneyData[]) => [
          ...prev,
          {
            id: data.length + 1,
            title: values.title,
            createdAt: new Date(),
            updatedAt: new Date(),
            "primary-color": values["primary-color"],
            "background-color": values["background-color"],
            sections: [],
          },
        ]);
      }
      setOpen(false);
      form.reset();
      form.clearErrors();
    }
  }

  useEffect(() => {
    if (id) {
      const selectedRow = data.find((item: JourneyData) => item.id == id);
      if (selectedRow) {
        form.setValue("title", selectedRow?.title);
        form.setValue("primary-color", selectedRow["primary-color"]);
        form.setValue("background-color", selectedRow["background-color"]);
      }
    } else {
      form.reset();
    }
  }, [id, data, form]);

  const fieldConfigs = [
    {
      name: "title",
      label: "Title",
      tooltip: "Journey title",
      component: Input,
      props: {
        placeholder: "Write journey title",
        className: "focus-visible:ring-0",
      },
    },
    {
      name: "primary-color",
      label: "Primary Colour",
      tooltip: "Primary color",
      component: ColorPicker,
      props: {},
    },
    {
      name: "background-color",
      label: "Background Colour",
      tooltip: "Background color",
      component: ColorPicker,
      props: {},
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(e: boolean) => {
        setOpen(e);
        form.clearErrors();
      }}
    >
      <DialogContent className="w-[663px] font-inter h-fit max-w-[663px] gap-4">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {id ? "Edit" : "Add"} Journey
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-[6px] text-sm"
          >
            {fieldConfigs.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={
                  field.name as "title" | "primary-color" | "background-color"
                }
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
                      <field.component
                        {...field.props}
                        {...formField}
                        onColorChange={formField.onChange}
                      />
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

export default AddOrEditJourneyDialog;
