import { ReactNode } from "react";
import { TooltipWithArrow } from "../ui/tooltip-with-arrow";

const TooltipCell = ({
  content,
  children,
}: {
  content: string | ReactNode;
  children: ReactNode;
}) => (
  <TooltipWithArrow
    content={content}
    className="max-h-[400px] overflow-y-auto"
    side="left"
  >
    {children}
  </TooltipWithArrow>
);

export default TooltipCell;
