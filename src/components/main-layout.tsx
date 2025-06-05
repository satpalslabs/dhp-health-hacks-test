import PageHeader from "./page-header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function MainLayout({
  pageNavigation,
  children,
  showSidebar = true,
}: {
  pageNavigation:
    | {
        text: string;
        link: string;
      }[]
    | null;
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  return (
    <div className="h-[calc(100vh-30px)]  overflow-hidden grid grid-rows-[min-content_auto]">
      <PageHeader path={pageNavigation} />
      <SidebarProvider
        className="overflow-hidden "
        style={
          {
            "--sidebar-width": "406px",
          } as React.CSSProperties
        }
      >
        {showSidebar && (
          <SidebarTrigger className="absolute right-4 z-20 top-[34px] -translate-y-1/2" />
        )}
        {children}
      </SidebarProvider>
    </div>
  );
}
