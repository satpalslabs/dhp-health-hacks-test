"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { deleteCookieForVerification } from "@/lib/utils/auth/2FA/store-cookies-2fa";
import { Button } from "../ui/button";

const EnabledSuccessfully = () => {
  const router = useRouter();

  async function handleSubmit() {
    await deleteCookieForVerification();
    router.push("/articles");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={"/enabled-successfully.png"}
          width={600}
          height={600}
          alt="QR code"
          className="h-[137px] w-[137px] object-cover"
        />
        <p className="text-[32px] font-medium leading-[120%]">
          Two-factor authentication (2FA) is now enabled for your account{" "}
        </p>
      </div>
      <div className="flex gap-2 p-[18px] bg-[#28A7451A] rounded-[8px] [&_svg]:size-[18px]">
        <div className="w-fit h-fit text-[#28A745]">
          <Check />
        </div>
        <p className="font-medium leading-[105%]">
          You have enabled two-factor authentication using your authenticator
          app.
        </p>
      </div>

      <Button onClick={handleSubmit}>Continue</Button>
    </>
  );
};

export default EnabledSuccessfully;
