import React from "react";

const StatusButton = ({ status }: { status: string }) => (
  <div
    className={` rounded-md font-semibold font-inter capitalize text-xs flex items-center justify-center px-[6px] h-[22px] hover:text-red  w-fit ${
      status == "Draft"
        ? "bg-button-status-darkGray text-text-darkGray"
        : status == "Approved"
        ? "bg-[blue]/5 text-primary"
        : status == "Submitted for Review"
        ? "text-button-status-inReviewButton bg-button-status-inReviewButton/10"
        : status == "Rejected"
        ? "text-button-status-rejectedButton bg-button-status-rejectedButton/10 "
        : status == "Published"
        ? "text-button-status-publishedButton bg-button-status-publishedButton/10 "
        : ""
    }`}
  >
    {status == "Submitted for Review" ? "In Review" : status}
  </div>
);

export default StatusButton;
