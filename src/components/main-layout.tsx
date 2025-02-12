import PageHeader from "./page-header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default async function MainLayout({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader path={pageTitle} />
      <SidebarProvider
        className="max-h-[calc(100vh-76px)] min-h-[calc(100vh-76px)] overflow-hidden"
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
