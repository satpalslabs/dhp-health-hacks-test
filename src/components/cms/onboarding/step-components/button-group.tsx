import { Button } from "@/components/ui/button";
import React from "react";

const ButtonGroup = ({ groupData }: { groupData: { text: string }[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {groupData.map((data, index) => (
        <Button
          key={index}
          className="!bg-onboarding-card-button cursor-text hover:shadow-none h-[34px] font-mulish font-semibold text-[13px] leading-[17px] rounded-full px-[14px] text-mobile-text-heading"
        >
          {data.text}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;
