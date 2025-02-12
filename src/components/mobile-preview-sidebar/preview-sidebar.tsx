"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function PreviewSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className=" text-text-foreground"
      side="right"
    >
      <SidebarHeader className="flex h-[67px] flex-row items-center justify-between p-4">
        <p className="text-lg font-medium">Preview</p>
      </SidebarHeader>
      <SidebarContent className="border-t border-border grow">
        {children}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
