import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";

const DefaultArticles = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/videos",
        text: "Videos",
      },
      {
        text: "Add new Video",
        link: "",
      },
    ]}
  >
    <AddArticle redirectTo="/videos" />
  </MainLayout>
);
export default DefaultArticles;
