"use client";

import { SpinnerButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import QRCode from "qrcode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, CopyCheckIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateSecretKey } from "@/lib/utils/auth/2FA/generate-secret-key";
import { toast } from "@/hooks/use-toast";
import { enableDisable2FA } from "@/lib/utils/auth/2FA/enable-disable-2fa";
import { useRouter } from "next/navigation";
import { saveUserTokens } from "@/lib/utils/auth/save-tokens";
import { LoadingSpinner } from "../ui/loading-spinner";
import { confirmCookieForVerification } from "@/lib/utils/auth/2FA/store-cookies-2fa";
import { verifySecretKey } from "@/lib/utils/auth/2FA/secretkey-services";

const twoFactorAuthSchema = z.object({
  otp: z.string().min(6),
});

const EnableTwoFactor = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof twoFactorAuthSchema>>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function generateSecret() {
    setFetching(true);
    const secret = await generateSecretKey();
    setSecretKey(secret.base32 ?? "");
    QRCode.toDataURL(secret.otpauth_url ?? "", function (err, data_url) {
      setQrCode(data_url);
    });
    setFetching(false);
  }

  useEffect(() => {
    generateSecret();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    try {
      const verified = await verifySecretKey(form.getValues().otp, secretKey);
      if (verified) {
        await enableDisable2FA(secretKey, true);
        await saveUserTokens();
        await confirmCookieForVerification();
        setSecretKey("");
        router.push("/sign-in/enable-two-factor/confirmation");
      } else {
        setLoading(false);
        toast({
          title: "Two-factor code verification failed. ",
          description: `Please try again later. `,
          variant: "destructive",
          className: "border border-red-500 bg-red-50 text-red-900",
        });
      }
    } catch (er) {
      setLoading(false);
      toast({
        title: "Two-factor code verification failed. ",
        description: `${er}, Please try again later. `,
        variant: "destructive",
        className: "border border-red-500 bg-red-50 text-red-900",
      });
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-[32px] font-medium leading-[100%]">
          Enable two-factor authentication (2FA)
        </p>
        <p className="text-button-filter-text ">
          Install an Google authenticator app on your mobile device or browser
          extension generate one-time passwords that are used as a second factor
          to verify your identity when prompted during sign-in.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold leading-[100%]">Scan the QR code</p>
        <p className="text-button-filter-text leading-[100%]">
          Use an authenticator app or browser extension to scan.
        </p>
        <div className="flex items-center justify-center h-[220px] w-full">
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <Image
              src={qrCode}
              width={600}
              height={600}
              alt="QR code"
              className="h-full w-[217px]"
            />
          )}
        </div>
        <div className="text-button-filter-text leading-[100%]">
          Unable to scan? You can use the{" "}
          <DropdownMenu
            onOpenChange={() => {
              setCopied(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <span className="underline text-primary">setup key</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="w-[456px] p-2 flex flex-col gap-2 font-inter"
            >
              <div className="font-semibold flex justify-between [&_svg]:size-4 items-center">
                Your two-factor secret{" "}
                <span
                  className="text-primary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(secretKey);
                    setCopied(true);
                  }}
                >
                  {copied ? <CopyCheckIcon /> : <Copy />}
                </span>
              </div>
              <hr className=" border-border" />
              <div className="w-full text-sm font-inter !bg-transparent line-clamp-1 break-words">
                {secretKey}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>{" "}
          to manually configure your authenticator app.
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className=" flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[15px]">
                  Verify the code from the app
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[128px] text-sm tracking-[4px]"
                    placeholder="000000"
                    pattern="[0-9]{6}"
                    autoComplete={"off"}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <hr className="border-border" />
          <SpinnerButton
            type="submit"
            className={` mt-5  ${
              !form.formState.isValid ? "bg-text-darkGray" : "bg-primary"
            } w-full`}
            disabled={!form.formState.isValid}
            loading={loading}
          >
            Continue
          </SpinnerButton>
        </form>
      </Form>
    </>
  );
};

export default EnableTwoFactor;
