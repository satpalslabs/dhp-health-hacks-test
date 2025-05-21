import SectionsMainPage from "@/components/cms/content-categories/sections";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/sections",
        text: "Sections",
      },
    ]}
  >
    <SectionsMainPage />
  </MainLayout>
);
export default Page;
