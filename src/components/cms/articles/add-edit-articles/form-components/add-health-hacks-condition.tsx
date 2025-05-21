"use client";

import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HealthCondition } from "@/types";
import { HConditionContext } from "@/context/health-conditions-provider";

const formSchema = z.object({
  name: z.string().nonempty({ message: "name is Required" }),
  description: z.string(),
});

const AddHealthHacksConditionModel = ({
  children,
  editTip,
  afterSubmission,
}: {
  children: React.ReactNode;
  editTip?: {
    name: string;
    description?: string;
  };
  afterSubmission?: (e: HealthCondition) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { HConditions, updateHConditions } = useContext(HConditionContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editTip
      ? { ...editTip, description: editTip.description ?? undefined }
      : {
          name: "",
          description: "",
        },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        form.reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[458px] min-h-[397px] font-inter"
        // showOverlay={false}
      >
        <DialogHeader>
          <DialogTitle className="font-inter font-semibold text-lg leading-[30px] pb-[9px] border-b border-border">
            Add a new Health Condition
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <div className="h-full flex flex-col gap-4 rounded-[12px]">
            <div className="grow flex flex-col gap-4 overflow-y-auto px-[2px] pb-1 ">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Name"
                required
                tooltip="Enter Name"
                className="min-h-0"
                placeholder="Write Name here"
                component={Input}
              />
              <FormFieldWrapper
                control={form.control}
                name="description"
                label="Description"
                tooltip="Enter Description"
                className="min-h-[126px]"
                placeholder="Write Description here"
                component={Textarea}
              />
            </div>
            <Button
              type="button"
              className="px-[60px] w-fit ml-auto"
              disabled={!form.formState.isValid}
              onClick={() => {
                const new_healthCondition = {
                  id: (HConditions.length ?? 0) + 1,
                  ...form.getValues(),
                  tips: [],
                  tips_categories: [],
                };
                updateHConditions([...HConditions, new_healthCondition]);
                if (afterSubmission) {
                  afterSubmission(new_healthCondition);
                }
                setOpen(false);
                form.reset();
              }}
            >
              Save
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthHacksConditionModel;
