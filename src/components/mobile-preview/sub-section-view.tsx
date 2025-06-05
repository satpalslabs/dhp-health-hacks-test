import { SectionType, SubSectionType } from "@/lib/view-section-data";
import Image from "next/image";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { activeData } from ".";
import { useContext, useEffect, useRef, useState } from "react";
import { ScreenHeader, SectionDetails } from "./screen-components";
import { CollectionViewForMainPage } from "./collection-view";
import { CollectionContext } from "@/context/collection-data-provider";

export const SectionWithSubSections = ({
  section,
  setActiveData,
}: {
  section: SectionType;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  const swiperContainerRef = useRef<SwiperRef>(null);
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex justify-between items-end pl-6 pr-[19px] font-poppins font-semibold text-mobile-text-heading group-data-[mode='dark']:text-white  ">
        <p>{section.section_name}</p>
        {section.section_icon?.url && (
          <Image
            src={section.section_icon?.url}
            alt="section ICon"
            width={300}
            height={300}
            className="w-12 h-auto"
          />
        )}
      </div>
      <Swiper
        ref={swiperContainerRef}
        slidesPerView={"auto"}
        spaceBetween={20}
        grabCursor={true}
        className="!px-6 !ml-0 w-full"
      >
        {section.sub_sections_data?.map(
          (subSection: SubSectionType, index: number) => (
            <SwiperSlide
              className="!h-[112px] !w-[185px] mb-4 rounded-[10px] cursor-pointer overflow-hidden "
              key={index}
              style={{
                backgroundColor: subSection?.bg_color ?? "",
              }}
            >
              <div
                className="flex flex-col justify-end h-full text-white p-[10px] pl-4"
                onClick={() => {
                  const nextComponentData: activeData = {
                    type: "sub-section",
                    bg_color: subSection.bg_color,
                    sub_section: subSection,
                    section: {
                      section_icon: section.section_icon,
                      section_name: section.section_name,
                    },
                  };
                  setActiveData((prev) => [...prev, nextComponentData]);
                }}
              >
                <div className="flex flex-col gap-1 h-fit">
                  <div className="font-poppins font-semibold">
                    {subSection.subsection_name}
                  </div>
                  <p className="font-mulish font-semibold line-clamp-2">
                    {subSection.subsection_description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

const SubSectionView = ({
  activeData,
  setActiveData,
}: {
  activeData: activeData;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  const [subSectionData, setSubSectionData] = useState<
    SubSectionType | undefined
  >(activeData.sub_section);
  const { collections } = useContext(CollectionContext);

  // This useEffect is used to get the collections data for the sub-section if not available
  useEffect(() => {
    if (!activeData.sub_section?.collections_data) {
      const collections_data = collections.filter(
        (collection) =>
          collection.id &&
          activeData.sub_section?.collections.includes(collection.id)
      );
      if (activeData.sub_section) {
        setSubSectionData({
          ...activeData.sub_section,
          collections_data,
        });
      }
    }
  }, [activeData.sub_section, collections]);

  return (
    <div className="w-full overflow-y-auto no-scrollbar h-full shrink-0 relative pb-5 ">
      <ScreenHeader activeData={activeData} setActiveData={setActiveData} />
      <div className="px-6 mt-10 flex flex-col gap-2 text-mobile-text-heading group-data-[mode='dark']:text-white">
        <div className="font-poppins font-semibold text-2xl leading-6">
          {activeData.sub_section?.subsection_name}
        </div>
        <div className="font-mulish font-semibold text-base leading-[21px]">
          {activeData.sub_section?.subsection_description}
        </div>
      </div>
      <div className="flex flex-col gap-[75px]">
        <div className="mt-[26px] flex flex-col gap-4 w-full shrink-0">
          {subSectionData?.collections_data
            ?.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
            ?.map((collection, ix) => {
              if (collection.position == 0) return;
              return (
                <CollectionViewForMainPage
                  collection={collection}
                  key={ix}
                  setActiveData={setActiveData}
                  section={activeData.section}
                  sub_section={activeData.sub_section}
                />
              );
            })}
        </div>
        <div className="pl-6">
          <SectionDetails activeData={activeData} />
        </div>
      </div>
    </div>
  );
};

export default SubSectionView;
