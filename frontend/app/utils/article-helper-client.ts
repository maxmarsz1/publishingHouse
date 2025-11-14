import { Article, NewArticle } from "../types/types";
import apiClient from "./api-client";

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