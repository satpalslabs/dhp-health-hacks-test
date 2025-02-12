import React, { useContext, useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Group, subMenuItem } from "./sidebar-data";
import { AuthContext, User } from "../providers/auth-provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SidebarGroups = ({ group, ix }: { group: Group; ix: number }) => {
  const currentUser = useContext(AuthContext) as User;

  const accessAbleMenus = currentUser
    ? group.subMenuItems.filter((i: subMenuItem) =>
        i.canAccess.includes(
          currentUser.role.trim().toLowerCase().replace(/\s+/g, "-")
        )
      )
    : [];
  if (accessAbleMenus.length == 0) {
    return;
  }
  return (
    <SidebarGroup className={`${ix != 0 && "border-t"} border-border `}>
      <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {accessAbleMenus.map((item: subMenuItem, ix: number) => (
            <CustomSideBarMenu item={item} key={ix} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarGroups;

const CustomSideBarMenu = ({ item }: { item: subMenuItem }) => {
  const currentUser = useContext(AuthContext) as User;
  const pathname = usePathname();

  const accessAbleSubMenus = item.items.filter((i) =>
    currentUser
      ? i.canAccess.includes(
          currentUser.role.trim().toLowerCase().replace(/\s+/g, "-")
        )
      : []
  );

  const hasChildren = accessAbleSubMenus.length > 0;
  const [isOpen, setIsOpen] = useState(false); // Track state for this item only

  useEffect(() => {
    if (pathname.includes(item.title)) {
      setIsOpen(true);
    }
  }, [item.title, pathname]);
  return (
    <SidebarMenuItem>
      {hasChildren ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full" asChild>
            <SidebarMenuButton
              isActive={pathname.includes(item.title.toLowerCase())}
              asChild
            >
              <Link href={item.url}>
                <div className="group-data-[collapsible=icon]:delay-100 group-data-[collapsible=icon]:min-w-[calc(var(--sidebar-width-icon)_-_theme(spacing.8))] max-w-full flex justify-center min-w-4 w-fit overflow-hidden h-fit transition-[min-width] duration-200">
                  <item.icon className="w-4 h-4 " />
                </div>
                <span className="text-nowrap"> {item.title}</span>
                <ChevronDown
                  className={`ml-auto group-data-[collapsible=icon]:hidden transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuSub>
              {accessAbleSubMenus.map((submenu, index) => (
                <CustomSideBarMenu key={index} item={submenu} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          isActive={pathname.includes(item.title.toLowerCase())}
          asChild
        >
          <Link href={item.url}>
            <div className="group-data-[collapsible=icon]:delay-100 group-data-[collapsible=icon]:min-w-[calc(var(--sidebar-width-icon)_-_theme(spacing.8))] max-w-full flex justify-center min-w-4 w-fit transition-[min-width] duration-200">
              <item.icon className="w-4 h-4 " />
            </div>
            <span className="text-nowrap">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};
