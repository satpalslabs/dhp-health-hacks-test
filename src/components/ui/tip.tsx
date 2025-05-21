import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { previewTip } from "../cms/articles/add-edit-articles/form-drawers/select-existing-tip-form";
import Image from "next/image";
import { Pack } from "@/types";
import { PacksContext } from "../../context/pack-data-provider";

const Tip = ({ tip: tipData }: { tip: previewTip }) => {
  const tip = useDeferredValue(tipData);
  const { packs } = useContext(PacksContext);
  const [tipCategory, setTipCategory] = useState<Pack | undefined>();

  useEffect(() => {
    let _tipCategory = tip.tipCategory;
    if (!_tipCategory) {
      _tipCategory = packs.find(
        (i) => i.id && tip.tips_categories.includes(i.id)
      );
    }
    setTipCategory(_tipCategory);
  }, [tip]);

  return (
    <div
      className={`w-full max-w-[280px] min-h-[254px] overflow-hidden bg-no-repeat break-words shrink-0 p-4 flex flex-col gap-[17px] justify-between rounded-xl relative bg-button-filter-background ${
        tip.tipCategory
          ? `text-white`
          : "text-black group-data-[mode='dark']:text-white"
      }`}
      style={{
        backgroundColor: tipCategory ? tipCategory.background_color : undefined,
        backgroundImage: tipCategory?.bg_image
          ? `url(${tipCategory.bg_image.url})`
          : undefined,
        boxShadow: "var(--mobile-card-shadow)",
      }}
    >
      <div className=" flex flex-col gap-[11px] font-poppins">
        <p className="font-medium text-lg leading-[27px]">{tip.title}</p>
        <p className=" text-sm">{tip.description}</p>
      </div>
      <div className=" flex flex-col gap-[13px] font-poppins">
        {tipCategory && (
          <div
            className="text-xs px-3 py-1 bg-white/25 w-fit rounded"
            style={{
              color: tipCategory?.category_and_button_color,
            }}
          >
            {tipCategory?.name}
          </div>
        )}
        <button
          className="h-[40px] w-full text-center bg-white rounded-full"
          style={{
            color: tipCategory?.category_and_button_color ?? "black",
          }}
        >
          Learn more
        </button>
      </div>
      {tipCategory?.icon && (
        <Image
          src={tipCategory.icon ? tipCategory.icon?.url ?? "" : ""}
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
