import MobileHeader from "@/components/mobile-preview-sidebar/mobile-header";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PackTableRowType } from ".";
import { Pack, Section, Tip } from "@/types";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { PreviewPack } from "./manage-pack";
import "swiper/css";
import LeftArrow from "@/left-arrow.svg";
import { EllipsisVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipsContext } from "@/context/tips-data-provider";
import TipComponent from "@/components/ui/tip";
// import { SectionContext } from "@/components/providers/section-data-provider";
// import { SubSectionContext } from "@/components/providers/sub-section-data-provider";
// import { CollectionContext } from "@/components/providers/collection-data-provider";

interface PacksPreviewSectionType extends Section {
  packs?: PackTableRowType[];
}

export interface ActiveData {
  type: "pack";
  activePack: Pack;
  section?: PacksPreviewSectionType;
}

const PacksPreview = ({
  packs,
  initialActiveData = [],
}: {
  packs: PackTableRowType[];
  initialActiveData: ActiveData[];
}) => {
  const [sections, setSections] = useState<PacksPreviewSectionType[]>([]);
  const [activeData, setActiveData] = useState(initialActiveData);
  const swiperContainerRef = useRef<SwiperRef>(null);

  useEffect(() => {
    const _sections = packs.reduce((acc: PacksPreviewSectionType[], pack) => {
      const section = acc.find((s) => s.id === pack.section?.id);
      if (section) {
        section.packs?.push(pack);
      } else {
        if (pack.section) {
          acc.push({
            ...pack.section,
            packs: [pack],
          });
        }
      }
      return acc;
    }, []);
    setSections(_sections);
  }, [packs]);

  useEffect(() => {
    if (initialActiveData) {
      setActiveData(initialActiveData);
    }
  }, [initialActiveData]);
  return (
    <div
      className="flex transition-transform h-full"
      style={{
        transform: `translateX(calc(-${activeData.length * 100}%))`,
      }}
    >
      <div className="relative grid grid-rows-[min-content_auto] shrink-0 font-poppins  w-full h-full">
        <div className={`px-[25px] -mt-[8px] bg-mobile-primary text-white`}>
          <MobileHeader />
        </div>
        <div className="w-full shrink-0 overflow-y-auto no-scrollbar">
          <div className="sticky -top-0 py-[17px] z-20 bg-mobile-primary w-full text-lg text-center font-mulish font-semibold text-white">
            <div>Health Hacks</div>
          </div>
          <div className="flex flex-col gap-4 w-full mt-3 my-5">
            {sections.map((section, index) => (
              <div key={index}>
                <div className="flex justify-between items-end px-5 font-poppins font-semibold text-mobile-text-heading group-data-[mode='dark']:text-white  ">
                  <p className="text-lg">{section.section_name}</p>
                </div>
                <Swiper
                  ref={swiperContainerRef}
                  slidesPerView={"auto"}
                  spaceBetween={20}
                  direction="horizontal"
                  grabCursor={true}
                  className="-mt-2 !px-6  !cursor-grab"
                >
                  {section.packs?.map(
                    (pack: PackTableRowType, index: number) => (
                      <SwiperSlide
                        key={index}
                        className="!h-fit !w-[185px] mb-4  rounded-[10px] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveData([
                            {
                              type: "pack",
                              activePack: pack,
                              section: section,
                            },
                          ]);
                        }}
                      >
                        <PreviewPack
                          type={pack.type}
                          background_color={pack.background_color}
                          count={
                            pack.type == "quiz-pack"
                              ? pack.quizzes.length
                              : pack.tips.length
                          }
                          title={pack.name}
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative grid grid-rows-[min-content_auto] shrink-0 font-poppins  w-full ">
        <div className={`px-[25px] -mt-[8px] bg-mobile-primary text-white`}>
          <MobileHeader />
        </div>
        <div className="w-full shrink-0 grid grid-rows-[min-content_auto] overflow-y-auto no-scrollbar ">
          <div className="sticky -top-0 py-[17px] z-20 w-full text-lg text-center font-mulish font-semibold bg-mobile-primary text-white">
            {initialActiveData.length == 0 && (
              <button
                onClick={() => {
                  setActiveData([]);
                }}
              >
                <LeftArrow
                  className={
                    "h-[24px] w-auto absolute left-6 top-1/2 -translate-y-1/2"
                  }
                />
              </button>
            )}
            Health Hacks
          </div>
          <DetailedPreviewOfPacks activeData={activeData} />
        </div>
      </div>
    </div>
  );
};

export default PacksPreview;

const DetailedPreviewOfPacks = ({
  activeData,
}: {
  activeData: ActiveData[];
}) => {
  const [activePacks, setActivePacks] = useState<Pack[]>([]);
  const [tipsData, setTipsData] = useState<Tip[]>([]);
  const { tips } = useContext(TipsContext);
  // const { sections } = useContext(SectionContext);
  // const { subSections } = useContext(SubSectionContext);
  // const { collections } = useContext(CollectionContext);
  const [showListOfPacks, setShowListOfPacks] = useState(true);
  const swiperContainerRef = useRef<SwiperRef>(null);
  const [section, setSection] = useState<PacksPreviewSectionType>();
  useEffect(() => {
    if (activeData.length > 0) {
      setActivePacks([activeData[0].activePack]);
      const _section = activeData[0].section;
      // if (!activeData[0].section) {
      //   const collection = collections.find(
      //     (_collection: Collection) =>
      //       _collection.id === activeData[0].activePack.collection
      //   );
      //   if (collection) {
      //     const section = collection.section
      //       ? sections.find((_section) => _section.id === collection.section)
      //       : null;

      //     const sub_section = collection.sub_section
      //       ? subSections.find(
      //           (_sub_section) => _sub_section.id === collection.sub_section
      //         )
      //       : null;

      //     const parentSection = sub_section
      //       ? sections.find((_section) => _section.id === sub_section.section)
      //       : null;
      //     const sectionData = section
      //       ? section
      //       : parentSection
      //       ? parentSection
      //       : undefined;
      //     if (sectionData) {
      //       _section = { ...sectionData, packs: [activeData[0].activePack] };
      //     }
      //   }
      // }
      setSection(_section);
    }
    setShowListOfPacks(false);
  }, [activeData]);

  useEffect(() => {
    const tipIds = [...new Set(activePacks.flatMap((item) => item.tips))];
    const _tipsData = tips.filter((tip) => tip.id && tipIds.includes(tip.id));
    setTipsData(_tipsData);
  }, [activePacks]);

  if (activeData.length == 0) return;
  return (
    <div className="p-5 relative w-full overflow-hidden ">
      <div className="flex flex-col gap-[18px] h-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-[14px]">
          <div className="flex justify-between  items-center w-full">
            <p className="text-xl font-poppins font-semibold tracking-[0px] leading-[35px]">
              {section?.section_name}
            </p>
            <button
              className="[&_svg]:size-4 h-9 w-9 rounded-full bg-[#EDEDED] group-data-[mode='dark']:bg-mobile-dark-article shadow-sm  flex items-center justify-center"
              onClick={() => {
                setShowListOfPacks(true);
              }}
            >
              <EllipsisVertical />
            </button>
          </div>
          <Swiper
            ref={swiperContainerRef}
            slidesPerView={"auto"}
            spaceBetween={20}
            direction="horizontal"
            grabCursor={true}
            className="-mt-2 !w-full z-0 !cursor-grab"
          >
            {activePacks.map((pack, ix) => (
              <SwiperSlide
                key={ix}
                className="!w-fit !h-fit z-0 bg-white rounded-full"
              >
                <div
                  style={{
                    background: pack.background_color
                      ? pack.background_color + "1A"
                      : "#ededed",
                    color: pack.category_and_button_color ?? "black",
                  }}
                  className="h-10 p-2 font-mulish font-semibold leading-[21px] w-full rounded-full flex items-center justify-center text-center gap-4 [&_svg]:size-6"
                >
                  <p>{pack.name}</p>
                  <button
                    onClick={() => {
                      setActivePacks((prev) => {
                        prev.splice(ix, 1);
                        return [...prev];
                      });
                    }}
                  >
                    <X />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex flex-col gap-4">
          {tipsData.map((tip, ix) => (
            <TipComponent tip={tip} key={ix} />
          ))}
        </div>
      </div>
      <div
        style={{
          transitionDelay: showListOfPacks ? "0ms" : "80ms",
          visibility: showListOfPacks ? "visible" : "hidden",
        }}
        className="absolute bg-black/30 transition-[visibility] z-[1] top-0 flex items-end left-0 h-full w-full"
        onClick={() => {
          setShowListOfPacks(false);
        }}
      >
        <div
          style={{
            transform: `translateY(${showListOfPacks ? "0" : "100%"})`,
          }}
          className="bg-white flex p-6 flex-col gap-4 transition-transform w-full h-fit max-h-[224px] overflow-y-auto"
        >
          {(section?.packs ?? []).map((pack, ix) => (
            <Button
              style={{
                background: pack.background_color
                  ? pack.background_color + "1A"
                  : "#ededed",
                color: pack.category_and_button_color ?? "black",
              }}
              key={ix}
              className="h-10 w-full rounded-full flex items-center justify-center text-center"
              onClick={() => {
                setActivePacks((prev) => [...new Set([...prev, pack])]);
              }}
            >
              {pack.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
