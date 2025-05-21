import Articles from "@/components/cms/articles";
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
    <Articles />
  </MainLayout>
);
export default DefaultArticles;
