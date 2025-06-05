import { Tip } from "@/types";

async function getTips(): Promise<Tip[]> {
  try {
    let tips: Tip[] = [];
    let pageCount = 0;
    let totalCount = 1;

    while (pageCount < totalCount) {
      const res = await fetchTips(pageCount + 1);
      totalCount = res.meta.pagination.pageCount;
      pageCount++;
      tips = [...tips, ...res.data];
    }

    return tips;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

const fetchTips = async (page: number) => {
  try {
    const res = await fetch(
      `/api/proxy/admin/cms/health-hacks-tips?pageSize=100&page${page}`
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
};

async function PostTip(data: Tip): Promise<Tip> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/health-hacks-tips`, {
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
    console.error("Failed to Add Quiz:", err);
    throw err;
  }
}
async function UpdateTip(data: Tip): Promise<Tip> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/health-hacks-tips/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
      }),
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
    console.error("Failed to Update Quiz:", err);
    throw err;
  }
}

async function DeleteTip(id: number) {
  try {
    const response = await fetch(`/api/proxy/admin/cms/health-hacks-tips/${id}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error ?? "Failed to Delete Tip.");
    }

    return json;
  } catch (err) {
    console.error("Delete Quiz failed:", err);
    throw err;
  }
}

export { getTips, PostTip, UpdateTip, DeleteTip };
