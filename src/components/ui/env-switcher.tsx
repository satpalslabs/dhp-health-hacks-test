"use client";

import { AuthContext } from "@/context/auth-provider";
import {
  getActiveENV,
  getUserCredentials,
  setActiveENV,
} from "@/lib/utils/environment/cookie-services";
import { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Check, CheckCircleIcon, ChevronsUpDown, Tag } from "lucide-react";
import { z } from "zod";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import nProgress from "nprogress";
import { signIN } from "@/lib/utils/auth/sign-in";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button, SpinnerButton } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import FormFieldWrapper from "./form-field-wrapper";
import { Input } from "./input";

export const environments = [
  { name: "production", bg_color: "#478B60" },
  { name: "staging", bg_color: "#E9AB11" },
  { name: "development", bg_color: "#964B00" },
  { name: "experimental", bg_color: "#FF0000" },
];

const EnvSwitcher = () => {
  const [activeEnv, setActiveEnv] = useState<{
    name: string;
    bg_color: string;
  }>();
  const [selectedEnv, setSelectedEnv] = useState(activeEnv?.name);
  const [open, setOpen] = useState(false);
  const { setRefetch } = useContext(AuthContext);

  useEffect(() => {
    getActiveEnv();
  }, []);

  async function getActiveEnv() {
    const storedEnv = await getActiveENV();
    const activeENV = environments.find((i) => i.name == storedEnv);
    if (activeENV) {
      setActiveEnv(activeENV);
    }
  }
  const setDefaultValues = async (selectedEnv: string) => {
    try {
      const user = await getUserCredentials(selectedEnv);
      if (user) {
        await setActiveENV(selectedEnv);
        const res = await fetch("/api/auth/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        setRefetch((prev) => !prev);
      } else {
        setOpen(true);
      }
    } catch (er) {
      if (activeEnv) {
        await setActiveENV(activeEnv.name);
      }
      setOpen(true);
      console.error(er);
    }
  };
  return (
    <div className="flex gap-0 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <Button className="!bg-transparent !text-foreground focus-visible:ring-0 h-fit py-1 !w-[120px] px-2 transition-all ">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: ` linear-gradient(${activeEnv?.bg_color + "57"} ,${
                  activeEnv?.bg_color
                })`,
              }}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-xs leading-5 font-inter text-sidebar-foreground font-medium capitalize">
                {activeEnv?.name}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] gap-1 min-w-56 rounded-lg"
          align="start"
          side={"top"}
          sideOffset={4}
        >
          {environments.map((env, ix) => (
            <DropdownMenuItem
              key={ix}
              onClick={() => {
                setSelectedEnv(env.name);
                setDefaultValues(env.name);
              }}
              className="gap-2 p-2 capitalize text-xs font-inter font-medium"
            >
              <div className="flex items-center  justify-center ">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: ` linear-gradient( ${env.bg_color + "57"},${
                      env.bg_color
                    })`,
                  }}
                />
              </div>
              {env.name}
              <Check
                className={`ml-auto ${
                  activeEnv?.name === env.name ? "opacity-100" : "opacity-0"
                }`}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="!bg-transparent  [&_svg]:size-3 !text-muted-foreground text-xs flex items-center gap-[6px] focus-visible:ring-0 h-fit py-1 !w-fit px-2 transition-all ">
        <Tag />v{process.env.NEXT_PUBLIC_APP_VERSION}
      </Button>
      <LoginDialogue
        open={open}
        setOpen={setOpen}
        selectedEnv={selectedEnv ?? "experimental"}
      />
    </div>
  );
};

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

const LoginDialogue = ({
  open,
  setOpen,
  selectedEnv,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  selectedEnv: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { setRefetch } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      environment: "experimental",
    },
  });

  useEffect(() => {
    form.setValue("environment", selectedEnv, {
      shouldValidate: true,
    });
  }, [selectedEnv, open, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    nProgress.start();
    try {
      const result = await signIN(values);
      if (result.success) {
        nProgress.done();
        setRefetch((prev) => !prev);
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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        form.reset();
      }}
    >
      <DialogContent
        className="min-w-[514px]  font-inter p-6"
        // showOverlay={false}
      >
        <DialogHeader>
          <DialogTitle className="font-inter font-semibold text-2xl leading-[30px] pb-[9px]">
            Login
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-[14px] font-inter"
          >
            <SelectENVField control={form.control} />
            {/* Email Input Field */}
            <FormFieldWrapper
              component={Input}
              type="email"
              control={form.control}
              name="email"
              placeholder="email@example.com"
              label="Email"
              required
              disable={loading}
              showTooltip={false}
            />
            {/* Password Input Field */}
            <FormFieldWrapper
              component={Input}
              type="password"
              placeholder="password"
              label="Password"
              control={form.control}
              name="password"
              required
              disable={loading}
              showTooltip={false}
            />
            <div>
              <SpinnerButton
                type="submit"
                className="bg-primary w-full mt-[29px]"
                loading={loading}
              >
                Continue
              </SpinnerButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnvSwitcher;

export function SelectENVField({
  control,
}: {
  control: Control<z.infer<z.ZodType>>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <FormField
      control={control}
      name="environment"
      render={({ field }) => {
        const activeEnv = environments.find((i) => i.name == field.value);
        return (
          <FormItem>
            <FormLabel className="flex grow gap-1 font-inter text-sm items-center">
              <span className="capitalize">Environment</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <div className="flex gap-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal relative hover:bg-transparent data-[state='open']:border-foreground font-inter"
                    >
                      {field.value ? (
                        <div
                          className={`flex gap-4 items-center relative font-inter p-2 text-sm rounded-md w-full grow capitalize`}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              background: ` linear-gradient(${
                                activeEnv?.bg_color + "57"
                              } ,${activeEnv?.bg_color})`,
                            }}
                          />
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-sm leading-5 font-inter text-sidebar-foreground font-semibold capitalize">
                              {activeEnv?.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          Select Environment
                        </span>
                      )}

                      <ChevronsUpDown className="text-gray-500 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] border border-border rounded-md p-0 my-2">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No Environment found.</CommandEmpty>
                      <CommandGroup>
                        {environments.map((env, ix) => (
                          <CommandItem
                            key={ix}
                            onSelect={() => {
                              field.onChange(env.name);
                              setOpen(false);
                            }}
                            className="gap-2 p-2 capitalize"
                          >
                            <div className="flex items-center justify-center ">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{
                                  background: ` linear-gradient( ${
                                    env.bg_color + "57"
                                  },${env.bg_color})`,
                                }}
                              />
                            </div>
                            {env.name}
                            <Check
                              className={`ml-auto ${
                                activeEnv?.name === env.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
