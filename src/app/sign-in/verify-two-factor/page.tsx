import VerificationTwoFactor from "@/components/auth-components/verification-two-factor";
import { isVerificationValid } from "../enable-two-factor/page";

export default async function Verify2FAPage() {
  await isVerificationValid(3);

  return (
    <div className="w-full overflow-hidden p-[38px] pt-[102px] h-full font-inter flex flex-col gap-[28px]">
      <VerificationTwoFactor />
    </div>
  );
}
