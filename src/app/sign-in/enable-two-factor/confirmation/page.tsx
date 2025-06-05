import { isVerificationValid } from "../page";
import EnabledSuccessfully from "@/components/auth-components/enabled-two-factor-success";

export default async function Recovery2FAPage() {
  await isVerificationValid(2);
  return (
    <div className="w-full overflow-hidden px-[38px] p-[38px] pt-[56px] h-full font-inter flex flex-col gap-9">
      <EnabledSuccessfully />
    </div>
  );
}
