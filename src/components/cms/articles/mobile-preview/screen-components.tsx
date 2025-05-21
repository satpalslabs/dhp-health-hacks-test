import React from "react";
import { activeData } from ".";
import LeftArrow from "@/left-arrow.svg";
import Image from "next/image";

export const ScreenHeader = ({
  activeData,
  setActiveData,
}: {
  activeData: activeData;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  return (
    <div
      className="sticky -top-0 py-[17px] z-20 w-full text-lg text-center font-mulish font-semibold bg-mobile-primary text-white"
      style={{
        backgroundColor: activeData?.bg_color ?? "hsl(var(--mobile-primary))",
      }}
    >
      <div
        className={`relative text-center`}
        style={{
          color:
            activeData.section?.section_name == "Young Epilepsy"
              ? "hsl(var(--mobile-first-section))"
              : "white",
        }}
      >
        <button
          onClick={() => {
            setActiveData((prev) => {
              prev.pop();
              return [...prev];
            });
          }}
        >
          <LeftArrow
            className={
              "h-[24px] w-auto absolute left-6 top-1/2 -translate-y-1/2"
            }
          />
        </button>
        {activeData.section?.section_name ?? "Health Hacks"}
      </div>
    </div>
  );
};

export const SectionDetails = ({ activeData }: { activeData: activeData }) => {
  if (activeData.section || activeData.article?.source) {
    return (
      <div className="flex gap-4 items-center w-fit">
        {(activeData.section?.section_icon?.url ||
          activeData.article?.source?.logo?.url) && (
          <Image
            src={
              activeData.section?.section_icon?.url ||
              activeData.article?.source?.logo?.url ||
              ""
            }
            alt="section ICon"
            width={300}
            height={300}
            className="w-12 h-auto"
          />
        )}
        <div className="font-mulish font-semibold text-base leading-[21px]">
          Content supplied by <br />
          {activeData.section?.section_name || activeData.article?.source?.name}
        </div>
      </div>
    );
  }
};
