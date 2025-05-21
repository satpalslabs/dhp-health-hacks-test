import PageHeader from "@/components/page-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        path={[
          {
            link: "/onboarding-flow",
            text: "Onboarding flow",
          },
        ]}
      />
      {children}
    </div>
  );
}
