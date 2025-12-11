'use client'

import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Button, TextField, Rating, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

import styles from './ArticleReviewForm.module.css'
import apiClient from '@/app/utils/api-client';
import { ReviewDecision, ReviewDecisionDisplay, reviewCriteriaDisplay } from '@/app/types/types';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { updateUserContext } from '@/app/utils/user-context-helper';

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
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const [grade, setGrade] = useState<number | null>(2.5);
  const [customGrade, setCustomGrade] = useState<string>("");
  const [isStaff, setIsStaff] = useState(false);
  const [criteriaGrades, setCriteriaGrades] = useState<Record<string, number>>(
    Object.keys(reviewCriteriaDisplay).reduce((acc, key) => ({ ...acc, [key]: 2.5 }), {})
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  useEffect(() => {
    updateUserContext(setIsStaff);
  }, []);

  const handleCriteriaChange = (key: string, value: number | null) => {
    const newGrades = { ...criteriaGrades, [key]: value || 0 };
    setCriteriaGrades(newGrades);

    const values = Object.values(newGrades);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    setGrade(avg);
  };

  async function handleSubmit() {
    setErrors({});
    if (grade) {
      try {
        const payload: any = {
          comment,
          decision,
          ...criteriaGrades
        };

        if (isStaff && customGrade) {
          payload.custom_grade = parseFloat(customGrade);
        }

        await apiClient.post(`/raport/${articleId}/create-review/`, payload);
        console.log("Review created successfully");
        router.push(`/myspace/articles/${articleId}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error creating review:", error);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          setErrors({ non_field_errors: ["Wystąpił nieznany błąd."] });
        }
      }

    } else {
      console.log("Brak ocen lub decyzji");
    }
  }

  const isFormValid = comment.split(" ").length >= 100 && grade !== null && decision !== null;



  return (
    <form className={styles.form}>
      {errors.non_field_errors && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {errors.non_field_errors.join(', ')}
        </div>
      )}
      {errors.error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {errors.error}
        </div>
      )}

      <TextField
        id="comment"
        label="Komentarz (100-1000 słów)"
        value={comment}
        multiline
        rows={5}
        required
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        className={styles.inputField}
        error={!!errors.comment}
        helperText={errors.comment ? errors.comment.join(', ') : ""}
      />

      <div className={styles.criteria}>
        {Object.entries(reviewCriteriaDisplay).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography component="legend">{label as string}</Typography>
            <StyledRating
              name={key}
              value={criteriaGrades[key]}
              onChange={(_, newValue) => handleCriteriaChange(key, newValue)}
              precision={0.5}
            />
          </div>
        ))}
      </div>

      <div className={styles.finalGrade}>
        <Typography component="legend" style={{ fontWeight: 'bold' }}>Ocena końcowa</Typography>
        <StyledRating
          name="half-rating"
          value={grade}
          readOnly
          precision={0.1}
        />
        <Typography variant="h6" style={{ marginLeft: '10px' }}>{grade?.toFixed(2)}</Typography>
      </div>

      {isStaff && (
        <div style={{ marginTop: '1rem' }}>
          <TextField
            id="custom-grade"
            label="Ocena Redakcji (opcjonalne)"
            type="number"
            value={customGrade}
            onChange={(e) => setCustomGrade(e.target.value)}
            inputProps={{ step: "0.1", min: "0", max: "5" }}
            fullWidth
            className={styles.inputField}
          />
        </div>
      )}

      <div className={styles.actions}>
        <FormControl fullWidth className={styles.decisionSelect}>
          <InputLabel id="decision-label" sx={{ color: 'var(--text)', '&.Mui-focused': { color: 'var(--text)' } }}>Decyzja</InputLabel>
          <Select
            labelId="decision-label"
            id="decision"
            value={decision || ''}
            label="Decyzja"
            onChange={(e: SelectChangeEvent<ReviewDecision>) => setDecision(e.target.value as ReviewDecision)}
            sx={{
              color: 'var(--text)',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text)' },
              '.MuiSvgIcon-root': { color: 'var(--text)' }
            }}
          >
            {Object.values(ReviewDecision).map((value) => (
              <MenuItem key={value} value={value}>
                {ReviewDecisionDisplay[value]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Wyślij
        </Button>
      </div>


    </form>
  )
}

export default ArticleReviewForm