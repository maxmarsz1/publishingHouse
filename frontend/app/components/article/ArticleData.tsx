import React from "react";
import { Button } from "@mui/material";

import {
  Article,
  ArticleTypeDisplay,
  ITArticleCategoryDisplay,
  Status,
} from "@/app/types/types";
import styles from "./ArticleData.module.css";
import Link from "next/link";
import { getStatusDisplayText } from "@/app/utils/status-helper";
import Articles from "@/app/myspace/articles/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEdit,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DeleteArticleBtn from "./DeleteArticleBtn";
import ArticleActions from "./ArticleActions";

interface Props {
  article: Article;
  isStaff: boolean;
}

const ArticleData = ({ article, isStaff }: Props) => {
  const toReview = article.toReview ? article.toReview : false;
  const isAuthor = article.isAuthor ? article.isAuthor : false;
  const createdAt = new Date(article.createdAt);
  const createdAtString = createdAt.toLocaleDateString("pl-PL", {
    hour: "numeric",
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
        <strong>Wydawnictwo: </strong>
        {article.publisher.name}
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

      <ArticleActions article={article} isStaff={isStaff} />
    </>
  );
};

export default ArticleData;
