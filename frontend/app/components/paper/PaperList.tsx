import React, { useContext } from 'react';
import { Paper } from '../../types/types';
import styles from './PaperList.module.css';
import { getPaperStatusDisplayText } from '../../utils/status-helper';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';
import { Chip } from '@mui/material';

interface PaperListProps {
    title: string;
    papers: Paper[];
    showMagazine?: boolean;
}

const PaperList = ({ title, papers = [], showMagazine = false }: PaperListProps) => {
    const { isStaff } = useContext(UserContext);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getFinalGrade = (paper: Paper) => {
        if (paper.reviews && paper.reviews.length > 0) {
            const adminReview = paper.reviews.find(r => r.custom_grade);
            if (adminReview) {
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
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '16px' }}>{title}</h2>

            {papers.length === 0 ? (
                <div className={styles.emptyState}>
                    Brak artykułów do wyświetlenia
                </div>
            ) : (
                <div className={styles.listGrid}>
                    {papers.map((paper) => (
                        <div key={paper.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <Link href={`/myspace/papers/${paper.id}`} className={styles.title}>
                                    {paper.title}
                                </Link>
                            </div>

                            <div className={styles.cardBody}>
                                {showMagazine && (
                                    <div className={styles.infoRow}>
                                        <strong>Czasopismo:</strong> {paper.magazine.name}
                                    </div>
                                )}
                                {isStaff && (
                                    <div className={styles.infoRow}>
                                        <strong>Autor:</strong> {paper.author.first_name} {paper.author.last_name}
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardFooter}>
                                <Chip
                                    label={getPaperStatusDisplayText(paper.status)}
                                    // color={getStatusColor(paper.status)}
                                    sx={{ color: 'white' }}
                                    size="small"
                                    variant="outlined"
                                />
                                {isStaff && (
                                    <span className={styles.grade}>
                                        Ocena: {getFinalGrade(paper)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaperList;
