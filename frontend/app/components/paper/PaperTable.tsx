import React, { useContext } from 'react'
import { Paper } from '../../types/types'
import styles from './Table.module.css'
import { getPaperStatusDisplayText } from '../../utils/status-helper'
import Link from 'next/link'
import { UserContext } from '../../context/UserContext'

interface PapersTableProps {
    title: string,
    papers: Paper[],
    showMagazine?: boolean,
}

const PaperTable = ({ title, papers = [], showMagazine = false }: PapersTableProps) => {
    console.log(papers)
    const isStaff = useContext(UserContext).isStaff


    // Title: 2fr, Publisher: 1fr, User: 1fr, Status: 1fr, Grade: 0.5fr
    let gridTemplateColumns = "2fr 1fr"; // Default for basic user
    if (showMagazine) {
        gridTemplateColumns = "2fr 1fr 1fr"; // With publisher
    }

    if (isStaff) {
        gridTemplateColumns = "2fr 1fr 1fr 0.5fr"; // base admin
        if (showMagazine) {
            gridTemplateColumns = "2fr 1fr 1fr 1fr 0.5fr";
        }
    }


    return (
        <div className={styles.tableWrapper}>
            <h2>{title}</h2>
            <div className={styles.gridTable}>
                <div className={styles.gridHeader} style={{ gridTemplateColumns }}>
                    <div className={styles.gridCell}>Tytul</div>
                    {showMagazine &&
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
                    {papers.map((paper, index) => (
                        <div className={styles.gridRow} style={{ gridTemplateColumns }} key={index}>
                            <div className={styles.gridCell}>
                                <Link href={`/myspace/papers/${paper.id}`}>{paper.title}</Link>
                            </div>
                            {showMagazine &&
                                <div className={styles.gridCell}>{paper.magazine.name}</div>
                            }
                            {isStaff &&
                                <div className={styles.gridCell}>{paper.author.first_name} {paper.author.last_name} ({paper.author.username})</div>
                            }
                            <div className={styles.gridCell}>{getPaperStatusDisplayText(paper.status)}</div>
                            {isStaff &&
                                <div className={styles.gridCell}>
                                    {(() => {
                                        if (paper.reviews && paper.reviews.length > 0) {
                                            const adminReview = paper.reviews.find(r => r.custom_grade);
                                            if (adminReview) {
                                                console.log(adminReview.custom_grade)
                                                return adminReview.custom_grade!.toFixed(2);
                                            }

                                            const validReviews = paper.reviews.filter(r => r.grade);
                                            if (validReviews.length > 0) {
                                                const sum = validReviews.reduce((acc, r) => acc + (r.grade || 0), 0);
                                                const avg = sum / validReviews.length;
                                                const roundedAvg = Math.round(avg * 2) / 2;
                                                return roundedAvg.toFixed(2);
                                            }
                                        }
                                        return paper.grade ? paper.grade.toFixed(2) : "-";
                                    })()}
                                </div>
                            }
                        </div>
                    ))}
                    {papers.length == 0 &&
                        <div className={styles.gridRow} style={{ gridTemplateColumns: '1fr' }}>
                            <div className={styles.gridCell}>Brak raportów</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default PaperTable