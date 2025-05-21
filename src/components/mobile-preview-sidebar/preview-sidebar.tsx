"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function PreviewSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className=" text-text-foreground "
      side="right"
    >
      <SidebarHeader className="flex h-[67px] flex-row items-center justify-between p-4">
        <p className="text-lg font-medium">Preview</p>
      </SidebarHeader>
      <SidebarContent
        className={cn("border-t border-border grow pb-0", className)}
      >
        {children}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
