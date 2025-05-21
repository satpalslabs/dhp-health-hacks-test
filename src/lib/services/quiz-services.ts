import { Quiz } from "@/types";

async function getQuizzes(): Promise<Quiz[]> {
  try {
    let quizzes: Quiz[] = [];
    let pageCount = 0;
    let totalCount = 1;

    while (pageCount < totalCount) {
      const res = await fetchQuizzes(pageCount + 1);
      totalCount = res.meta.pagination.pageCount;
      pageCount++;
      quizzes = [...quizzes, ...res.data];
    }

    return quizzes;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

const fetchQuizzes = async (page: number) => {
  try {
    const res = await fetch(
      `/api/proxy/admin/cms/quizzes?pageSize=100&page${page}`
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
};

async function PostQuiz(data: Quiz): Promise<Quiz> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/quizzes`, {
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
async function UpdateQuiz(data: Quiz): Promise<Quiz> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/quizzes/${data.id}`, {
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

async function DeleteQuiz(id: number) {
  try {
    const response = await fetch(`/api/proxy/admin/cms/quizzes/${id}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error("Failed to Delete Quiz.");
    }

    return json;
  } catch (err) {
    console.error("Delete Quiz failed:", err);
    throw err;
  }
}

export { getQuizzes, PostQuiz, UpdateQuiz, DeleteQuiz };
