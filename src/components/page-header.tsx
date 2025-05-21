"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Slash } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";

const PageHeader = ({
  path,
}: {
  path:
    | {
        text: string;
        link: string;
      }[]
    | null;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex h-[76px] text-sm shrink-0 items-center gap-4 border-b px-6">
        {path?.map(
          (
            i: {
              text: string;
              link: string;
            },
            ix: number
          ) => (
            <Fragment key={ix}>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link
                  className={`flex items-center gap-1  ${
                    i.text == "..."
                      ? "text-zinc-500"
                      : "text-foreground cursor-pointer"
                  }`}
                  href={i.link}
                  key={ix}
                >
                  {i.text}
                </Link>
              </BreadcrumbItem>
            </Fragment>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageHeader;
