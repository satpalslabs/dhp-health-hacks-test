import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Plus } from "lucide-react";

interface ExtendedDialogContentProps extends ButtonProps {
  text?: string;
}
const AddButton = React.forwardRef<
  HTMLButtonElement,
  ExtendedDialogContentProps
>(({ className, text, ...props }, ref) => {
  return (
    <Button
      type={"button"}
      className={cn(
        "bg-muted text-primary font-inter hover:shadow-none dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    >
      <Plus /> {text ?? ""}
    </Button>
  );
});
AddButton.displayName = "button";

export { AddButton };
