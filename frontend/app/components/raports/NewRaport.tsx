"use client";

import React from "react";
import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";

import { RaportType, ITRaportCategory, Publisher } from "@/app/types/types";
import styles from "./NewRaport.module.css";

const raportTypeOptions = Object.values(RaportType).map((type) => ({
  value: type,
  label: type,
}));

const articleCategoryOptions = Object.values(ITRaportCategory).map((type) => ({
  value: type,
  label: type,
}));

interface NewRaportProps {
  publisher: Publisher;
}

const NewRaport = ({ publisher }: NewRaportProps) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [raportType, setRaportType] = useState<RaportType>(
    RaportType.OriginalResearch
  );
  const [raportCategory, setRaportCategory] = useState<ITRaportCategory>(
    ITRaportCategory.MachineLearning
  );
  const [comment, setComment] = useState("");

  return (
    <div>
      <TextField
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Pełen tytuł"
        variant="outlined"
        fullWidth
        className={styles.inputField}
      />

      <TextField
        id="abstract"
        label="Abstract"
        multiline
        rows={5}
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        fullWidth
        className={styles.inputField}
      />

      <TextField
        id="abstract"
        select
        label="Wybierz typ artykułu"
        value={raportType}
        onChange={(e) => setRaportType(e.target.value as RaportType)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {raportTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="category"
        select
        label="Wybierz kategorie artykułu"
        value={raportCategory}
        onChange={(e) =>
          setRaportCategory(e.target.value as ITRaportCategory)
        }
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {articleCategoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

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

      <Button
        variant="contained"
        color="primary"
        className={styles.submitButton}
        onClick={() => {
          // Handle submission logic here
          console.log({
            title,
            abstract,
            raportType,
            raportCategory,
            comment,
          });
        }}
      >
        Wyślij
      </Button>
    </div>
  );
};

export default NewRaport;
