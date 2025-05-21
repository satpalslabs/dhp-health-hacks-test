import NHSMedicinesAtoZ from "@/components/cms/nhs/nhs-medicines-AtoZ";
import MainLayout from "@/components/main-layout";

const Page = () => (
  <MainLayout
    pageNavigation={[
      {
        link: "/conditions",
        text: "Medicines A-Z",
      },
    ]}
  >
    <NHSMedicinesAtoZ />
  </MainLayout>
);
export default Page;
