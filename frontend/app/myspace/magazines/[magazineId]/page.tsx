'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { getMagazineData } from '@/app/utils/magazine-helper';
import { getAdminMagazinePapers, getUserMagazinePapers } from '@/app/utils/paper-helper';

import AdminActions from '@/app/components/magazines/AdminActions';
import PaperTable from '@/app/components/paper/PaperTable';
import ReviewsTable from '@/app/components/paper/ReviewsTable';
import MagazineName from '@/app/components/magazines/MagazineName';
import MagazineDescription from '@/app/components/magazines/MagazineDescription';
import styles from './page.module.css';

import { Magazine, Paper, UserPapers, User } from '@/app/types/types';
import { UserContext } from '@/app/context/UserContext';

const MagazineViewClient = () => {
  const params = useParams();
  const magazineId = params?.magazineId;
  const idAsNumber = +magazineId!;
  const { isStaff } = useContext(UserContext);

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [adminPapers, setAdminPapers] = useState<Paper[] | null>(null);
  const [regularUserPapers, setRegularUserPapers] = useState<UserPapers | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueDateReadable, setDueDateReadable] = useState<string>('----------');
  const [members, setMembers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(idAsNumber) || idAsNumber <= 0) {
      setError(`Invalid magazine ID: ${magazineId}`);
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const mag = await getMagazineData(idAsNumber);
        setMagazine(mag);

        const due = mag.dueDate ? new Date(mag.dueDate) : null;
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
            : '----------'
        );

        if (isStaff) {
          const admin = await getAdminMagazinePapers(idAsNumber);
          setAdminPapers(admin);
        } else {
          const userPapers = await getUserMagazinePapers(idAsNumber);
          setRegularUserPapers(userPapers);
        }
      } catch (err) {
        console.error(err);
        setError('Wystąpił problem z wczytaniem danych.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [idAsNumber, magazineId, isStaff]);

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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;
  if (!magazine) return <p>Wystąpił problem z wczytaniem danych.</p>;

  const pastDue = dueDate ? new Date() > dueDate : false;

  return (
    <>
      <div>
        <div className={styles.topContainer}>
          <MagazineName magazineName={magazine.name} magazineId={magazine.id} />
          <MagazineDescription magazineDescription={magazine.description} magazineId={magazine.id} />
          <p className={styles.dueDateContainer}>
            <span>
              <FontAwesomeIcon icon={faClock} />&nbsp;Termin przesłania:{' '}
            </span>
            <span className={styles.dueDate}>{dueDateReadable}</span>
          </p>
        </div>

        {!pastDue && !isStaff && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ cursor: regularUserPapers?.authored_papers.length !== 0 ? 'not-allowed' : 'pointer' }}>
              <Button
                style={{ gap: '8px' }}
                variant="contained"
                href={`/myspace/magazines/${magazine.id}/new-paper`}
                component={Link}
                disabled={regularUserPapers?.authored_papers.length !== 0}
              >
                Prześlij artykuł
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </span>
            {regularUserPapers?.authored_papers.length !== 0 && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                <FontAwesomeIcon icon={faInfoCircle} />&nbsp;
                Możesz przesłać tylko jeden artykuł w ramach tego czasopisma.
              </span>
            )}
          </div>
        )}

        {isStaff && <AdminActions
          magazine={magazine}
          onDueDateUpdate={updateDueDate}
          members={members}
          setMembers={setMembers}
        />}
      </div>

      {adminPapers && <PaperTable title="Wszystkie artykuły" papers={adminPapers} />}
      {regularUserPapers && (
        <>
          <PaperTable title="Twoje artykuły" papers={regularUserPapers.authored_papers} />
          <ReviewsTable reviews={regularUserPapers.user_reviews} />
        </>
      )}
    </>
  );
};

export default MagazineViewClient;
