'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  const loadData = useCallback(async () => {
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
  }, [idAsNumber]);

  useEffect(() => {
    if (!articleId || isNaN(idAsNumber) || idAsNumber <= 0) {
      setError(`Invalid article ID: ${articleId}`);
      setLoading(false);
      return;
    }

    loadData();
  }, [articleId, idAsNumber, loadData]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Raport nie istnieje.</p>;

  return (
    <>
      <h1 className={styles.title}>Przegląd raportu</h1>

      <ArticleData article={article} />
      <ArticleActions article={article} reviewStatus={reviewStatus} />

      {article.reviews && <ArticleReviewsTable isAuthor={article.isAuthor} reviews={article.reviews} onReviewApproved={loadData} />}

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
