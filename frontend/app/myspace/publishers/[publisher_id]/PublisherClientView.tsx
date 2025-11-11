'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import AdminActions from '@/app/components/publisher/AdminActions';
import ArticleTable from '@/app/components/article/ArticleTable';
import { Article, Publisher } from '@/app/types/types';

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
  adminArticles: Article[] | null;
  regularUserArticles: { authored_articles: Article[] } | null;
}) => {
  const [dueDate, setDueDate] = useState<Date | null>(initialDueDate);
  const [dueDateReadable, setDueDateReadable] = useState<string>(
    initialDueDate ? initialDueDate.toLocaleString() : 'Brak'
  );

  const pastDue = dueDate ? new Date() > dueDate : false;

  // Callback to update dueDate
  const updateDueDate = (newDueDate: string) => {
    const updatedDate = new Date(newDueDate);
    setDueDate(updatedDate);
    setDueDateReadable(updatedDate.toLocaleString());
  };

  return (
    <>
      <div>
        <h1 style={{ marginBottom: '8px' }}>Wydawnictwo "{publisher.name}"</h1>
        <p style={{ marginBottom: '32px' }}>{publisher.description}</p>
        <p>Termin przesłania: {dueDateReadable}</p>
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
        <ArticleTable
          title={'Twoje raporty'}
          articles={regularUserArticles.authored_articles}
        />
      )}
    </>
  );
};

export default PublisherClientView;