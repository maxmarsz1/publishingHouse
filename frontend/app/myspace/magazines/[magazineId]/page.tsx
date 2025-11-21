'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { getPublisherData } from '@/app/utils/publisher-helper';
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper';

import AdminActions from '@/app/components/magazines/AdminActions';
import ArticleTable from '@/app/components/article/ArticleTable';
import ReviewsTable from '@/app/components/article/ReviewsTable';
import MagazineName from '@/app/components/magazines/MagazineName';
import MagazineDescription from '@/app/components/magazines/MagazineDescription';
import styles from './page.module.css';

import { Publisher, Article, UserArticles } from '@/app/types/types';
import { UserContext } from '@/app/context/UserContext';

interface Props {
  params: { magazineId: string };
}

const PublisherViewClient = () => {
  const params = useParams();
  const magazineId = params?.magazineId;
  const idAsNumber = +magazineId!;

  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const { isStaff } = useContext(UserContext);
  const [adminArticles, setAdminArticles] = useState<Article[] | null>(null);
  const [regularUserArticles, setRegularUserArticles] = useState<UserArticles | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert dueDate to readable string
  const [dueDateReadable, setDueDateReadable] = useState<string>('Brak');

  useEffect(() => {
    if (isNaN(idAsNumber) || idAsNumber <= 0) {
      setError(`Invalid publisher ID: ${magazineId}`);
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const pub = await getPublisherData(idAsNumber);
        setPublisher(pub);

        const due = pub.dueDate ? new Date(pub.dueDate) : null;
        setDueDate(due);
        setDueDateReadable(
          due
            ? due.toLocaleString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Brak'
        );

        if (isStaff) {
          const admin = await getAdminPublisherArticles(idAsNumber);
          setAdminArticles(admin);
        } else {
          const userArticles = await getUserPublisherArticles(idAsNumber);
          setRegularUserArticles(userArticles);
        }
      } catch (err) {
        console.error(err);
        setError('Wystąpił problem z wczytaniem danych.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [idAsNumber, magazineId]);

  const updateDueDate = (newDueDate: string) => {
    const updatedDate = new Date(newDueDate);
    setDueDate(updatedDate);
    setDueDateReadable(
      updatedDate.toLocaleString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!publisher) return <p>Publisher not found</p>;

  const pastDue = dueDate ? new Date() > dueDate : false;

  return (
    <>
      <div>
        <div className={styles.topContainer}>
          <MagazineName publisherName={publisher.name} publisherId={publisher.id}/>
          <MagazineDescription publisherDescription={publisher.description} publisherId={publisher.id}/>
          <p className={styles.dueDateContainer}>
            <span>
              <FontAwesomeIcon icon={faClock} />&nbsp;Termin przesłania:{' '}
            </span>
            <span className={styles.dueDate}>{dueDateReadable}</span>
          </p>
        </div>

        {!pastDue && !isStaff && (
          <Button
            style={{ gap: '8px' }}
            variant="contained"
            href={`/myspace/publishers/${publisher.id}/new-article`}
            component={Link}
          >
            Przeslij raport
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}

        {isStaff && <AdminActions publisher={publisher} onDueDateUpdate={updateDueDate} />}
      </div>

      {adminArticles && <ArticleTable title="Wszystkie raporty" articles={adminArticles} admin />}
      {regularUserArticles && (
        <>
          <ArticleTable title="Twoje raporty" articles={regularUserArticles.authored_articles} />
          <ReviewsTable reviews={regularUserArticles.user_reviews} />
        </>
      )}
    </>
  );
};

export default PublisherViewClient;
