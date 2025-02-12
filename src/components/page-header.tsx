"use client";

import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

const PageHeader = ({ path }: { path: string }) => {
  let pathname = usePathname();
  const router = useRouter();
  pathname = pathname.substring(1);
  console.log(path);
  return (
    <header className="flex h-[76px] shrink-0 items-center gap-4 border-b px-6">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => {
          if (pathname.split("/").length > 1) {
            router.push(`/${pathname.split("/")[0]}`);
          }
        }}
      >
        <Separator
          orientation="vertical"
          className="mr-2 h-4 rotate-45 bg-sidebar-foreground"
        />
        <div className="capitalize">{pathname.split("/")[0]}</div>
      </div>
    </header>
  );
};

export default PageHeader;
