'use client'

import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Button, TextField, Rating, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

import styles from './ArticleReviewForm.module.css'
import apiClient from '@/app/utils/api-client';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconEmpty': {
        color: '#FFFCF2',
    }
});

interface ArticleReviewFormProps {
  articleId: number
}

const ArticleReviewForm: React.FC<ArticleReviewFormProps> = ({ articleId }) => {
    const [comment, setComment] = useState("");
    const [grade, setGrade] = useState<number | null>(2.5);
    const router = useRouter();

    async function handleSubmit(){
      if(grade){
        try {
          await apiClient.post(`/raport/${articleId}/create-review/`, {
            comment,
            grade
          });
          console.log("Review created successfully");
          router.push(`/myspace/articles/${articleId}`);
        } catch (error) {
          console.error("Error creating review:", error);
          throw new Error("Failed to create review");
        }
        
      } else {
        console.log("Brak oceny");
      }
    }



  return (
    <form className={styles.form}>
      <TextField
        id="comment"
        label="Komentarz"
        value={comment}
        multiline
        rows={5}
        required
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
        onClick={handleSubmit}
      >
        Wyślij
      </Button>
    </form>
  )
}

export default ArticleReviewForm