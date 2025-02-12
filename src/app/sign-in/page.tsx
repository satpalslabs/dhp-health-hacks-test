"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import staticAuthUsers from "./static-auth-data.json";
import { Button } from "@/components/ui/button";
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
import { cookieHandler } from "@/lib/cookie-service";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Define form validation schema using Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must contain at least 8 characters",
  }),
});

export default function ProfileForm() {
  // Initialize the form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if the entered credentials match a static user
    const authUser = staticAuthUsers.find(
      (item: { email: string; password: string; role: string }) =>
        item.email === values.email && item.password === values.password
    );

    if (authUser) {
      // Set user credentials in cookies
      cookieHandler(values);
    } else {
      // Show an error message if authentication fails
      toast({
        title: "Invalid Credentials",
        description: "Please try again later!",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center h-screen justify-center">
      <div className="max-w-[500px] w-full flex flex-col h-fit gap-10 border border-border shadow-lg p-10 rounded-lg">
        {/* Logo Section */}
        <div className="w-full flex  justify-center">
          <Image
            src={"/dhp-logo.png"}
            height={1000}
            width={1000}
            alt="logo"
            className="h-[150px] dark:hidden w-auto"
          />
          <Image
            src={"/dark-logo.png"}
            height={1000}
            width={1000}
            alt="logo"
            className="h-[150px] dark:block hidden w-auto"
          />
        </div>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="float-end">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
