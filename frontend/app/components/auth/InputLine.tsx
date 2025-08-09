'use client'

import { InputLabel, TextField } from '@mui/material'
import React, { useState } from 'react'

import styles from './InputLine.module.css'


interface Props {
    text: string,
    fieldId: string,
    value: string,
    setValue: ( value: string ) => void,
    isPassword?: boolean
}

const InputLine = ({ text, fieldId, value, setValue, isPassword = false }: Props) => {

  return (
    <div className={styles.line}>
        <span>{text}:</span>
        <TextField
        className={styles.input} 
        id={fieldId}
        value={value}
        {...(isPassword && { type: 'password'})}
        onChange={(e) => setValue(e.target.value)}/>
    </div>
  )
}

export default InputLine