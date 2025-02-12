"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Streak from "@/streak.svg";
import Star from "@/star.svg";
import Lock from "@/lock.svg";
import ArrowDown from "@/custom-arrow-down.svg";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import { Button } from "@/components/ui/button";
import { NavigationPathContext } from "../providers/top-navigation-provider";
import { JourneyData } from "@/lib/journey-services";

const JourneyPreviewSection = () => {
  const { data }: { data: JourneyData[] } = useContext(NavigationPathContext);

  return (
    <div className="flex flex-col gap-[13px] font-poppins ">
      <div className="flex justify-between  font-mulish">
        <div className="flex gap-3 text-sm leading-[16.8px]">
          <div className="rounded-full bg-[#FFEFAE] w-fit h-fit">
            <Image
              src="/user.svg"
              height={300}
              width={300}
              alt="user-profile image"
              className="w-[33px] h-[33px]"
            />
          </div>
          <div>
            Good Morning
            <br /> <span className="font-bold">Marta</span>
          </div>
        </div>
        <div className="flex gap-3 text-center">
          <div className="flex flex-col gap-[3px]">
            <Streak />
            <span className="text-[11.7px]">2</span>
          </div>
          <div className="flex flex-col items-center gap-[3px] pt-[3px]">
            <Heart className="grow" />
            <span className="text-[11.7px]">130</span>
          </div>
          <div className="flex items-center flex-col gap-[3px]">
            <Diamond />
            <span className="text-[11.7px]">200</span>
          </div>
        </div>
      </div>
      {data.map((journey: JourneyData, ix: number) => (
        <div
          key={ix}
          className={`p-[13.4px]  rounded-lg flex flex-col gap-[13.4px] `}
          style={{
            background: journey["background-color"],
          }}
        >
          <div className="flex flex-col gap-5">
            <div
              className={` text-[15.12px] font-semibold`}
              style={{
                color: journey["primary-color"],
              }}
            >
              {journey.title}
            </div>
            <div className="w-fit relative">
              <div className="flex gap-[10px] relative z-10">
                {[0, 1, 2, 3, 4].map((i: number) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center relative rounded-full w-[26.88px] h-[26.88px] shadow-unit `}
                    style={{
                      background: i == 0 ? journey["primary-color"] : "#C1C1C1",
                    }}
                  >
                    {i == 0 ? <Star /> : <Lock />}
                    {i == 0 && (
                      <ArrowDown
                        className=" absolute top-[-5.04px] -translate-y-full left-1/2 -translate-x-1/2"
                        style={{
                          stroke: journey["primary-color"],
                          fill: journey["primary-color"],
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div
                className={
                  "absolute w-full left-0 top-1/2 -translate-y-1/2 border-t-[1.68px] border-dashed"
                }
                style={{
                  borderColor: journey["primary-color"],
                }}
              ></div>
            </div>
          </div>
          <Button
            className="shadow-unit rounded-full uppercase"
            style={{
              background: journey["primary-color"],
            }}
          >
            Start Journey
          </Button>
        </div>
      ))}
    </div>
  );
};

export default JourneyPreviewSection;
