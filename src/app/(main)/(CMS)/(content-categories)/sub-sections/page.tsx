import SubSectionsMainPage from "@/components/cms/content-categories/sub-sections";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/sub-sections",
        text: "Sub Sections",
      },
    ]}
  >
    <SubSectionsMainPage />
  </MainLayout>
);
export default Page;
