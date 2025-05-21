"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Group } from "./sidebar-data";
import SidebarGroups from "./sidebar-group";

export function GroupSwitcher({ groups }: { groups: Group[] }) {
  const { isMobile } = useSidebar();
  const [activeGroup, setActiveGroup] = React.useState(groups[0]);
  return (
    <>
      <SidebarMenu className="[&_div]:font-inter p-2">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-border hover:bg-muted hover:text-foreground focus-visible:ring-0  transition-all "
              >
                <div className="group-data-[collapsible=icon]:delay-100 group-data-[collapsible=icon]:min-w-[calc(var(--sidebar-width-icon)_-_theme(spacing.4))] max-w-full flex justify-center min-w-4 w-fit overflow-hidden h-fit transition-[min-width] duration-200">
                  <div className="aspect-square size-8 items-center rounded-lg bg-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:delay-100  max-w-full flex justify-center overflow-hidden h-fit transition-[min-width] duration-200">
                    <activeGroup.icon className="size-4" />
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-sm leading-5 font-inter text-sidebar-foreground font-semibold">
                    {activeGroup.name}
                  </span>
                  {/* <span className="truncate text-xs">{activeGroup.}</span> */}
                </div>
                <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width]  min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              {groups.map((group, ix) => (
                <DropdownMenuItem
                  key={ix}
                  onClick={() => setActiveGroup(group)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <group.icon className="size-4 shrink-0" />
                  </div>
                  {group.name}
                  <DropdownMenuShortcut>⌘{ix + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarContent className="border-t border-border  overflow-auto no-scrollbar">
        <SidebarGroups group={activeGroup} />
      </SidebarContent>
    </>
  );
}
