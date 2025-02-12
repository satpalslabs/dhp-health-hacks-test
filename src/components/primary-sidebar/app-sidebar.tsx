"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { NavUser } from "./sidebar-footer";
import sideBarGroups, { Group } from "./sidebar-data";
import SidebarGroups from "./sidebar-group";

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="gap-2 text-text-foreground max-h-screen overflow-hidden"
    >
      <SidebarHeader className="flex py-3 flex-row items-center justify-between">
        <Image
          src={"/dhp-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          className="h-[43px] w-fit dark:hidden group-data-[collapsible=icon]:hidden"
        />
        <Image
          src={"/dark-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          className="h-[43px] w-fit dark:block hidden group-data-[collapsible=icon]:hidden"
        />
        <Image
          src={"/sm-dhp-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          className="h-[43px] w-fit hidden group-data-[collapsible=icon]:block"
        />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="border-t border-border">
        {sideBarGroups.map((group: Group, ix: number) => (
          <SidebarGroups group={group} ix={ix} key={ix} />
        ))}
      </SidebarContent>
      <SidebarFooter className="px-0 pt-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
