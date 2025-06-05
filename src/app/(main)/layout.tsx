import { AppSidebar } from "@/components/primary-sidebar/app-sidebar";
import { AuthContextProvider } from "@/context/auth-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSettingsContextProvider } from "@/context/app-settings-prvider";
import EnvSwitcher from "@/components/ui/env-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <AppSettingsContextProvider>
        <div className="h-[100vh] grid grid-rows-[min-content_auto] overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden relative z-[20]">
              <div>{children}</div>
            </SidebarInset>
          </SidebarProvider>
          <div className="h-[30px] border border-border w-full flex items-center px-[14px] py-1">
            <EnvSwitcher />
          </div>
        </div>
      </AppSettingsContextProvider>
    </AuthContextProvider>
  );
}
