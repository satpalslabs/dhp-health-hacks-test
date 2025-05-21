import PacksPage from "@/components/cms/content-categories/packs";
import MainLayout from "@/components/main-layout";

export default async function Page() {
  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/packs",
          text: "Packs",
        },
      ]}
    >
      <PacksPage />
    </MainLayout>
  );
}
