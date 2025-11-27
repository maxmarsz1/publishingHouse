import React from 'react'
import { Article } from '../../types/types'
import styles from './Table.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'
import Link from 'next/link'

interface ArticlesTableProps {
    title: string,
    articles: Article[],
    showPublisher?: boolean,
    admin?: boolean
}

const ArticleTable = ({ title, articles, showPublisher = false, admin = false }: ArticlesTableProps) => {
    console.log(articles)
  
    return (
    <div className={styles.tableWrapper}>
        <h2>{title}</h2>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Tytul</th>
                    {showPublisher &&
                        <th>Wydawnictwo</th>
                    }
                    {admin &&
                        <th>Użytkownik</th>
                    }
                    <th>Status</th>
                    <th>Ocena</th>
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
                        {admin &&
                            <td className={styles.user}>{article.author.first_name} {article.author.last_name} ({article.author.username})</td>
                        }
                        <td className={styles.status}>{getStatusDisplayText(article.status)}</td>
                        <td className={styles.grade}>{(article.grade == 0 ? "-" : article.grade)}</td>
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
                    {admin &&
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