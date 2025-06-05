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

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import Link from "next/link";
import { verifySecretKey } from "@/lib/utils/auth/2FA/verify-token";
import { saveUserTokens } from "@/lib/utils/auth/save-tokens";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

const twoFactorAuthSchema = z.object({
  otp: z.string().min(6),
});

const VerificationTwoFactor = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof twoFactorAuthSchema>>({
    resolver: zodResolver(twoFactorAuthSchema),
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const verified = await verifySecretKey(form.getValues().otp);
      if (verified) {
        await saveUserTokens();
        router.push("/articles");
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>Login Successfully</span>
            </div>
          ) as unknown as string,
          description: "You have logged in successfully.",
          variant: "default", // consider using "success" if you have a custom variant
          duration: 3000, // 3s display time, adjust as needed
        });
      } else {
        setLoading(false);
        toast({
          title: "Two-factor code verification failed. ",
          description: `Please try again later. `,
          variant: "destructive",
          className: "border border-red-500 bg-red-50 text-red-900",
        });
      }
    } catch (er) {
      setLoading(false);
      console.error(er);
      toast({
        title: "Two-factor code verification failed. ",
        description: `${er}, Please try again later. `,
        variant: "destructive",
        className: "border border-red-500 bg-red-50 text-red-900",
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[32px] font-medium leading-[100%]">
          Two-factor authentication
        </p>
        <p className="text-button-filter-text">
          Open your two-factor authenticator (TOTP) app or browser extension to
          view your authentication code.{" "}
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
                <FormLabel className="text-[15px]">
                  Authentication code
                </FormLabel>
                <FormControl className="relative ">
                  <InputOTP
                    maxLength={6}
                    autoFocus={true}
                    minLength={6}
                    className={"flex gap-2"}
                    value={field.value}
                    placeholder="000000"
                    onChange={(e) => {
                      // Allow only numeric input
                      const numericValue = e.replace(/\D/g, "");
                      field.onChange(numericValue);
                    }}
                  >
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
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
        href={"/sign-in/recovery-two-factor"}
        className="text-primary text-center"
      >
        Use a recovery code or begin 2FA account recovery
      </Link>
    </>
  );
};

export default VerificationTwoFactor;
