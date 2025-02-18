"use client";

import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

const PageHeader = ({ path }: { path: string[] | null }) => {
  let pathname = usePathname();
  const router = useRouter();
  pathname = pathname.substring(1);
  return (
    <header className="flex h-[76px] text-sm shrink-0 items-center gap-4 border-b px-6">
      <div
        className={`flex items-center gap-1 hover:text-foreground cursor-pointer ${
          path ? "text-zinc-500" : ""
        }`}
        onClick={() => {
          if (pathname.split("/").length > 1) {
            router.push(`/${pathname.split("/")[0]}`);
          }
        }}
      >
        <Separator
          orientation="vertical"
          className={`mr-2 h-4 rotate-45 ${
            path ? "bg-zinc-500" : "bg-sidebar-foreground"
          }`}
        />
        <div className="capitalize">{pathname.split("/")[0]}</div>
      </div>
      {path?.map((i: string, ix: number) => (
        <div
          className={`flex items-center gap-1  ${
            i == "..." ? "text-zinc-500" : "text-foreground cursor-pointer"
          }`}
          key={ix}
        >
          <Separator
            orientation="vertical"
            className="mr-2 h-4 rotate-45 bg-zinc-500"
          />
          <div className="capitalize">{i}</div>
        </div>
      ))}
    </header>
  );
};

export default PageHeader;
