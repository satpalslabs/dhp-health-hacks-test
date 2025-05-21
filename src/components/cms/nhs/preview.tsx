"use client";

import MobileHeader from "@/components/mobile-preview-sidebar/mobile-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useDeferredValue, useEffect, useState } from "react";
import Heart from "@/heart.svg";
import { Search } from "lucide-react";
import { NHSCondition } from "@/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Preview = ({
  data,
  loading,
}: {
  data: NHSCondition[];
  loading: boolean;
}) => (
  <div className="relative flex flex-col font-poppins  w-full h-full">
    <div className={`px-[25px] -mt-[8px] bg-mobile-primary text-white`}>
      <MobileHeader />
    </div>
    <div className="w-full grow flex flex-col overflow-hidden">
      <div className="sticky -top-0 py-[17px] z-20 bg-mobile-primary w-full text-sm text-center font-mulish font-semibold text-white">
        <div>Health A-Z</div>
      </div>
      <List NHSConditions={data} loading={loading} />
    </div>
  </div>
);

const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

const List = ({
  NHSConditions,
  loading,
}: {
  NHSConditions: NHSCondition[];
  loading: boolean;
}) => {
  const [_filteredData, setFilteredData] = useState<NHSCondition[]>([]);
  const filteredData = useDeferredValue(_filteredData);
  const [input, setInput] = useState("");
  useEffect(() => {
    setFilteredData(NHSConditions.filter((item) => item.name.includes(input)));
  }, [NHSConditions, input]);

  function SortData(data: NHSCondition[]) {
    const divs: React.ReactNode[] = [];
    data = data.sort((a, b) => a.name.localeCompare(b.name));
    let firstChar = "";

    for (let i = 0; i < data.length; i++) {
      if (firstChar != data[i].name[0]) {
        firstChar = data[i].name[0];
        divs.push(
          <div
            className="relative flex flex-col gap-1"
            key={i}
            id={firstChar.match(/[a-z]/i) ? firstChar.toUpperCase() : "hash"}
          >
            <div className="sticky -top-[1px] pt-[1px] w-full text-xs font-inter bg-white group-data-[mode='dark']:bg-black">
              <div className="bg-[#E4E4E780] py-1 px-3 text-xs h-[23px] rounded group-data-[mode='dark']:bg-[#373747f8]">
                {data[i].name[0]}
              </div>
            </div>
            {getContent(i)}
          </div>
        );
      }

      function getContent(i: number) {
        const sub_divs: React.ReactNode[] = [];
        for (let j = i; j < data.length; j++) {
          if (data[i].name[0] != data[j].name[0]) {
            i = j;
            break;
          } else {
            sub_divs.push(
              <div
                key={j}
                className="line-clamp-1 text-xs text-primary leading-[23px] px-3"
              >
                {data[j].name}
              </div>
            );
          }
        }
        return sub_divs;
      }
    }

    return divs;
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  function scrollToDiv(character: string) {
    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${character}`);
    if (target) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + (targetTop - containerTop),
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="px-[10px] py-[17px] grow flex flex-col overflow-hidden gap-3 font-inter  ">
      <div className="flex justify-between items-center pr-[10px]">
        <div className="flex w-[250px] h-[31px]">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-full rounded-r-none !text-xs text-gray-700 border-[#E4E4E7] group-data-[mode='dark']:border-text-darkGray outline-none focus-visible:outline-none focus-visible:ring-0 border-r-0"
          />
          <Button
            variant={"outline"}
            className="py-0 h-full w-9 rounded-l-none border-[#E4E4E7] group-data-[mode='dark']:border-text-darkGray !bg-transparent hover:bg-none hover:text-none "
          >
            <Search />
          </Button>
        </div>
        <Heart />
      </div>
      <div className="flex h-full overflow-hidden ">
        {loading ? (
          <div className="w-full h-fit flex items-center mt-6 justify-center">
            <LoadingSpinner className="w-6 h-6" />
          </div>
        ) : (
          <div
            className="h-full grow overflow-auto no-scrollbar"
            id="NHS-scroll"
            ref={containerRef}
          >
            {SortData(filteredData)}
          </div>
        )}
        <div className="p-1 font-inter text-xs text-text-darkGray flex flex-col">
          <div
            className=" cursor-pointer text-center"
            onClick={() => {
              scrollToDiv("hash");
            }}
          >
            #
          </div>
          {alphabet.map((character, ix) => (
            <div
              key={ix}
              className=" cursor-pointer text-center"
              onClick={() => {
                scrollToDiv(character);
              }}
            >
              {character}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
