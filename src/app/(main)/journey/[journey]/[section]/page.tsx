import DetailJourney from "../page";

export default async function DetailJourneySection({
  params,
}: {
  params: Promise<{ journey: string; section: string }>;
}) {
  return DetailJourney({
    params: params,
  });
}
