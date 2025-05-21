import JourneyDataProvider from "@/context/journey-data-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JourneyDataProvider>{children}</JourneyDataProvider>;
}
