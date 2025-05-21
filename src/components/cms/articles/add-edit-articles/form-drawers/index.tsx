import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const SideDrawer = ({
  open,
  setOpen,
  title,
  children,
  preview,
  showPreview = true,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  preview?: React.ReactNode;
  showPreview?: boolean;
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="p-0 data-[state=open]:!min-w-[100vw] overflow-hidden">
        <SidebarProvider
          className="w-full overflow-hidden h-full "
          style={
            {
              "--sidebar-width": "708px",
            } as React.CSSProperties
          }
        >
          {showPreview && (
            <SidebarTrigger className="absolute right-[43px] z-20 top-[25px] [&_svg]:size-[18px]" />
          )}
          <div className="flex flex-col w-full overflow-hidden h-full ">
            <SheetHeader>
              <div className="!h-[75px] flex items-center border-b border-border p-6">
                <SheetTitle className="font-inter text-lg ">{title}</SheetTitle>
              </div>
            </SheetHeader>
            <div className="grow w-full overflow-hidden ">{children}</div>
          </div>
          {showPreview && (
            <PreviewSidebar className="-mt-[1.3px] p-6">
              {preview}
            </PreviewSidebar>
          )}
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
};
export default SideDrawer;
