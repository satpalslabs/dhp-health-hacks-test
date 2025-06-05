"use client";

import FormFieldWrapper from "@/components/ui/form-field-wrapper";
import { SpinnerButton } from "@/components/ui/button";
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
import {
  getHConditions,
  PostHCondition,
} from "@/lib/services/health-conditions.";
import { toast } from "@/hooks/use-toast";

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
  const { updateHConditions } = useContext(HConditionContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editTip
      ? { ...editTip, description: editTip.description ?? undefined }
      : {
          name: "",
          description: "",
        },
  });

  async function handleSubmit() {
    setIsProcessing(true);
    const new_healthCondition: HealthCondition = {
      id: null,
      ...form.getValues(),
      tips: [],
      tips_categories: [],
    };
    PostHCondition(new_healthCondition)
      .then((res) => {
        getHConditions().then((conditions) => {
          updateHConditions([...conditions]);
          if (afterSubmission) {
            afterSubmission(res);
          }
          setOpen(false);
          form.reset();
          toast({
            title: `Success`,
            description: (
              <p>
                <span className="capitalize">Health Condition</span>
                Created successfully
              </p>
            ),
          });
        });
      })
      .catch((error) => {
        console.error("Error adding health condition:", error);
        setIsProcessing(false);
        toast({
          title: `Error`,
          description:
            typeof error === "object" && error !== null && "message" in error
              ? (error.message as string)
              : JSON.stringify(error),
        });
      });
  }
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
            <SpinnerButton
              type="button"
              className="px-[60px] w-fit ml-auto"
              disabled={!form.formState.isValid}
              loading={isProcessing}
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </SpinnerButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthHacksConditionModel;
