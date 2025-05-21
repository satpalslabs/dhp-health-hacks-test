import TipsMainPage from "@/components/cms/tips";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/tips",
        text: "Tips",
      },
    ]}
  >
    <TipsMainPage />
  </MainLayout>
);
export default Page;
