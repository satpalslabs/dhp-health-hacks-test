import PageHeader from "@/components/page-header";
import { getJourneyById, JourneyData } from "@/lib/journey-services";
/* eslint-disable  @typescript-eslint/no-explicit-any */

export default async function Journey({
  params,
}: {
  params: Promise<any> | undefined;
}) {
  // Share blog slug to client component
  const { journey } = await params;
  const journeyData: JourneyData | undefined = await getJourneyById(
    Number(journey)
  );

  // If no blog is found, return 404
  if (!journeyData) {
    return null; // This will trigger the 404 page
  }
  return (
    <>
      <PageHeader path={journeyData.title} />
      <div className="text-inherit">journeyData</div>
    </>
  );
}
