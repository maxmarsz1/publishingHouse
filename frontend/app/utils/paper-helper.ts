import { Paper, UserPapers, NewPaper } from "../types/types";
import apiClient from "./api-client";


export async function getAdminMagazinePapers(id: number): Promise<Paper[]> {
  try {
    const response = await apiClient.get(`/magazine/${id}/papers/`);

    console.log("Fetched papers data:", response.data.all_papers);
    return response.data.all_papers as Paper[];
  } catch (error) {
    console.error("Error fetching papers:", error);
    return [];
  }
}

export async function getUserMagazinePapers(id: number): Promise<UserPapers> {
  try {
    const response = await apiClient.get(`/magazine/${id}/papers/`);
    console.log("Fetched papers data:", response.data);
    return {
      authored_papers: response.data.authored_papers,
      user_reviews: response.data.user_reviews
    } as UserPapers;
  } catch (error) {
    console.error("Error fetching papers:", error);
    return {
      authored_papers: [],
      user_reviews: []
    };
  }
}

export async function getUserPapers(): Promise<UserPapers> {
  try {
    const response = await apiClient.get(`/user/papers/`);
    console.log(response.data)
    const transformedPaper = {
      authored_papers: response.data.authored_papers ? response.data.authored_papers : [],
      user_reviews: response.data.user_reviews ? response.data.user_reviews : []
    }
    console.log("Fetched papers data:", transformedPaper);
    return transformedPaper as UserPapers;
  } catch (error) {
    console.error("Error fetching papers:", error);
    return {
      authored_papers: [],
      user_reviews: []
    };
  }
}

export async function getPaperData(id: number): Promise<Paper> {
  try {
    const response = await apiClient.get(`/paper/${id}/`);
    console.log(response.data)
    const transformedPaper = {
      ...response.data,
      paperType: response.data.paper_type,
      paperCategory: response.data.category,
      toReview: response.data.to_review,
      createdAt: response.data.created_at,
      isAuthor: response.data.is_author
    };
    console.log("Fetched papers data:", transformedPaper);
    return transformedPaper as Paper;
  } catch (error) {
    console.error("Error fetching papers:", error);
    throw new Error("Failed to fetch paper data");
  }
}

export async function createPaper(paperData: NewPaper): Promise<Paper> {
  try {
    const formData = new FormData();
    formData.append("title", paperData.title);
    formData.append("abstract", paperData.abstract);
    formData.append("paper_type", paperData.paperType);
    formData.append("category", paperData.paperCategory);
    formData.append("comment", paperData.comment || "");
    formData.append("keywords", paperData.keywords || "");
    formData.append("file", paperData.file);

    const response = await apiClient.post(
      `/magazine/${paperData.magazineId}/create-paper/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Paper created successfully:", response.data);
    return response.data as Paper;
  } catch (error) {
    console.error("Error creating paper:", error);
    throw error;
  }
}

export async function deletePaper(paperId: number): Promise<void> {
  try {
    await apiClient.delete(`/paper/${paperId}/`);
    console.log("Paper deleted successfully");
  } catch (error) {
    console.error("Error deleting paper:", error);
    throw error;
  }
}

export async function updatePaper(updatedPaperData: Partial<Paper> & { id: number }): Promise<Paper> {
  try {
    const formData = new FormData();
    if (updatedPaperData.title) formData.append("title", updatedPaperData.title);
    if (updatedPaperData.abstract) formData.append("abstract", updatedPaperData.abstract);
    if (updatedPaperData.paperType) formData.append("paper_type", updatedPaperData.paperType);
    if (updatedPaperData.paperCategory) formData.append("category", updatedPaperData.paperCategory);
    if (updatedPaperData.comment) formData.append("comment", updatedPaperData.comment);
    if (updatedPaperData.keywords) formData.append("keywords", updatedPaperData.keywords);
    if (updatedPaperData.file instanceof File) {
      formData.append("file", updatedPaperData.file);
    }

    const response = await apiClient.put(
      `/paper/${updatedPaperData.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Paper updated successfully:", response.data);
    return response.data as Paper;
  } catch (error) {
    console.error("Error updating paper:", error);
    throw error;
  }
}

export async function downloadPaper(paperId: number): Promise<Blob> {
  try {
    const response = await apiClient.get(`/paper/${paperId}/download/`, {
      responseType: "blob",
    });
    console.log("Paper downloaded successfully");
    return response.data as Blob;
  } catch (error) {
    console.error("Error downloading paper:", error);
    throw error;
  }
}

export async function downloadReviewPDF(reviewId: number): Promise<Blob> {
  try {
    const response = await apiClient.get(`/paper/review/${reviewId}/pdf/`, {
      responseType: "blob",
    });
    console.log("Review PDF downloaded successfully");
    return response.data as Blob;
  } catch (error) {
    console.error("Error downloading review PDF:", error);
    throw error;
  }
}

export async function answearReviewInvite(reviewId: number, accept: boolean): Promise<void> {
  try {
    await apiClient.post(`/paper/${reviewId}/review-invite-response/`, { accept });
    console.log("Review invite response sent successfully");
  } catch (error) {
    console.error("Error sending review invite response:", error);
    throw error;
  }
}

export async function approveReview(reviewId: number): Promise<void> {
  try {
    await apiClient.post(`/review/${reviewId}/approve/`);
    console.log("Review approved successfully");
  } catch (error) {
    console.error("Error approving review:", error);
    throw error;
  }
}

export async function submitPaperRevision(paperId: number, file: File): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await apiClient.post(`/paper/${paperId}/submit-revision/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Revision submitted successfully");
  } catch (error) {
    console.error("Error submitting revision:", error);
    throw error;
  }
}