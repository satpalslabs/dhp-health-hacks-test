/* eslint-disable  @typescript-eslint/no-explicit-any */

import { FileVideo, HelpCircle, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DropDownMenuAddStep = ({ onAddStep, setOpen }: any) => {
  console.log(onAddStep);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-lg text-primary font-inter bg-muted dark:text-white"
        >
          <Plus size={10} />
          Add Step
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[236px] left-0">
        <DropdownMenuItem
          onClick={() => {
            setOpen(true);
          }}
        >
          <HelpCircle /> Question
        </DropdownMenuItem>

        <DropdownMenuItem>
          <FileVideo /> Action
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileVideo /> Drop Down
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuAddStep;
