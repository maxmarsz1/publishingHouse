import React, { useContext } from "react";

import { Paper } from "@/app/types/types";
import { getPaperTypeDisplayText, getPaperCategoryDisplayText } from "@/app/utils/paper-display-helper";
import styles from "./PaperData.module.css";
import { getPaperStatusDisplayText, getPaperStatusIcon } from "@/app/utils/status-helper";
import Link from "next/link";
import { UserContext } from "@/app/context/UserContext";
interface Props {
  paper: Paper;
}

const PaperData = ({ paper }: Props) => {
  const { isStaff } = useContext(UserContext);
  const createdAt = new Date(paper.createdAt);
  const createdAtString = createdAt.toLocaleDateString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const keywords = paper.keywords.split(",").map((keyword) => keyword.trim());
  const status = getPaperStatusDisplayText(paper.status);
  const statusIcon = getPaperStatusIcon(paper.status);

  return (
    <>
      <div className={styles.topContainer}>
        <h1 className={styles.title}>{paper.title}</h1>
        {(isStaff || paper.isAuthor) && (
          <div className={styles.status}>
            {statusIcon} {status}
          </div>
        )}
      </div>
      <div className={styles.dateAuthorMagazine}>
        <span>{createdAtString}</span>
        {isStaff && (<><span>-</span><span>{paper.author.first_name} {paper.author.last_name}</span></>)}
        <span>-</span>
        <span><Link href={`/myspace/magazines/${paper.magazine.id}`}>{paper.magazine.name}</Link></span>
      </div>
      <div className={styles.infoLine}>
        <strong>Abstrakt: </strong>
        {paper.abstract}
      </div>
      {(isStaff || paper.isAuthor) &&
        <div className={styles.infoLine}>
          <strong>Komentarz: </strong>
          {paper.comment && paper.comment.trim() != "" ?
            paper.comment :
            "Brak"
          }
        </div>
      }
      <div className={styles.infoLine}>
        <strong>Typ artykułu: </strong>
        {getPaperTypeDisplayText(paper.paperType)}
      </div>
      <div className={styles.infoLine}>
        <strong>Kategoria artykułu: </strong>
        {getPaperCategoryDisplayText(paper.paperCategory)}
      </div>

      {paper.keywords &&
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

export default PaperData;
