import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-fit mx-auto p-6">
      <div className="h-full rounded-[24px] shrink-0 w-[690px] flex  justify-center bg-primary items-center">
        <Image
          src={"/dark-logo.png"}
          height={1000}
          width={1000}
          alt="logo"
          className="h-[150px] w-auto"
        />
      </div>
      <div className="h-full w-[690px] flex items-center overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
}
