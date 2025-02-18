"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import Streak from "@/streak.svg";
import Star from "@/star.svg";
import Lock from "@/lock.svg";
import ArrowDown from "@/custom-arrow-down.svg";
import Heart from "@/heart.svg";
import Diamond from "@/diamond.svg";
import { Button } from "@/components/ui/button";
import {
  JourneyData,
  JourneySection,
  JourneyUnit,
} from "@/lib/journey-services";
import { AuthContext } from "../providers/auth-provider";
import { DataContext } from "../providers/data-provider";
import MobileHeader from "../mobile-preview-sidebar/mobile-header";
import { ArrowLeft } from "lucide-react";
import EndJourney from "@/end-journey.svg";

const JourneyPreviewSection = ({
  activeStep,
  activeData: activeJourney,
}: {
  activeStep: number;
  activeData:
    | {
        journey: JourneyData;
        section: JourneySection | undefined;
      }
    | undefined;
}) => {
  const { data } = useContext(DataContext) ?? {};
  const auth = useContext(AuthContext);
  const [steps, setSteps] = useState(activeStep ?? 0);
  const [activeData, setActiveData] = useState<
    | {
        journey: JourneyData;
        section: JourneySection | undefined;
      }
    | undefined
  >(activeJourney);

  return (
    <div className="relative flex flex-col  w-full h-full ">
      <div
        className={`flex  transition-transform h-full`}
        style={{
          transform: `translateX(calc(-${steps * 100}% ))`,
        }}
      >
        <div className="relative flex flex-col shrink-0  w-full h-full ">
          <div className="px-4">
            <MobileHeader />
          </div>
          <div className="flex flex-col gap-[13px] font-poppins w-full shrink-0 px-4 ">
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
                  <br /> <span className="font-bold">{auth?.name}</span>
                </div>
              </div>
              <div className="flex gap-3 text-center">
                <div className="flex flex-col gap-[3px]">
                  <Streak className="w-[22px] h-fit" />
                  <span className="text-[11.7px]">2</span>
                </div>
                <div className="flex flex-col items-center gap-[3px] pt-[3px]">
                  <Heart className="grow w-[22px] h-fit" />
                  <span className="text-[11.7px]">130</span>
                </div>
                <div className="flex items-center flex-col gap-[3px]">
                  <Diamond className="w-[22px] h-fit" />
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
                            background:
                              i == 0 ? journey["primary-color"] : "#C1C1C1",
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
                  onClick={() => {
                    setActiveData({
                      journey: journey,
                      section: undefined,
                    });
                    setSteps(1);
                  }}
                >
                  Start Journey
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col shrink-0  w-full h-full ">
          <div
            className="px-4 text-white"
            style={{
              background: activeData?.journey["primary-color"],
            }}
          >
            <MobileHeader />
          </div>
          <div className="flex flex-col  relative w-full h-full grow shrink-0 overflow-y-auto no-scrollbar pb-3">
            <div
              className="sticky -top-0 px-4 pb-3 flex flex-col gap-3  w-full h-fit"
              style={{
                background: activeData?.journey["primary-color"],
              }}
            >
              <div className="flex text-white font-poppins relative">
                <button
                  tabIndex={-1}
                  onClick={() => {
                    setSteps(0);
                  }}
                >
                  <ArrowLeft />
                </button>
                <p className="font-semibold left-1/2 absolute -translate-x-1/2">
                  {activeData?.journey.title}
                </p>
              </div>
              <div className="flex items-center gap-3 text-white   w-fit mx-auto">
                <div className=" bg-blend-luminosity bg-[#2828282a] flex  relative h-[23px] font-mulish font-bold w-[79px] pr-3 rounded-full text-sm [&_svg]:size-[23px]">
                  <Streak className="absolute left-0 -translate-x-[5px]" />
                  <div className="w-full grow text-end">2 days </div>
                </div>
                <div className=" bg-blend-luminosity bg-[#2828282a]  flex  relative h-[23px] font-mulish font-bold w-[79px] pr-3 rounded-full text-sm [&_svg]:size-[24px]">
                  <Heart className="absolute left-0 mt-[2px] -translate-x-[5px]" />
                  <div className="w-full grow text-end">
                    {activeData?.journey.sections
                      .flatMap((section) => section.units)
                      .reduce(
                        (total, unit: JourneyUnit) =>
                          total + unit["heart-points"],
                        0
                      )}
                    HP
                  </div>
                </div>
                <div className=" bg-blend-luminosity bg-[#2828282a] flex  relative h-[23px] font-mulish font-bold w-[60px] pr-3 rounded-full text-sm [&_svg]:size-[24px]">
                  <Diamond className="absolute left-0 -translate-x-[5px]" />
                  <div className="w-full grow text-end">
                    {activeData?.journey.sections
                      .flatMap((section) => section.units)
                      .reduce(
                        (total, unit: JourneyUnit) => total + unit.gems,
                        0
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto grow no-scrollbar px-10 py-8 mb-8">
              <div className="w-full h-[160px] relative flex">
                <div
                  className="h-[33.6px] w-[calc(100%-82px)]  relative rounded-tl-full rounded-bl-full pr-4"
                  style={{
                    background: activeData?.journey["background-color"],
                  }}
                >
                  <div
                    className="border-t  border-dashed left-4 w-full top-1/2 absolute "
                    style={{
                      borderColor: activeData?.journey["primary-color"],
                    }}
                  ></div>
                  <div className="absolute flex gap-[6px] items-center left-[-26.8px] h-full ">
                    <ArrowDown
                      className="-rotate-90"
                      style={{
                        stroke: activeData?.journey["primary-color"],
                        fill: activeData?.journey["primary-color"],
                      }}
                    />
                    <div
                      className="h-[44px] w-[44px] rounded-full flex items-center justify-center shadow-unit"
                      style={{
                        background: activeData?.journey["primary-color"],
                      }}
                    >
                      <Image
                        src={"/Mission.svg"}
                        height={400}
                        width={400}
                        alt="section"
                        className="w-[31px] h-[31px]"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="h-full w-[104px] rounded-tr-full rounded-br-full  relative overflow-hidden pr-[33.6px] pb-[33.6px] pt-[33.6px]"
                  style={{
                    background: activeData?.journey["background-color"],
                  }}
                >
                  <div className="rounded-tr-full rounded-br-full bg-white group-data-[mode='dark']:bg-mobile-dark-background  w-full h-full"></div>
                  <div
                    className="rounded-tr-full absolute top-[16.8px] right-4 border border-dashed  rounded-br-full bg-transparent w-full h-[calc(100%-33px)]"
                    style={{
                      borderColor: activeData?.journey["primary-color"],
                    }}
                  ></div>
                </div>
              </div>
              {[1, 2, 3, 4].map((i: number) => (
                <span key={i}>
                  <div className="w-full h-[160px] -mt-[33.6px] relative flex items-start">
                    <div
                      className="h-full w-[104px] rounded-tl-full rounded-bl-full  relative overflow-hidden pl-8 pb-[33.6px] pt-[33.6px]"
                      style={{
                        background: activeData?.journey["background-color"],
                      }}
                    >
                      <div className=" rounded-tl-full rounded-bl-full bg-white group-data-[mode='dark']:bg-mobile-dark-background w-full h-full relative"></div>
                      <div
                        className=" rounded-tl-full rounded-bl-full absolute top-[16.8px] left-4 border border-dashed  bg-transparent w-full h-[calc(100%-33px)]"
                        style={{
                          borderColor: activeData?.journey["primary-color"],
                        }}
                      ></div>
                    </div>
                    <div
                      className="h-[33.6px] w-[57px]  relative"
                      style={{
                        background: activeData?.journey["background-color"],
                      }}
                    >
                      <div
                        className="border-t  border-dashed left-0 w-full top-1/2 absolute "
                        style={{
                          borderColor: activeData?.journey["primary-color"],
                        }}
                      ></div>
                    </div>
                  </div>
                  {i != 4 && (
                    <div className="w-full h-[160px] -mt-[33.6px] relative flex items-start justify-end">
                      <div
                        className="h-[33.6px] w-[57px]  relative"
                        style={{
                          background: activeData?.journey["background-color"],
                        }}
                      >
                        <div
                          className="border-t  border-dashed left-0 w-full top-1/2 absolute "
                          style={{
                            borderColor: activeData?.journey["primary-color"],
                          }}
                        ></div>
                      </div>
                      <div
                        className="h-full w-[104px] rounded-tr-full rounded-br-full  relative overflow-hidden pr-[33.6px] pb-[33.6px] pt-[33.6px]"
                        style={{
                          background: activeData?.journey["background-color"],
                        }}
                      >
                        <div className=" rounded-tr-full rounded-br-full bg-white group-data-[mode='dark']:bg-mobile-dark-background w-full h-full"></div>
                        <div
                          className=" rounded-tr-full rounded-br-full absolute top-[16.8px] right-4 border border-dashed  bg-transparent w-full h-[calc(100%-33px)]"
                          style={{
                            borderColor: activeData?.journey["primary-color"],
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </span>
              ))}
              <div
                className="-mt-[64px] relative z-10 flex items-center justify-center -ml-1"
                style={{
                  color: activeData?.journey["primary-color"],
                }}
              >
                <EndJourney className="h-[166px] w-[216px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyPreviewSection;
