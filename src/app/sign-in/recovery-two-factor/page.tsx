"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SpinnerButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import Link from "next/link";

const twoFactorAuthSchema = z.object({
  otp: z.string().min(6),
});

export default function Recovery2FAPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof twoFactorAuthSchema>>({
    resolver: zodResolver(twoFactorAuthSchema),
  });

  async function handleSubmit() {
    setLoading(true);
  }

  return (
    <div className="w-full overflow-hidden px-[38px]  p-[38px] pt-[102px] h-full font-inter flex flex-col gap-[28px]">
      <div className="flex flex-col gap-3">
        <p className="text-[32px] font-medium leading-[100%]">
          Two-factor recovery
        </p>
        <p className="text-button-filter-text">
          If you are unable to access your mobile device, enter one of your
          recovery codes to verify your identity.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className=" flex flex-col"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[15px]">Recovery code</FormLabel>
                <FormControl className="relative ">
                  <InputOTP
                    maxLength={8}
                    autoFocus={true}
                    minLength={8}
                    className={"flex gap-2"}
                    value={field.value}
                    placeholder="XXXXXXXX"
                    onChange={(e) => {
                      // Allow only numeric input
                      field.onChange(e);
                    }}
                  >
                    {[...Array(4)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="rounded-[8px] w-[62px]"
                      />
                    ))}
                    <InputOTPSeparator className="[&_svg]:w-[8px]" />
                    {[...Array(4)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index + 4}
                        className="rounded-[8px] w-[62px]"
                      />
                    ))}
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />
          <SpinnerButton
            type="submit"
            className={` mt-11  ${
              !form.formState.isValid ? "bg-text-darkGray" : "bg-primary"
            } w-full`}
            disabled={!form.formState.isValid}
            loading={loading}
          >
            Verify
          </SpinnerButton>
        </form>
      </Form>

      <Link
        href={"/sign-in/verify-two-factor"}
        className="text-primary text-center"
      >
        Use your authenticator app
      </Link>
    </div>
  );
}
