import React from 'react'
import { Article } from '../../types/types'
import styles from './ArticleTable.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'
import Link from 'next/link'

interface ArticlesTableProps {
    title: string,
    articles: Article[],
    showPublisher?: boolean,
    admin?: boolean
}

const ArticleTable = ({ title, articles, showPublisher = false, admin = false }: ArticlesTableProps) => {
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
                            <td className={styles.user}>{article.author.firstName} {article.author.lastName} ({article.author.username})</td>
                        }
                        <td className={styles.status}>{getStatusDisplayText(article.status)}</td>
                        <td className={styles.grade}>{(article.grade == 0 ? "-" : article.grade)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default ArticleTable