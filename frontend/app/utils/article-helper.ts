import { Article, UserArticles } from "../types/types";
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