"use client";

import { LogOut, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Moon from "@/moon-01.svg";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { deleteCookie } from "@/lib/cookie-service";
import { useContext } from "react";
import { AuthContext, User } from "../providers/auth-provider";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTheme } from "next-themes";

export const NavUser = () => {
  const currentUser: User | null = useContext(AuthContext);
  const { setTheme, resolvedTheme } = useTheme();
  if (!resolvedTheme) {
    return;
  }
  return (
    <SidebarMenu>
      <div className="border-t border-border p-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:p-0 overflow-hidden transition-[width] w-full">
        <Tabs
          defaultValue={resolvedTheme}
          value={resolvedTheme}
          className="w-full"
          onValueChange={(e) => {
            setTheme(e);
          }}
        >
          <TabsList className="w-full p-1 rounded-xl gap-1 px-1">
            <TabsTrigger value="light" className="w-1/2 rounded-lg">
              <Sun />
            </TabsTrigger>
            <TabsTrigger value="dark" className="w-1/2 rounded-lg">
              <Moon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
            <span className="truncate font-semibold">{currentUser?.name}</span>
            <span className="truncate text-sm">{currentUser?.role}</span>
            <span className="truncate text-xs">{currentUser?.email}</span>
          </div>
          <LogOut className="ml-auto size-4" onClick={deleteCookie} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
