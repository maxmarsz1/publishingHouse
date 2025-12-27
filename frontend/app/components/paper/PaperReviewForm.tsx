'use client'

import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Button, TextField, Rating, Typography, Tooltip } from "@mui/material";
import { useRouter } from 'next/navigation';

import styles from './PaperReviewForm.module.css'
import apiClient from '@/app/utils/api-client';
import { ReviewDecision, ReviewDecisionDisplay, reviewCriteriaDisplay } from '@/app/types/types';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { updateUserContext } from '@/app/utils/user-context-helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { AppSettings } from '@/app/types/types';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconEmpty': {
    color: '#FFFCF2',
  }
});

interface PaperReviewFormProps {
  paperId: number
}

const PaperReviewForm: React.FC<PaperReviewFormProps> = ({ paperId }) => {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const [grade, setGrade] = useState<number | null>(2.5);
  const [customGrade, setCustomGrade] = useState<number | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [criteriaGrades, setCriteriaGrades] = useState<Record<string, number>>(
    Object.keys(reviewCriteriaDisplay).reduce((acc, key) => ({ ...acc, [key]: 2.5 }), {})
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [limits, setLimits] = useState<AppSettings | null>(null);
  const router = useRouter();

  useEffect(() => {
    updateUserContext(setIsStaff);
    apiClient.get('/settings/')
      .then(res => setLimits(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCriteriaChange = (key: string, value: number | null) => {
    const newGrades = { ...criteriaGrades, [key]: value || 0 };
    setCriteriaGrades(newGrades);

    const values = Object.values(newGrades);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const roundedAvg = Math.round(avg * 2) / 2;
    setGrade(roundedAvg);
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
          payload.custom_grade = customGrade;
        }

        await apiClient.post(`/paper/${paperId}/create-review/`, payload);
        console.log("Review created successfully");
        router.push(`/myspace/papers/${paperId}`);
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

  const currentWordCount = comment.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minWords = limits ? limits.review_min_words : 100; // fallback if limits not loaded
  const maxWords = limits ? limits.review_max_words : 1000;

  const isCommentValid = isStaff ? true : (currentWordCount >= minWords && currentWordCount <= maxWords);
  const isGradeValid = isStaff ? true : (grade !== null);

  const isFormValid = isCommentValid && isGradeValid && decision !== null;


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
        label={limits ? `Komentarz (${limits.review_min_words} - ${limits.review_max_words} słów)` : "Komentarz (ładowanie limitów...)"}
        helperText={errors.comment ? errors.comment.join(', ') : `Liczba słów: ${currentWordCount}`}
        value={comment}
        multiline
        rows={5}
        required={!isStaff}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        className={styles.inputField}
        error={!!errors.comment || (!isStaff && currentWordCount > 0 && (currentWordCount < minWords || currentWordCount > maxWords))}
        slotProps={{ formHelperText: { sx: { color: 'white' } } }}
      />

      {!isStaff &&
        <>
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
        </>
      }

      <div className={styles.actions}>
        {isStaff && (
          <div className={styles.customGrade}>
            <Typography component="legend">
              <span style={{ marginRight: '5px' }}>
                <Tooltip title="Jeśli ustawiona, zastąpi ocenę końcową liczoną ze średniej wszystkich recenzji">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tooltip>
              </span>
              Ocena Redakcji (opcjonalne)
            </Typography>
            <StyledRating
              name="custom-grade"
              value={customGrade}
              onChange={(_, newValue) => { setCustomGrade(newValue); console.log(customGrade) }}
              precision={0.5}
            />
            <Button onClick={() => setCustomGrade(null)}>Resetuj</Button>
          </div>
        )}

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

export default PaperReviewForm