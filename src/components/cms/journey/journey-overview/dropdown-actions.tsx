import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import React from "react";

const DropdownActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="p-0 hover:bg-transparent focus-visible:ring-0 h-fit w-fit"
        >
          <EllipsisVertical className="stroke-gray-600 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 p-1"
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuGroup className="flex flex-col w-full ">
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
