import React, { useDeferredValue } from "react";
import Image from "next/image";
import { Tip as TypeTip } from "@/types";

const Tip = ({ tip: tipData }: { tip: TypeTip }) => {
  const tip = useDeferredValue(tipData);

  return (
    <div
      className={`w-full max-w-[280px] min-h-[254px] overflow-hidden bg-no-repeat break-words shrink-0 p-4 flex flex-col gap-[17px] justify-between rounded-xl relative bg-button-filter-background ${
        tip.tips_categories?.length > 0
          ? `text-white`
          : "text-black group-data-[mode='dark']:text-white"
      }`}
      style={{
        backgroundColor:
          tip.tips_categories?.length > 0
            ? tip.tips_categories[0].background_color
            : undefined,
        backgroundImage:
          tip.tips_categories?.length > 0
            ? tip.tips_categories[0].bg_image
              ? `url(${tip.tips_categories[0].bg_image.url})`
              : undefined
            : undefined,
        boxShadow: "var(--mobile-card-shadow)",
      }}
    >
      <div className=" flex flex-col gap-[11px] font-poppins">
        <p className="font-medium text-lg leading-[27px]">{tip.title}</p>
        <p className=" text-sm">{tip.description}</p>
      </div>
      <div className=" flex flex-col gap-[13px] font-poppins">
        {tip.tips_categories.length > 0 && (
          <div
            className="text-xs px-3 py-1 bg-white/25 w-fit rounded"
            style={{
              color:
                tip.tips_categories[0].category_and_button_color ?? "black",
            }}
          >
            {tip.tips_categories[0]?.name}
          </div>
        )}
        <button
          className="h-[40px] w-full text-center bg-white rounded-full"
          style={{
            color: tip.tips_categories[0]?.category_and_button_color ?? "black",
          }}
        >
          Learn more
        </button>
      </div>
      {tip.tips_categories[0]?.icon && (
        <Image
          src={
            tip.tips_categories[0].icon
              ? tip.tips_categories[0].icon?.url ?? ""
              : ""
          }
          alt="icon"
          className="absolute top-6 right-6 w-[90px] h-auto"
          height={300}
          width={300}
        />
      )}
    </div>
  );
};

export default Tip;
