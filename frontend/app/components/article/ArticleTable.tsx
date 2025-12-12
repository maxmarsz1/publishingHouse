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

    return (
        <div className={styles.tableWrapper}>
            <h2>{title}</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tytul</th>
                        {showPublisher &&
                            <th>Czasopismo</th>
                        }
                        {isStaff &&
                            <th>Użytkownik</th>
                        }
                        <th>Status</th>
                        {isStaff &&
                            <th>Ocena</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article, index) => (
                        <tr key={index}>
                            <td className={styles.title}>
                                <Link href={`/myspace/articles/${article.id}`}>{article.title}</Link>
                            </td>
                            {showPublisher &&
                                <td className={styles.publisher}>{article.publisher.name}</td>
                            }
                            {isStaff &&
                                <td className={styles.user}>{article.author.first_name} {article.author.last_name} ({article.author.username})</td>
                            }
                            <td className={styles.status}>{getStatusDisplayText(article.status)}</td>
                            {isStaff &&
                                <td className={styles.grade}>
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
                                                return avg.toFixed(2);
                                            }
                                        }
                                        return article.grade ? article.grade.toFixed(2) : "-";
                                    })()}
                                </td>
                            }
                        </tr>
                    ))}
                    {articles.length == 0 &&
                        <tr>
                            <td>Brak raportów</td>
                            <td></td>
                            <td></td>
                            {showPublisher &&
                                <td></td>
                            }
                            {isStaff &&
                                <td></td>
                            }
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ArticleTable