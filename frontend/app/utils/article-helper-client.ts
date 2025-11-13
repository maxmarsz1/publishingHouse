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