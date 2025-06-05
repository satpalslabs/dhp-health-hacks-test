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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { signIN } from "@/lib/utils/auth/sign-in";
import { getActiveENV } from "@/lib/utils/environment/cookie-services";
import { SelectENVField } from "@/components/ui/env-switcher";

// Define form validation schema using Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  environment: z.string().min(1, {
    message: "Environment is required.",
  }),
});

export default function LoginPage() {
  // Initialize the form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      environment: "experimental",
    },
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getActiveEnv() {
      const storedEnv = await getActiveENV();
      if (storedEnv) {
        form.setValue("environment", storedEnv, {
          shouldValidate: true,
        });
      }
    }
    getActiveEnv();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    nProgress.start();
    try {
      const result = await signIN(values);
      if (result.success) {
        nProgress.done();
        if (result.user.is2fa_enabled) {
          router.push(result.redirectTo);
        } else {
          router.push("/sign-in/enable-two-factor");
          setLoading(false);
          // toast({
          //   title: (
          //     <div className="flex items-center gap-2">
          //       <CheckCircleIcon className="w-5 h-5" />
          //       <span>Login Successfully</span>
          //     </div>
          //   ) as unknown as string,
          //   description: "You have logged in successfully.",
          //   variant: "default", // consider using "success" if you have a custom variant
          //   duration: 3000, // 3s display time, adjust as needed
          // });
        }
      }
    } catch (er) {
      nProgress.done();
      setLoading(false);
      toast({
        title: "Invalid Credentials",
        description:
          er instanceof Error ? er.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full overflow-hidden p-[38px] pt-[102px] font-inter flex flex-col gap-[28px] h-full">
      <div className="flex flex-col gap-3">
        <p className="text-[32px] font-medium leading-[100%]">Login</p>
        <p className="text-button-filter-text">
          Welcome back! Please enter your details
        </p>
      </div>
      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 font-inter"
        >
          <SelectENVField control={form.control} />

          {/* Email Input Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-[red]">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your email address..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password Input Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-[red]">*</span>
                </FormLabel>
                <FormControl className="relative">
                  <span className="[&_svg]:size-5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-[19px] translate-y-1/2 -translate-x-1/2"
                      onClick={() => {
                        setShowPassword((prev: boolean) => !prev);
                      }}
                    >
                      {showPassword ? <EyeIcon /> : <EyeOff />}
                    </button>
                  </span>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <SpinnerButton
            type="submit"
            className={`${
              !form.getValues().email ||
              !form.getValues().password ||
              !form.getValues().environment
                ? "bg-text-darkGray"
                : "bg-primary"
            } w-full mt-3`}
            disabled={
              !form.getValues().email ||
              !form.getValues().password ||
              !form.getValues().environment
            }
            loading={loading}
          >
            Continue
          </SpinnerButton>
        </form>
      </Form>
    </div>
  );
}
