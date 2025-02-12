import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TableCellsProps {
  type: string;
  children: React.ReactNode;
}

const TableCells: React.FC<
  TableCellsProps & React.HTMLAttributes<HTMLElement>
> = ({ type, children, className, ...props }) => {
  switch (type) {
    case "text":
      return <div className={cn(`lowercase ${className}`)}>{children}</div>;
    case "button":
      return (
        <Button
          variant="ghost"
          className={cn(`pl-0 hover:bg-transparent ${className}`)}
          {...props}
        >
          {children}
        </Button>
      );
    case "color":
      return (
        <div
          className={cn(
            `capitalize h-fit py-1 px-2 w-fit rounded text-sm ${className}`
          )}
          {...props}
        >
          {children}
        </div>
      );
    default:
      return null; // Ensure a default case
  }
};

export default TableCells;
