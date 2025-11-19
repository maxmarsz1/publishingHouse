import React from "react";

import {
  Article,
  ArticleTypeDisplay,
  ITArticleCategoryDisplay,
} from "@/app/types/types";
import styles from "./ArticleData.module.css";
import { getStatusDisplayText } from "@/app/utils/status-helper";
import Link from "next/link";

interface Props {
  article: Article;
  isStaff: boolean;
}

const ArticleData = ({ article, isStaff }: Props) => {
  const createdAt = new Date(article.createdAt);
  const createdAtString = createdAt.toLocaleDateString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      <div className={styles.infoLine}>
        <strong>Tytuł: </strong>
        {article.title}
      </div>
      {isStaff && (
        <div className={styles.infoLine}>
          <strong>Autor: </strong>
          {article.author.first_name} {article.author.last_name} (
          {article.author.email})
        </div>
      )}
      <div className={styles.infoLine}>
        <strong>Czasopismo: </strong>
        <Link href={`/myspace/magazines/${article.publisher.id}`}>{article.publisher.name}</Link>
      </div>
      <div className={styles.infoLine}>
        <strong>Abstract: </strong>
        {article.abstract}
      </div>
      <div className={styles.infoLine}>
        <strong>Status: </strong>
        {getStatusDisplayText(article.status)}
      </div>
      <div className={styles.infoLine}>
        <strong>Keywords: </strong>
        {article.keywords && article.keywords.trim() != "" ?
          article.keywords:
          "Brak"
        }
      </div>
      <div className={styles.infoLine}>
        <strong>Utworzony: </strong>
        {createdAtString}
      </div>
      <div className={styles.infoLine}>
        <strong>Komentarz: </strong>
        {article.comment && article.comment.trim() != "" ?
        article.comment:
        "Brak"
        }
      </div>
      <div className={styles.infoLine}>
        <strong>Typ artykułu: </strong>
        {ArticleTypeDisplay[article.articleType]}
      </div>
      <div className={styles.infoLine}>
        <strong>Kategoria artykułu: </strong>
        {ITArticleCategoryDisplay[article.articleCategory]}
      </div>
    </>
  );
};

export default ArticleData;
