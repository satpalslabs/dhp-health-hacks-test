import { AppSidebar } from "@/components/primary-sidebar/app-sidebar";
import { AuthContextProvider } from "@/components/providers/auth-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthContextProvider>
  );
}
