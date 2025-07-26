import React from 'react'
import { Raport } from '../../types/types'
import styles from './RaportsTable.module.css'
import { getStatusDisplayText } from '../../utils/status-helper'


const RaportsTable = ({ title, raports }: { title: string, raports: Raport[] }) => {
  return (
    <div className={styles.tableWrapper}>
        <h2>{title}</h2>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tytul</th>
                    <th>Status</th>
                    <th>Ocena</th>
                </tr>
            </thead>
            <tbody>
                {raports.map((raport, index) => (
                    <tr key={index}>
                        <td className={styles.id}>{raport.id}</td>
                        <td className={styles.title}>{raport.title}</td>
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