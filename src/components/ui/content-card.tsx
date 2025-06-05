import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

export const cardVariants = cva(
  "rounded-[10px] group overflow-hidden flex group-data-[mode='dark']:bg-mobile-dark-article cursor-pointer w-full",
  {
    variants: {
      align: {
        vertical: "min-h-[216px] h-full w-[185px] flex-col gap-4",
        horizontal: "h-[122px]",
        grid: "h-[122px]",
      },
    },
    defaultVariants: {
      align: "vertical",
    },
  }
);
export interface CardContentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const ContentCard = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          boxShadow: "var(--mobile-card-shadow)",
        }}
        className={cn(cardVariants({ align, className }))}
        {...props}
        data-align={align}
      >
        {children}
      </div>
    );
  }
);
ContentCard.displayName = "Content Card";

export default ContentCard;
