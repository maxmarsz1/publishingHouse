'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import AdminActions from '@/app/components/publisher/AdminActions';
import ArticleTable from '@/app/components/article/ArticleTable';
import { Article, Publisher, UserArticles } from '@/app/types/types';
import styles from './PublisherClientView.module.css'
import PublisherName from '@/app/components/publisher/PublisherName';
import PublisherDescription from '@/app/components/publisher/PublisherDescription';
import ReviewsTable from '@/app/components/article/ReviewsTable';

const PublisherClientView = ({
  publisher,
  dueDate: initialDueDate,
  isStaff,
  adminArticles,
  regularUserArticles,
}: {
  publisher: Publisher;
  dueDate: Date | null;
  isStaff: boolean;
  adminArticles?: Article[] | null;
  regularUserArticles?: UserArticles | null;
}) => {
  const [dueDate, setDueDate] = useState<Date | null>(initialDueDate);
  const [dueDateReadable, setDueDateReadable] = useState<string>(
    initialDueDate ? initialDueDate.toLocaleString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Brak'
  );

  const pastDue = dueDate ? new Date() > dueDate : false;

  const updateDueDate = (newDueDate: string) => {
    const updatedDate = new Date(newDueDate);
    setDueDate(updatedDate);
    setDueDateReadable(updatedDate.toLocaleString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}));
  };

  return (
    <>
      <div>
        <div className={styles.topContainer}>
          <PublisherName publisherName={publisher.name} publisherId={publisher.id} isStaff={isStaff}/>
          <PublisherDescription publisherDescription={publisher.description} publisherId={publisher.id} isStaff={isStaff}/>
          <p className={styles.dueDateContainer}>
            <span>
              <FontAwesomeIcon icon={faClock} />&nbsp;
              Termin przesłania: 
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

      {adminArticles && (
        <ArticleTable
          title={'Wszystkie raporty'}
          articles={adminArticles}
          admin={true}
        />
      )}
      {regularUserArticles && (
        <>
          <ArticleTable
            title={'Twoje raporty'}
            articles={regularUserArticles.authored_articles}
          />
          <ReviewsTable
            reviews={regularUserArticles.user_reviews}
          />
        </>
      )}
    </>
  );
};

export default PublisherClientView;