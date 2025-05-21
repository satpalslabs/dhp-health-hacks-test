import PageHeader from "./page-header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function MainLayout({
  pageNavigation,
  children,
}: {
  pageNavigation:
    | {
        text: string;
        link: string;
      }[]
    | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader path={pageNavigation} />
      <SidebarProvider
        className="max-h-[calc(100vh-76px)] min-h-[calc(100vh-76px)] overflow-hidden "
        style={
          {
            "--sidebar-width": "406px",
          } as React.CSSProperties
        }
      >
        <SidebarTrigger className="absolute right-4 z-20 top-[34px] -translate-y-1/2" />
        {children}
      </SidebarProvider>
    </div>
  );
}
