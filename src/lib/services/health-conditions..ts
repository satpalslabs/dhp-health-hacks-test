import { HealthCondition } from "@/types";
let HealthConditionCache: HealthCondition[] | null = null;

async function getHConditions(): Promise<HealthCondition[]> {
  if (HealthConditionCache) return HealthConditionCache;
  const res = await fetch("/api/proxy/admin/cms/conditions");
  const json = await res.json();
  HealthConditionCache = json.data;
  return HealthConditionCache ?? [];
}

export { getHConditions }