import ArticleDataProvider from "@/context/article-data-provider";
import CollectionDataProvider from "@/context/collection-data-provider";
import HConditionDataProvider from "@/context/health-conditions-provider";
import NHSConditionDataProvider from "@/context/nhs-conditions-provider";
import NHSMedicinesDataProvider from "@/context/nhs-medicines-provider";
import PacksDataProvider from "@/context/pack-data-provider";
import QuizDataProvider from "@/context/quiz-data-provider";
import SectionDataProvider from "@/context/section-data-provider";
import SubSectionDataProvider from "@/context/sub-section-data-provider";
import TipsDataProvider from "@/context/tips-data-provider";
import VideoDataProvider from "@/context/video-data-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SectionDataProvider>
      <SubSectionDataProvider>
        <HConditionDataProvider>
          <PacksDataProvider>
            <TipsDataProvider>
              <QuizDataProvider>
                <ArticleDataProvider>
                  <VideoDataProvider>
                    <CollectionDataProvider>
                      <NHSMedicinesDataProvider>
                        <NHSConditionDataProvider>
                          {children}
                        </NHSConditionDataProvider>
                      </NHSMedicinesDataProvider>
                    </CollectionDataProvider>
                  </VideoDataProvider>
                </ArticleDataProvider>
              </QuizDataProvider>
            </TipsDataProvider>
          </PacksDataProvider>
        </HConditionDataProvider>
      </SubSectionDataProvider>
    </SectionDataProvider>
  );
}
