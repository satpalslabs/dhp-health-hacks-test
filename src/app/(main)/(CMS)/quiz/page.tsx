import QuizMainPage from "@/components/cms/quiz";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/quiz",
        text: "Quizzes",
      },
    ]}
  >
    <QuizMainPage />
  </MainLayout>
);
export default Page;
