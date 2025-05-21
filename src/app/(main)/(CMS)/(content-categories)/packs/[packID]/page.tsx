"use client";

import PackOverview from "@/components/cms/content-categories/packs/pack-overview";
import PacksPreview from "@/components/cms/content-categories/packs/packs-preview";
import MainLayout from "@/components/main-layout";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import { PacksContext } from "@/context/pack-data-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { Pack } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ packID: string }> }) => {
  const { packs } = useContext(PacksContext);
  const [pack, setPack] = useState<Pack>();
  useEffect(() => {
    async function fetchPack() {
      const { packID } = await params;
      const foundPack = packs.find((i) => i.id === Number(packID));
      if (!foundPack) return redirect("/packs");

      setPack(foundPack);
    }
    fetchPack();
  }, [params, packs]);

  if (!pack) return null; // Ensures component does not render prematurely
  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/packs",
          text: "Packs",
        },
        {
          text: pack.name,
          link: "",
        },
      ]}
    >
      <SidebarInset className="p-6 min-h-auto w-full overflow-x-hidden">
        <PackOverview pack={pack} />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <PacksPreview
            initialActiveData={[
              {
                activePack: pack,
                type: "pack",
              },
            ]}
            packs={packs}
          />
        </MobilePreview>
      </PreviewSidebar>
    </MainLayout>
  );
};
export default Page;
