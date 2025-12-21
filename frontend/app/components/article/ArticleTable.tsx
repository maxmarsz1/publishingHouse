import React, { useContext } from 'react'
import { Article } from '../../types/types'
import styles from './Table.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'
import Link from 'next/link'
import { UserContext } from '../../context/UserContext'

interface ArticlesTableProps {
    title: string,
    articles: Article[],
    showPublisher?: boolean,
}

const ArticleTable = ({ title, articles, showPublisher = false }: ArticlesTableProps) => {
    console.log(articles)
    const isStaff = useContext(UserContext).isStaff


    // Title: 2fr, Publisher: 1fr, User: 1fr, Status: 1fr, Grade: 0.5fr
    let gridTemplateColumns = "2fr 1fr"; // Default for basic user
    if (showPublisher) {
        gridTemplateColumns = "2fr 1fr 1fr"; // With publisher
    }

    if (isStaff) {
        gridTemplateColumns = "2fr 1fr 1fr 0.5fr"; // base admin
        if (showPublisher) {
            gridTemplateColumns = "2fr 1fr 1fr 1fr 0.5fr";
        }
    }


    return (
        <div className={styles.tableWrapper}>
            <h2>{title}</h2>
            <div className={styles.gridTable}>
                <div className={styles.gridHeader} style={{ gridTemplateColumns }}>
                    <div className={styles.gridCell}>Tytul</div>
                    {showPublisher &&
                        <div className={styles.gridCell}>Czasopismo</div>
                    }
                    {isStaff &&
                        <div className={styles.gridCell}>Użytkownik</div>
                    }
                    <div className={styles.gridCell}>Status</div>
                    {isStaff &&
                        <div className={styles.gridCell}>Ocena</div>
                    }
                </div>
                <div>
                    {articles.map((article, index) => (
                        <div className={styles.gridRow} style={{ gridTemplateColumns }} key={index}>
                            <div className={styles.gridCell}>
                                <Link href={`/myspace/articles/${article.id}`}>{article.title}</Link>
                            </div>
                            {showPublisher &&
                                <div className={styles.gridCell}>{article.publisher.name}</div>
                            }
                            {isStaff &&
                                <div className={styles.gridCell}>{article.author.first_name} {article.author.last_name} ({article.author.username})</div>
                            }
                            <div className={styles.gridCell}>{getStatusDisplayText(article.status)}</div>
                            {isStaff &&
                                <div className={styles.gridCell}>
                                    {(() => {
                                        if (article.reviews && article.reviews.length > 0) {
                                            const adminReview = article.reviews.find(r => r.custom_grade);
                                            if (adminReview) {
                                                console.log(adminReview.custom_grade)
                                                return adminReview.custom_grade!.toFixed(2);
                                            }

                                            const validReviews = article.reviews.filter(r => r.grade);
                                            if (validReviews.length > 0) {
                                                const sum = validReviews.reduce((acc, r) => acc + (r.grade || 0), 0);
                                                const avg = sum / validReviews.length;
                                                const roundedAvg = Math.round(avg * 2) / 2;
                                                return roundedAvg.toFixed(2);
                                            }
                                        }
                                        return article.grade ? article.grade.toFixed(2) : "-";
                                    })()}
                                </div>
                            }
                        </div>
                    ))}
                    {articles.length == 0 &&
                        <div className={styles.gridRow} style={{ gridTemplateColumns: '1fr' }}>
                            <div className={styles.gridCell}>Brak raportów</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticleTable