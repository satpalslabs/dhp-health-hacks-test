"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import Table from "@/components/cms/tips/tips-table";
import { Tip } from "@/types";
import { useDeferredValue, useState } from "react";
import MobileHeader from "@/components/mobile-preview-sidebar/mobile-header";
import TipComponent from "@/components/ui/tip";
import { Skeleton } from "@/components/ui/skeleton";

export default function TipsMainPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const deferredQuery = useDeferredValue(tips);
  const [loading, setLoading] = useState(true);
  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table setTips={setTips} loading={loading} setLoading={setLoading} />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <div className="relative grid grid-rows-[min-content_auto] shrink-0 font-poppins  w-full h-full">
            <div className={`px-[25px] -mt-[8px] bg-mobile-primary text-white`}>
              <MobileHeader />
            </div>
            <div className="w-full shrink-0 overflow-y-auto no-scrollbar">
              <div className="sticky -top-0 py-[17px] z-20 bg-mobile-primary w-full text-lg text-center font-mulish font-semibold text-white">
                <div>Health Hacks</div>
              </div>
              <div className="flex flex-col gap-4 w-full px-3 mt-3 my-5">
                {loading ? (
                  <>
                    {Array(2)
                      .fill(null)
                      .map((_, idx) => (
                        <Skeleton
                          key={idx}
                          className="p-6 flex flex-col gap-6 font-inter w-full rounded-xl opacity-5 h-[220px] bg-muted"
                        />
                      ))}
                  </>
                ) : (
                  <div className="flex flex-col gap-4 w-full px-3 mt-3 my-5">
                    {deferredQuery.map((tip: Tip, ix: number) => {
                      const previewData = {
                        ...tip,
                        tipCategory: tip.tips_categories,
                      };
                      return <TipComponent tip={previewData} key={ix} />;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
