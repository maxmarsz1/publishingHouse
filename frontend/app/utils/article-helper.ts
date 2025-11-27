import { Article, UserArticles, NewArticle } from "../types/types";
import apiClient from "./api-client";


export async function getAdminPublisherArticles(id: number): Promise<Article[]> {
  try {
    const response = await apiClient.get(`/publisher/${id}/raports/`);

    console.log("Fetched articles data:", response.data.all_raports);
    return response.data.all_raports as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getUserPublisherArticles(id: number): Promise<UserArticles>{
  try {
    const response = await apiClient.get(`/publisher/${id}/raports/`);
    console.log("Fetched articles data:", response.data);
    return {
      authored_articles: response.data.authored_raports,
      user_reviews: response.data.user_reviews
    } as UserArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      authored_articles: [],
      user_reviews: []
    };
  }
}

export async function getUserArticles(): Promise<UserArticles>{
  try {
    const response = await apiClient.get(`/user/raports/`);
    console.log(response.data)
    const transformedArticle = {
      authored_articles: response.data.authored_raports ? response.data.authored_raports : [],
      user_reviews: response.data.user_reviews ? response.data.user_reviews : []
    }
    console.log("Fetched articles data:", transformedArticle);
    return transformedArticle as UserArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      authored_articles: [],
      user_reviews: []
    };
  }
}

export async function getArticleData(id: number): Promise<Article>{
  try {
    const response = await apiClient.get(`/raport/${id}/`);
    console.log(response.data)
    const transformedArticle = {
      ...response.data,
      articleType: response.data.raport_type,
      articleCategory: response.data.category,
      toReview: response.data.to_review,
      createdAt: response.data.created_at,
      isAuthor: response.data.is_author
    };
    console.log("Fetched articles data:", transformedArticle);
    return transformedArticle as Article;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch article data");
  }
}

export async function createArticle(articleData: NewArticle): Promise<Article> {
  try {
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("abstract", articleData.abstract);
    formData.append("raport_type", articleData.articleType);
    formData.append("category", articleData.articleCategory);
    formData.append("comment", articleData.comment || "");
    formData.append("keywords", articleData.keywords || "");
    formData.append("file", articleData.file);

    const response = await apiClient.post(
      `/publisher/${articleData.publisherId}/create-raport/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Article created successfully:", response.data);
    return response.data as Article;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

export async function deleteArticle(articleId: number): Promise<void> {
  try {
    await apiClient.delete(`/raport/${articleId}/`);
    console.log("Article deleted successfully");
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function updateArticle(updatedArticleData: Partial<Article> & { id: number }): Promise<Article> {
  try {
    const formData = new FormData();
    if (updatedArticleData.title) formData.append("title", updatedArticleData.title);
    if (updatedArticleData.abstract) formData.append("abstract", updatedArticleData.abstract);
    if (updatedArticleData.articleType) formData.append("raport_type", updatedArticleData.articleType);
    if (updatedArticleData.articleCategory) formData.append("category", updatedArticleData.articleCategory);
    if (updatedArticleData.comment) formData.append("comment", updatedArticleData.comment);
    if (updatedArticleData.keywords) formData.append("keywords", updatedArticleData.keywords);
    if (updatedArticleData.file instanceof File) {
      formData.append("file", updatedArticleData.file);
    }

    const response = await apiClient.put(
      `/raport/${updatedArticleData.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Article updated successfully:", response.data);
    return response.data as Article;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export async function downloadArticle(articleId: number): Promise<Blob> {
  try {
    const response = await apiClient.get(`/raport/${articleId}/download/`, {
      responseType: "blob",
    });
    console.log("Article downloaded successfully");
    return response.data as Blob;
  } catch (error) {
    console.error("Error downloading article:", error);
    throw error;
  }
}

export async function answearReviewInvite(reviewId: number, accept: boolean): Promise<void> {
  try {
    await apiClient.post(`/raport/${reviewId}/review-invite-response/`, {accept});
    console.log("Review invite response sent successfully");
  } catch (error) {
    console.error("Error sending review invite response:", error);
    throw error;
  }
}