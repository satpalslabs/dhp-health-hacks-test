"use client";

import { Check, CheckCircleIcon, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-provider";
import { useTheme } from "next-themes";
import SwitchTheme from "../ui/theme-switcher";
import { logOut } from "@/lib/utils/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  getActiveENV,
  getUserCredentials,
  setActiveENV,
} from "@/lib/utils/environment/cookie-services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldWrapper from "../ui/form-field-wrapper";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button, SpinnerButton } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { signIN } from "@/lib/utils/auth/sign-in";
import nProgress from "nprogress";
import { toast } from "@/hooks/use-toast";

export const NavUser = () => {
  const { user: currentUser, setRefetch } = useContext(AuthContext);
  const { setTheme, resolvedTheme } = useTheme();
  if (!resolvedTheme) {
    return;
  }
  return (
    <SidebarMenu>
      <div className="px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:p-0 overflow-hidden transition-[width] w-full">
        <EnvSwitcher />
      </div>
      <div className="border-t border-border p-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:p-0 overflow-hidden transition-[width] w-full">
        <SwitchTheme theme={resolvedTheme} setTheme={setTheme} />
      </div>
      <SidebarMenuItem className="border-t border-border px-2 group-data-[collapsible=icon]:px-0">
        <SidebarMenuButton
          size={null}
          className="hover:bg-transparent hover:text-none active:bg-transparent active:text-none"
        >
          <div className="flex justify-center group-data-[collapsible=icon]:!min-w-[calc(var(--sidebar-width-icon)-16px)]">
            <Avatar className="h-8 w-8 rounded-lg ">
              <AvatarImage
                src={"https://github.com/shadcn.png"}
                alt={"avatar"}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight min-h-fit">
            <span className="truncate font-semibold">
              {currentUser?.displayName}
            </span>
            <span className="truncate text-sm">{currentUser?.role}</span>
            <span className="truncate text-xs">{currentUser?.email}</span>
          </div>
          <LogOut
            className="ml-auto size-4"
            onClick={async () => {
              await logOut();
              setRefetch((prev) => !prev);
            }}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const environments = [
  { name: "production", bg_color: "#478B60" },
  { name: "staging", bg_color: "#E9AB11" },
  { name: "development", bg_color: "#D87B1F" },
  { name: "experimental", bg_color: "#CC5248" },
];
const EnvSwitcher = () => {
  const [activeEnv, setActiveEnv] = useState<{
    name: string;
    bg_color: string;
  }>();
  const [selectedEnv, setSelectedEnv] = useState(activeEnv?.name);
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-border bg-muted hover:bg-muted hover:text-foreground focus-visible:ring-0  transition-all "
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: ` linear-gradient(${activeEnv?.bg_color + "57"} ,${
                  activeEnv?.bg_color
                })`,
              }}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-sm leading-5 font-inter text-sidebar-foreground font-semibold capitalize">
                {activeEnv?.name}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width]  min-w-56 rounded-lg mb-1"
          align="start"
          side={isMobile ? "bottom" : "top"}
          sideOffset={4}
        >
          {environments.map((env, ix) => (
            <DropdownMenuItem
              key={ix}
              onClick={() => {
                setSelectedEnv(env.name);
                setDefaultValues(env.name);
              }}
              className="gap-2 p-2 capitalize"
            >
              <div className="flex items-center justify-center ">
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
      <LoginDialogue
        open={open}
        setOpen={setOpen}
        selectedEnv={selectedEnv ?? "experimental"}
      />
    </>
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
  }, [selectedEnv, open]);

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
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => {
                const activeEnv = environments.find(
                  (i) => i.name == field.value
                );
                return (
                  <FormItem>
                    <FormLabel className="flex grow gap-1 font-inter text-sm items-center">
                      <span className="capitalize">Environment</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex gap-3">
                      <Popover modal={true}>
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
                                    onClick={() => {
                                      field.onChange(env.name);
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
