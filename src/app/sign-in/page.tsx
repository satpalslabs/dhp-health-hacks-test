"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, SpinnerButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { CheckCircleIcon, EyeIcon, EyeOff } from "lucide-react";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { signIN } from "@/lib/utils/auth/sign-in";
import { SelectOptions } from "@/components/cms/articles/add-edit-articles/form-components/render-webpage-component";
import { getActiveENV } from "@/lib/utils/environment/cookie-services";

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

export default function ProfileForm() {
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
  // Handle form submission

  useEffect(() => {
    getActiveEnv();
  }, []);

  async function getActiveEnv() {
    const storedEnv = await getActiveENV();
    if (storedEnv) {
      form.setValue("environment", storedEnv, {
        shouldValidate: true,
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    nProgress.start();
    try {
      const result = await signIN(values);
      if (result.success) {
        nProgress.done();
        router.push(result.redirectTo);
        setLoading(false);
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
    <div className="flex items-center justify-center gap-8 h-screen ">
      <div className="flex w-fit gap-8 h-fit rounded-lg overflow-hidden border border-border shadow-lg">
        <div className="h-[600px] shrink-0 w-[600px] bg-primary flex items-center justify-center ">
          <div className="w-full flex  justify-center">
            <Image
              src={"/dark-logo.png"}
              height={1000}
              width={1000}
              alt="logo"
              className="h-[150px] w-auto"
            />
          </div>
        </div>
        <div className="flex items-center shrink-0 justify-center h-[600px] w-[600px]">
          <div className="max-w-[500px] w-full flex flex-col h-fit gap-8  p-10 ">
            {/* Logo Section */}
            <p className="w-full text-[52px] font-inter font-semibold mb-4">
              Welcome Back!
            </p>
            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 font-inter"
              >
                <SelectOptions
                  control={form.control}
                  label="Environment"
                  required
                  name="environment"
                  options={[
                    "experimental",
                    "development",
                    "staging",
                    "production",
                  ]}
                  tooltip="Select Environment to logged in"
                />
                {/* Email Input Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Password</FormLabel>
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
                <Button
                  type="button"
                  className="text-right !mt-2  h-fit w-fit float-end p-0 bg-transparent text-foreground font-inter font-normal hover:shadow-none"
                >
                  Forgot password?
                </Button>

                {/* Submit Button */}
                <SpinnerButton
                  type="submit"
                  className={`${
                    !form.getValues().email ||
                    !form.getValues().password ||
                    !form.getValues().environment
                      ? "bg-text-darkGray"
                      : "bg-primary"
                  } w-full`}
                  disabled={
                    !form.getValues().email ||
                    !form.getValues().password ||
                    !form.getValues().environment
                  }
                  loading={loading}
                >
                  Submit
                </SpinnerButton>
              </form>
            </Form>
          </div>
          {/* Toast notifications */}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
