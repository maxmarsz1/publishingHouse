'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleForm from "@/app/components/article/ArticleForm";
import ArticleFormatting from "@/app/components/article/ArticleFormating";
import { getArticleData } from "@/app/utils/article-helper";
import { Article } from "@/app/types/types";

const EditArticlePage = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleId = params?.articleId;

  useEffect(() => {
    const fetchData = async () => {
      if (!articleId) return;

      const idAsNumber = Number(articleId);
      if (isNaN(idAsNumber) || !idAsNumber) {
        setError(`Invalid article_id provided: ${articleId}`);
        setLoading(false);
        return;
      }

      try {
        const data = await getArticleData(idAsNumber);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load article data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Artykuł nie został znaleziony.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{ marginBottom: "16px", fontWeight: 400 }}>{article.title} - Edytuj raport</h1>
        <ArticleFormatting />
      </div>
      <ArticleForm article={article} publisherId={article.publisher.id} />
    </div>
  );
};

export default EditArticlePage;
