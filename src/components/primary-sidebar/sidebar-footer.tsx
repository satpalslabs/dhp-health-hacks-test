"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-provider";
import { useTheme } from "next-themes";
import SwitchTheme from "../ui/theme-switcher";
import { logOut } from "@/lib/utils/auth/logout";

export const NavUser = () => {
  const { user: currentUser, setRefetch } = useContext(AuthContext);
  const { setTheme, resolvedTheme } = useTheme();
  if (!resolvedTheme) {
    return;
  }
  return (
    <SidebarMenu>
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
