"use client";
import { SidebarInset } from "@/components/ui/sidebar";
import React, { useContext, useEffect } from "react";
import PackTable from "./table";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { PacksContext } from "@/context/pack-data-provider";
// import { SectionContext } from "@/components/providers/section-data-provider";
// import { SubSectionContext } from "@/components/providers/sub-section-data-provider";
// import { CollectionContext } from "@/components/providers/collection-data-provider";
import { Collection, Pack, Section, SubSection } from "@/types";
import PacksPreview from "./packs-preview";

export interface PackTableRowType extends Pack {
  section?: Section;
  sub_section?: SubSection;
  collection_data?: Collection;
}

const PacksPage = () => {
  const { packs } = useContext(PacksContext);
  // const { sections } = useContext(SectionContext);
  // const { subSections } = useContext(SubSectionContext);
  // const { collections } = useContext(CollectionContext);
  const [packsData, setPacksData] = React.useState<PackTableRowType[]>([]);
  const [initialData, setInitialData] = React.useState<PackTableRowType[]>([]);
  useEffect(() => {
    // const _packsData: PackTableRowType[] = packs
    //   .map((pack) => {
    //     const collection = collections.find(
    //       (_collection: Collection) => _collection.id === pack.collection
    //     );
    //     if (collection) {
    //       const section = collection.section
    //         ? sections.find(
    //             (_section: Section) => _section.id === collection.section
    //           )
    //         : null;
    //       const sub_section = collection.sub_section
    //         ? subSections.find(
    //             (_sub_section: SubSection) =>
    //               _sub_section.id === collection.sub_section
    //           )
    //         : null;
    //       const parentSection = sub_section
    //         ? sections.find(
    //             (_section: Section) => _section.id === sub_section.section
    //           )
    //         : null;
    //       return {
    //         ...pack,
    //         collection_data: collection,
    //         section: parentSection || section || undefined,
    //         sub_section: sub_section || undefined,
    //       };
    //     }
    //   })
    //   .filter((i) => i != undefined);
    setInitialData([]);
    // setPacksData(_packsData);
  }, [packs]);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        {/* List of journey data */}
        <PackTable
          filteredData={packsData}
          setFilteredData={setPacksData}
          initialData={initialData}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <PacksPreview initialActiveData={[]} packs={packsData} />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
};

export default PacksPage;
