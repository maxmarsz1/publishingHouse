import { Article, Status } from '@/app/types/types';
import { faDownload, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react'
import DeleteArticleBtn from './DeleteArticleBtn';
import styles from './ArticleActions.module.css';

interface ArticleActionsProps {
    article: Article;
    isStaff: boolean;
}

const ArticleActions = ({article, isStaff}: ArticleActionsProps) => {
  return (
    <div className={styles.container}>
        {article.file && article.file != '' && typeof article.file === 'string' &&
          <Button className={styles.downloadBtn} variant='contained' component={Link} href={article.file}>
            Pobierz artykuł&nbsp;
            <FontAwesomeIcon icon={faDownload} />  
          </Button>
        }
        {article.toReview &&
          <Button className={styles.reviewBtn} variant='outlined' component={Link} href={`/myspace/articles/${article.id}/review`}>
            Recenzuj&nbsp;
            <FontAwesomeIcon icon={faStar}/>
          </Button>
        }
        {article.isAuthor && article.status == Status.Sent &&
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