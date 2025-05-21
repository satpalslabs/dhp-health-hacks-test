import NHSHealthConditions from "@/components/cms/nhs/nhs-health-condition-aToZ";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/conditions",
        text: "Health A-Z",
      },
    ]}
  >
    <NHSHealthConditions />
  </MainLayout>
);
export default Page;
