import React from "react";
import Network from "@/network.svg";
import StatusBar from "@/status bar.svg";
import Battery from "@/battery.svg";

const MobileHeader = () => {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div className="sticky pt-[17px] bg-transparent">
      <div className="text-inherit flex justify-between items-center text-xs">
        <div>{currentTime}</div>
        <div className="flex items-center gap-1 h-8">
          <Network />
          <StatusBar />
          <Battery />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
