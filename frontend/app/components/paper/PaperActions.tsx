'use client'

import { Paper, ReviewStatus, PaperStatus } from '@/app/types/types';
import { faDownload, faEdit, faStar, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Link from 'next/link';
import React, { useContext } from 'react'
import DeletePaperBtn from './DeletePaperBtn';
import styles from './PaperActions.module.css';
import { downloadPaper } from '@/app/utils/paper-helper';
import { UserContext } from '@/app/context/UserContext';

interface PaperActionsProps {
  paper: Paper;
  reviewStatus: ReviewStatus | null;
}

const PaperActions = ({ paper, reviewStatus }: PaperActionsProps) => {
  const { isStaff } = useContext(UserContext);

  async function handleDownload() {
    try {
      const response = await downloadPaper(paper.id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${paper.title || 'paper'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    }
    catch (error) {
      console.error("Error downloading paper:", error);
    }
  }

  return (
    <div className={styles.container}>
      {(paper.isAuthor || isStaff || (reviewStatus && reviewStatus == ReviewStatus.Pending)) &&
        <Button className={styles.downloadBtn} variant='contained' onClick={handleDownload}>
          Pobierz artykuł&nbsp;
          <FontAwesomeIcon icon={faDownload} />
        </Button>
      }
      {(reviewStatus && reviewStatus == ReviewStatus.Pending) || (isStaff && paper.status === PaperStatus.Pending) ? (
        <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/papers/${paper.id}/review`}>
          Recenzuj&nbsp;
          <FontAwesomeIcon icon={faStar} />
        </Button>
      ) : null}
      {paper.isAuthor && paper.status == PaperStatus.WaitingForRevision &&
        <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/papers/${paper.id}/edit`}>
          Prześlij poprawkę&nbsp;
          <FontAwesomeIcon icon={faUpload} />
        </Button>
      }
      {isStaff &&
        <DeletePaperBtn paperId={paper.id} />
      }
    </div>
  )
}

export default PaperActions