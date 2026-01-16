'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { Paper, ReviewStatus } from '@/app/types/types';
import { getPaperData } from '@/app/utils/paper-helper';

import PaperData from '@/app/components/paper/PaperData';
import PaperReviewerInfo from '@/app/components/paper/PaperReviewerInfo';
import PaperActions from '@/app/components/paper/PaperActions';
import PaperReviewsList from '@/app/components/paper/PaperReviewsList';

import styles from './page.module.css';

const PaperViewClientMerged = () => {
  const params = useParams();
  const paperId = params?.paperId;
  const idAsNumber = +paperId!;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const fetchedPaper = await getPaperData(idAsNumber);
      setPaper(fetchedPaper);
      setReviewStatus(fetchedPaper.review?.status || null);
    } catch (err) {
      console.error(err);
      setError('Wystąpił problem z wczytaniem artykułu.');
    } finally {
      setLoading(false);
    }
  }, [idAsNumber]);

  useEffect(() => {
    if (!paperId || isNaN(idAsNumber) || idAsNumber <= 0) {
      setError(`Invalid paper ID: ${paperId}`);
      setLoading(false);
      return;
    }

    loadData();
  }, [paperId, idAsNumber, loadData]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;
  if (!paper) return <p>Artykuł nie istnieje.</p>;

  return (
    <>
      <PaperData paper={paper} />
      <PaperActions paper={paper} reviewStatus={reviewStatus} />

      {paper.reviews && <PaperReviewsList isAuthor={paper.isAuthor} reviews={paper.reviews} onReviewApproved={loadData} />}

      {paper.review && (
        <PaperReviewerInfo
          review={paper.review}
          reviewStatus={reviewStatus}
          setReviewStatus={setReviewStatus!}
        />
      )}
    </>
  );
};

export default PaperViewClientMerged;
