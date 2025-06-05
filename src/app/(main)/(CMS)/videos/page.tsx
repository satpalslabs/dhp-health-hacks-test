import Videos from "@/components/cms/videos";
import MainLayout from "@/components/main-layout";

const DefaultArticles = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/videos",
        text: "Videos",
      },
    ]}
  >
    <Videos />
  </MainLayout>
);
export default DefaultArticles;
