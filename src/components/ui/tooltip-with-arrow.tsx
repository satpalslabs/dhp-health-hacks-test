"use client";

import type * as React from "react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWithArrowProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  open?: boolean | undefined;
}

export function TooltipWithArrow({
  content,
  children,
  side = "top",
  align = "center",
  className,
  open,
}: TooltipWithArrowProps) {
  return (
    <Tooltip open={open}>
      <TooltipTrigger className="w-full">{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={`cursor-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
        <TooltipArrow
          className="fill-popover popoverArrow"
          width={20}
          height={7}
        />
      </TooltipContent>
    </Tooltip>
  );
}
