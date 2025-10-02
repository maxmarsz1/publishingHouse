'use client'

import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Button, TextField, Rating, Typography } from "@mui/material";

import styles from './ArticleReviewForm.module.css'

const StyledRating = styled(Rating)({
    '& .MuiRating-iconEmpty': {
        color: '#FFFCF2',
    }
});

const ArticleReviewForm = () => {
    const [comment, setComment] = useState("");
    const [grade, setGrade] = useState<number | null>(2.5);

  return (
    <form className={styles.form}>
      <TextField
        id="comment"
        label="Komentarz"
        value={comment}
        multiline
        rows={5}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        className={styles.inputField}
      />
      <Typography component="legend">Ocena</Typography>
      <StyledRating
        name="half-rating"
        value={grade}
        onChange={(_, newValue) => setGrade(newValue)}
        precision={0.5} 
      />

      <Button
        variant="contained"
        color="primary"
        className={styles.submitBtn}
        onClick={() => {}}
      >
        Wyślij
      </Button>
    </form>
  )
}

export default ArticleReviewForm