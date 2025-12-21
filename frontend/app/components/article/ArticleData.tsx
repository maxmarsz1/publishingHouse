import React, { useContext } from "react";

import { Article } from "@/app/types/types";
import { getArticleTypeDisplayText, getArticleCategoryDisplayText } from "@/app/utils/article-display-helper";
import styles from "./ArticleData.module.css";
import { getStatusDisplayText, getStatusIcon } from "@/app/utils/status-helper";
import Link from "next/link";
import { UserContext } from "@/app/context/UserContext";
interface Props {
  article: Article;
}

const ArticleData = ({ article }: Props) => {
  const { isStaff } = useContext(UserContext);
  const createdAt = new Date(article.createdAt);
  const createdAtString = createdAt.toLocaleDateString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const keywords = article.keywords.split(",").map((keyword) => keyword.trim());
  const status = getStatusDisplayText(article.status);
  const statusIcon = getStatusIcon(article.status);

  return (
    <>
      <div className={styles.topContainer}>
        <h1 className={styles.title}>{article.title}</h1>
        {(isStaff || article.isAuthor) && (
          <div className={styles.status}>
            {statusIcon} {status}
          </div>
        )}
      </div>
      <div className={styles.dateAuthorMagazine}>
        <span>{createdAtString}</span>
        {isStaff && (<><span>-</span><span>{article.author.first_name} {article.author.last_name}</span></>)}
        <span>-</span>
        <span><Link href={`/myspace/magazines/${article.publisher.id}`}>{article.publisher.name}</Link></span>
      </div>
      <div className={styles.infoLine}>
        <strong>Abstrakt: </strong>
        {article.abstract}
      </div>
      {(isStaff || article.isAuthor) &&
        <div className={styles.infoLine}>
          <strong>Komentarz: </strong>
          {article.comment && article.comment.trim() != "" ?
            article.comment :
            "Brak"
          }
        </div>
      }
      <div className={styles.infoLine}>
        <strong>Typ artykułu: </strong>
        {getArticleTypeDisplayText(article.articleType)}
      </div>
      <div className={styles.infoLine}>
        <strong>Kategoria artykułu: </strong>
        {getArticleCategoryDisplayText(article.articleCategory)}
      </div>

      {article.keywords &&
        <div className={styles.keywords}>
          <div className={styles.keywordsList}>
            {keywords.map((keyword, index) => (
              <span key={index}>{keyword}</span>
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default ArticleData;
