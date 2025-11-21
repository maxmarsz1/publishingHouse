'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';

import { Article, ReviewStatus } from '@/app/types/types';
import { getArticleData } from '@/app/utils/article-helper';

import ArticleData from '@/app/components/article/ArticleData';
import ArticleReviewerInfo from '@/app/components/article/ArticleReviewerInfo';
import ArticleActions from '@/app/components/article/ArticleActions';
import ArticleReviewsTable from '@/app/components/article/ArticleReviewsTable';

import styles from './page.module.css';

const ArticleViewClientMerged = () => {
  const params = useParams();
  const articleId = params?.articleId;
  const idAsNumber = +articleId!;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId || isNaN(idAsNumber) || idAsNumber <= 0) {
      setError(`Invalid article ID: ${articleId}`);
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const fetchedArticle = await getArticleData(idAsNumber);
        setArticle(fetchedArticle);
        setReviewStatus(fetchedArticle.review?.status || null);
      } catch (err) {
        console.error(err);
        setError('Wystąpił problem z wczytaniem artykułu.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [articleId, idAsNumber]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <>
      <h1 className={styles.title}>Przegląd artykułu</h1>

      <ArticleData article={article}/>
      <ArticleActions article={article} reviewStatus={reviewStatus} />

      {article.reviews && <ArticleReviewsTable isAuthor={article.isAuthor} reviews={article.reviews} />}

      {article.review && (
        <ArticleReviewerInfo
          review={article.review}
          reviewStatus={reviewStatus}
          setReviewStatus={setReviewStatus!}
        />
      )}
    </>
  );
};

export default ArticleViewClientMerged;
