"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const spinnerVariants =
  "w-8 h-8 border-[3px] border-t-[3px] border-gray-200 border-t-gray-600  dark:border-gray-800 dark:border-t-gray-400 rounded-full animate-spin";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <div ref={ref} className={cn(spinnerVariants, className)} {...rest} />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
