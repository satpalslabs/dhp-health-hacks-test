import { HealthCondition } from "@/types";

async function getHConditions(): Promise<HealthCondition[]> {
  const res = await fetch("/api/proxy/admin/cms/conditions");
  const json = await res.json();
  return json.data ?? [];
}
async function PostHCondition(data: HealthCondition): Promise<HealthCondition> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/conditions`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const json = await response.json();

    return json.data;
  } catch (err) {
    console.error("Failed to Add Health Condition:", err);
    throw err;
  }
}

export { getHConditions, PostHCondition }