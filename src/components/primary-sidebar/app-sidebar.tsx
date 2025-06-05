"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { NavUser } from "./sidebar-footer";
import sideBarGroups, { Group, subMenuItem } from "./sidebar-data";
import { GroupSwitcher } from "./group-switcher";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-provider";
import { User } from "@/types";

export function AppSidebar() {
  const [accessAbleGroups, setAccessAbleGroups] = useState<Group[]>([]);
  const { user: currentUser }: { user: User | null } = useContext(AuthContext);

  useEffect(() => {
    const _accessAbleGroups = currentUser
      ? sideBarGroups.filter((group: Group) => {
          const menus = group.subMenuItems.filter((i: subMenuItem) =>
            i.canAccess.includes(
              currentUser.role.trim().toLowerCase().replace(/\s+/g, "-")
            )
          );
          if (menus.length == 0) {
            return false;
          }
          return true;
        })
      : [];
    setAccessAbleGroups(_accessAbleGroups);
  }, [currentUser]);

  return (
    <Sidebar
      collapsible="icon"
      className="!gap-0 text-text-foreground max-h-[calc(100vh-30px)] overflow-hidden"
    >
      <SidebarHeader className="flex py-3 flex-row items-center justify-between">
        <Image
          src={"/dhp-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          priority={false}
          placeholder="empty"
          className="h-[43px] w-[71.5px] dark:hidden group-data-[collapsible=icon]:hidden"
        />
        <Image
          src={"/dark-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          priority={false}
          className="h-[43px] w-[71.5px] dark:block hidden group-data-[collapsible=icon]:hidden"
        />
        <Image
          src={"/sm-dhp-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          priority={false}
          className="h-[43px] w-[39px] hidden group-data-[collapsible=icon]:block"
        />
        <SidebarTrigger />
      </SidebarHeader>
      <div className="grow grid grid-rows-[min-content_auto] overflow-hidden -mt-2">
        {accessAbleGroups.length > 0 && (
          <GroupSwitcher groups={accessAbleGroups} />
        )}
      </div>
      <SidebarFooter className="px-0 pt-0 ">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
