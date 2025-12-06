'use client'

import { TextField } from '@mui/material'
import React from 'react'

import styles from './InputLine.module.css'


interface Props {
  text: string,
  fieldId: string,
  value: string,
  setValue: (value: string) => void,
  isPassword?: boolean,
  column?: boolean,
  error?: boolean,
  helperText?: string
}

const InputLine = ({ text, fieldId, value, setValue, isPassword = false, column = false, error = false, helperText = "" }: Props) => {

  return (
    <div className={`${styles.line} ${column ? styles.column : ''}`}>
      <span>{text}:</span>
      <TextField
        className={styles.input}
        id={fieldId}
        value={value}
        {...(isPassword && { type: 'password' })}
        onChange={(e) => setValue(e.target.value)}
        error={error}
        helperText={helperText}
      />
    </div>
  )
}

export default InputLine