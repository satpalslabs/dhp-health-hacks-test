import { activeData } from ".";
import { ScreenHeader } from "./screen-components";
import SubSectionView from "./sub-section-view";
import CollectionView from "./collection-view";
import ArticleDetailView from "./article-detail-preview";

const ActiveView = ({
  activeData,
  setActiveData,
}: {
  activeData: activeData;
  setActiveData: React.Dispatch<React.SetStateAction<activeData[]>>;
}) => {
  switch (activeData.type) {
    case "collection":
      return (
        <CollectionView activeData={activeData} setActiveData={setActiveData} />
      );
    case "sub-section":
      return (
        <SubSectionView activeData={activeData} setActiveData={setActiveData} />
      );
    case "article":
      return (
        <div className="w-full overflow-y-auto no-scrollbar h-full shrink-0 relative pb-5  ">
          <ScreenHeader activeData={activeData} setActiveData={setActiveData} />
          <ArticleDetailView activeData={activeData} />
        </div>
      );
  }
};

export default ActiveView;
