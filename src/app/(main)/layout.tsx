import { AppSidebar } from "@/components/primary-sidebar/app-sidebar";
import { AuthContextProvider } from "@/context/auth-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSettingsContextProvider } from "@/context/app-settings-prvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <AppSettingsContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-x-hidden relative z-[20]">
            <div>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </AppSettingsContextProvider>
    </AuthContextProvider>
  );
}
