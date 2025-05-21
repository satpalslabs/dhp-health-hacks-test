import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const InputTooltip = ({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-inter">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InputTooltip;
