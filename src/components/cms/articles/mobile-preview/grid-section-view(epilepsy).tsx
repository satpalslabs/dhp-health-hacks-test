import { SectionType } from "@/lib/view-section-data";
import { activeData } from ".";
import Image from "next/image";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { useRef } from "react";

const GridSectionComponent = ({
  section,
  setActiveData,
}: {
  section: SectionType | undefined;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  const swiperContainerRef = useRef<SwiperRef>(null);
  if (!section) return;
  return (
    <>
      <div className="flex justify-between items-end pl-6 pr-[19px] font-poppins font-semibold text-mobile-text-heading group-data-[mode='dark']:text-white  ">
        {section.section_name}
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
      {section.view_type == "grid" || section.position == 0 ? (
        <div className="mt-[14px] grid grid-cols-2 gap-4 px-6">
          {section.collections_data.map((collection, ix) => (
            <div
              key={ix}
              className="h-[115px] w-full rounded-[10px] flex cursor-pointer group-data-[mode='dark']:bg-mobile-dark-article justify-center items-center text-mobile-text-firstSection "
              style={{
                backgroundColor: collection.bg_color ?? "",
                boxShadow: "var(--mobile-card-shadow)",
              }}
              onClick={() => {
                const nextComponentData: activeData = {
                  type: "collection",
                  bg_color: collection?.bg_color,
                  collection: collection,
                  section: {
                    section_name: section.section_name,
                    section_icon: section.section_icon,
                  },
                };
                setActiveData((prev) => [...prev, nextComponentData]);
              }}
            >
              <div className="flex flex-col  items-center gap-[12px]">
                {collection.collection_icon?.url && (
                  <Image
                    src={collection.collection_icon?.url}
                    alt="collection icon"
                    width={600}
                    height={600}
                    className="h-[45px] w-fit"
                  />
                )}
                <div className="font-poppins font-semibold leading-5 text-base text-mobile-text-firstSection text-center px-[10px] line-clamp-2">
                  {collection.collection_name.split("_")[0]}
                </div>
              </div>
            </div>
          ))}
          {section.sub_sections_data.map((sub_section, ix) => (
            <div
              key={ix}
              className="h-[115px] w-full rounded-[10px] flex cursor-pointer group-data-[mode='dark']:bg-mobile-dark-article justify-center items-center text-mobile-text-firstSection "
              style={{
                backgroundColor: sub_section.bg_color ?? "",
                boxShadow: "var(--mobile-card-shadow)",
              }}
              onClick={() => {
                const nextComponentData: activeData = {
                  type: "sub-section",
                  bg_color: sub_section.bg_color,
                  sub_section: sub_section,
                  section: {
                    section_icon: section.section_icon,
                    section_name: section.section_name,
                  },
                };
                setActiveData((prev) => [...prev, nextComponentData]);
              }}
            >
              <div className="flex flex-col  items-center gap-[12px]">
                {sub_section.subsection_icon?.url && (
                  <Image
                    src={sub_section.subsection_icon?.url}
                    alt="collection icon"
                    width={600}
                    height={600}
                    className="h-[45px] w-fit"
                  />
                )}
                <div className="font-poppins font-semibold leading-5 text-base text-mobile-text-firstSection text-center px-[10px] line-clamp-2">
                  {sub_section.subsection_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          ref={swiperContainerRef}
          slidesPerView={"auto"}
          spaceBetween={20}
          grabCursor={true}
          className="!px-6 !ml-0 w-full mt-[14px] "
        >
          {section.collections_data.map((collection, ix) => (
            <SwiperSlide
              className="!h-[112px] !w-[185px] mb-4 rounded-[10px] cursor-pointer overflow-hidden "
              key={ix}
              style={{
                backgroundColor: collection?.bg_color ?? "#ededed",
                color: collection?.bg_color ? "white" : "black",
              }}
            >
              <div
                className="flex flex-col justify-end h-full  p-[10px] pl-4"
                onClick={() => {
                  const nextComponentData: activeData = {
                    type: "collection",
                    bg_color: collection?.bg_color,
                    collection: collection,
                    section: {
                      section_name: section.section_name,
                      section_icon: section.section_icon,
                    },
                  };
                  setActiveData((prev) => [...prev, nextComponentData]);
                }}
              >
                <div className="flex flex-col gap-1 h-fit">
                  <div className="font-poppins font-semibold">
                    {collection.collection_name.split("_")[0]}
                  </div>
                  <p className="font-mulish font-semibold line-clamp-2">
                    {collection.collection_description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default GridSectionComponent;
