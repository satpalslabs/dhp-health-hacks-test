import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";

const DefaultArticles = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/articles",
        text: "Articles",
      },
      {
        text: "Add new Article",
        link: "",
      },
    ]}
  >
    <AddArticle redirectTo="/articles" />
  </MainLayout>
);
export default DefaultArticles;
