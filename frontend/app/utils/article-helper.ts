import { Publisher, Article, Status, ArticleType, ITArticleCategory, User, UserArticles } from "../types/types";
import { getPublisherData } from "./publisher-helper";



export function getAdminPublisherArticles(publisher?: Publisher): Article[]{
  // mocking data fetching from backend
  if(publisher === undefined){
    publisher = getPublisherData(0);
  }

  const sampleAuthor: User = {
    id: 1,
    username: "janedoe",
    firstName: "Jane",
    lastName: "Doe"
  };

  const publisherArticles: Article[] = [
    {
      id: 1,
      title: "Raport 1",
      status: Status.Pending,
      grade: 0,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    },
    {
      id: 2,
      title: "Raport 2",
      status: Status.Published,
      grade: 5,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    },
    {
      id: 3,
      title: "Raport 3",
      status: Status.Rejected,
      grade: 0,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    }
  ]
  return publisherArticles;
}

export function getUserPublisherArticles(publisher?: Publisher): UserArticles{
  if(publisher === undefined){
    publisher = getPublisherData(0);
  }

  const sampleAuthor: User = {
    id: 1,
    username: "janedoe",
    firstName: "Jane",
    lastName: "Doe"
  };

  const authored_articles: Article[] = [
    {
      id: 1,
      title: "Raport 1",
      status: Status.Pending,
      grade: 0,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    },
    {
      id: 2,
      title: "Raport 2",
      status: Status.Published,
      grade: 5,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    },
    {
      id: 3,
      title: "Raport 3",
      status: Status.Rejected,
      grade: 0,
      publisher: publisher,
      abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
      articleType: ArticleType.CaseReport,
      articleCategory: ITArticleCategory.ArtificialIntelligence,
      author: sampleAuthor
    }
  ]
  const articles_to_review = authored_articles;
  return {
    authored_articles,
    articles_to_review
  }
}

export function getArticleData(articleId: number): Article{
  // mocking data fetching from backend
  const publisher = getPublisherData(1);

  const sampleAuthor: User = {
    id: 1,
    username: "janedoe",
    firstName: "Jane",
    lastName: "Doe"
  };
  
  return {
    id: articleId,
    title: `Raport ${articleId}`,
    status: Status.Pending,
    grade: 0,
    publisher: publisher,
    abstract: "To jest przykładowy abstrakt raportu 1. Zawiera streszczenie głównych punktów i wyników badania.",
    articleType: ArticleType.CaseReport,
    articleCategory: ITArticleCategory.ArtificialIntelligence,
    author: sampleAuthor,
    filePath: `/articles/${articleId}.pdf` // Example file path
  };
}