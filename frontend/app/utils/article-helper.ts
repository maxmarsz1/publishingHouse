import { Publisher, Article, Status, ArticleType, ITArticleCategory, User, UserArticles } from "../types/types";
import { getPublisherData } from "./publisher-helper";
import apiServer from "./api-server";


export async function getAdminPublisherArticles(id: number): Promise<Article[]> {
  try {
    const response = await apiServer.get(`/publisher/${id}/raports/`);
    console.log("Fetched articles data:", response.data.all_raports);
    return response.data.all_raports as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getUserPublisherArticles(id: number): Promise<UserArticles>{
  try {
    const response = await apiServer.get(`/publisher/${id}/raports/`);
    console.log("Fetched articles data:", response.data);
    return response.data as UserArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      authored_articles: [],
      articles_to_review: []
    };
  }
}

export async function getUserArticles(): Promise<UserArticles>{
  try {
    const response = await apiServer.get(`/user/raports/`);
    console.log("Fetched articles data:", response.data);
    return response.data as UserArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      authored_articles: [],
      articles_to_review: []
    };
  }
}

export async function getArticleData(id: number): Promise<Article>{
  try {
    const response = await apiServer.get(`/raport/${id}/`);
    console.log("Fetched articles data:", response.data);
    return response.data as Article;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch article data");
  }
}