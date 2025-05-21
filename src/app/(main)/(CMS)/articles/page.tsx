import Articles from "@/components/cms/articles";
import MainLayout from "@/components/main-layout";

const DefaultArticles = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/articles",
        text: "Articles",
      },
    ]}
  >
    <Articles />
  </MainLayout>
);
export default DefaultArticles;
