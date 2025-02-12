"use server"
import data from "@/lib/static-data/journey-data.json";

export interface JourneyData {
  id: number;
  title: string;
  createdAt: string
  updatedAt: string
  "primary-color": string;
  "background-color": string;
  sections: JourneySection[];
};

export interface JourneySection {
  title: string;
  units: JourneyUnit[];
}
export interface JourneyUnit {
  title: string;
  "heart-points": number;
  gems: number;
  steps: JourneySteps[]
}

export interface JourneySteps {
  type: string;
  source: string;
  url: string;
}


export async function getJourneys() {
  return data;
}

export async function getJourneyById(id: number) {
  const result: JourneyData | undefined = data.find((item) => item.id === id);
  return result;

}

// export async function createJourney(newJourney: any) {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(newJourney),
//   });

//   if (!response.ok) throw new Error("Failed to create journey");
//   return response.json();
// }

// export async function updateJourney(id: number, updatedData: any) {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updatedData),
//   });

//   if (!response.ok) throw new Error("Failed to update journey");
//   return response.json();
// }

// export async function deleteJourney(id: number) {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) throw new Error("Failed to delete journey");
//   return response.json();
// }
