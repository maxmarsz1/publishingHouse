'use client'

import { Article, ReviewStatus, Status } from '@/app/types/types';
import { faDownload, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react'
import DeleteArticleBtn from './DeleteArticleBtn';
import styles from './ArticleActions.module.css';
import { downloadArticle } from '@/app/utils/article-helper-client';

interface ArticleActionsProps {
    article: Article;
    isStaff: boolean;
    reviewStatus: ReviewStatus | null;
}

const ArticleActions = ({article, isStaff, reviewStatus}: ArticleActionsProps) => {
  async function handleDownload(){
    if(!article.file || article.file == '' || typeof article.file !== 'string') return;

    try {
      const response = await downloadArticle(article.id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${article.title || 'article'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    }
    catch (error) {
      console.error("Error downloading article:", error);
    }
  }

  return (
    <div className={styles.container}>
        {(article.isAuthor || isStaff || (reviewStatus && reviewStatus == ReviewStatus.Pending)) &&
          <Button className={styles.downloadBtn} variant='contained' onClick={handleDownload}>
            Pobierz artykuł&nbsp;
            <FontAwesomeIcon icon={faDownload} />  
          </Button>
        }
        {reviewStatus && reviewStatus == ReviewStatus.Pending &&
          <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/articles/${article.id}/review`}>
            Recenzuj&nbsp;
            <FontAwesomeIcon icon={faStar}/>
          </Button>
        }
        {article.isAuthor && (article.status == Status.Sent || article.status == Status.Pending) &&
          <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/articles/${article.id}/edit`}>
            Edytuj&nbsp;
            <FontAwesomeIcon icon={faEdit}/>  
          </Button>
        }
        {(article.isAuthor || isStaff) &&
          <DeleteArticleBtn articleId={article.id}/>
        }
    </div>
  )
}

export default ArticleActions