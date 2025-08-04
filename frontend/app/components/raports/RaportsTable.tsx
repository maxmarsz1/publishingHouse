import React from 'react'
import { Raport } from '../../types/types'
import styles from './RaportsTable.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'

interface RaportsTableProps {
    title: string,
    raports: Raport[],
    showPublisher?: boolean,
    showID?: boolean
}

const RaportsTable = ({ title, raports, showPublisher = false, showID = false }: RaportsTableProps) => {
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
                {raports.map((raport, index) => (
                    <tr key={index}>
                        {showID &&
                            <td className={styles.id}>{raport.id}</td>
                        }
                        <td className={styles.title}>{raport.title}</td>
                        {showPublisher &&
                            <td className={styles.publisher}>{raport.publisher.name}</td>
                        }
                        <td className={styles.status}>{getStatusDisplayText(raport.status)}</td>
                        <td className={styles.grade}>{(raport.grade == 0 ? "-" : raport.grade)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default RaportsTable