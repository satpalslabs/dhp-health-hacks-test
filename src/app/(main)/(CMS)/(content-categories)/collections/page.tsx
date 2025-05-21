import CollectionsMainPage from "@/components/cms/content-categories/collections";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/collections",
        text: "Collections",
      },
    ]}
  >
    <CollectionsMainPage />
  </MainLayout>
);
export default Page;
