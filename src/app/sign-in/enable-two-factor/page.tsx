import EnableTwoFactor from "@/components/auth-components/enable-two-factor";
import { getConfigObject } from "@/lib/utils/auth/get-config-object";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Enable2FAPage() {
  try {
    await isVerificationValid();

    return (
      <div className="w-full h-full max-h-fit px-[38px] font-inter flex flex-col gap-9">
        <EnableTwoFactor />
      </div>
    );
  } catch (er) {
    console.log(er);

    redirect("/sign-in");
  }
}

export async function isVerificationValid(step: number = 1) {
  const cookieStore = await cookies();
  try {
    const auth_data = cookieStore.get("auth-data")?.value;
    const active_env = cookieStore.get("active-env")?.value;
    const data = auth_data ? JSON.parse(auth_data) : {};
    const configObject: {
      BASE_URL: string;
      STRAPI_BASE_URL: string;
      STRAPI_API_TOKEN: string;
    } = getConfigObject(active_env ?? "experimental");
    const url = `${configObject.BASE_URL || ""}/users/current`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${data.token} `,
      },
    });

    if (!res.ok || step != data.step) {
      redirect("/sign-in");
    }
  } catch (er) {
    console.log(er);

    redirect("/sign-in");
  }
}
