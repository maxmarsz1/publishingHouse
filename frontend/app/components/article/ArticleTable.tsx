import React from 'react'
import { Article } from '../../types/types'
import styles from './ArticleTable.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'
import Link from 'next/link'

interface ArticlesTableProps {
    title: string,
    articles: Article[],
    showPublisher?: boolean,
    showID?: boolean
}

const ArticleTable = ({ title, articles, showPublisher = false, showID = false }: ArticlesTableProps) => {
  return (
    <div className={styles.tableWrapper}>
        <h2>{title}</h2>
        <table className={styles.table}>
            <thead>
                <tr>
                    {showID &&
                        <th>ID</th>
                    }
                    <th>Tytul</th>
                    {showPublisher &&
                        <th>Wydawnictwo</th>
                    }
                    <th>Status</th>
                    <th>Ocena</th>
                </tr>
            </thead>
            <tbody>
                {articles.map((article, index) => (
                    <tr key={index}>
                        {showID &&
                            <td className={styles.id}>{article.id}</td>
                        }
                        <td className={styles.title}>
                            <Link href={`/myspace/articles/${article.id}`}>{article.title}</Link>
                        </td>
                        {showPublisher &&
                            <td className={styles.publisher}>{article.publisher.name}</td>
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