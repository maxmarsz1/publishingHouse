'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, Box, Typography } from "@mui/material";
import { Paper, PaperType, ITPaperCategory, AppSettings } from "@/app/types/types";
import apiClient from "@/app/utils/api-client";
import { getPaperTypeDisplayText, getPaperCategoryDisplayText } from "../../utils/paper-display-helper";
import { createPaper, updatePaper } from "@/app/utils/paper-helper";
import styles from "./PaperForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const paperCategoryOptions = Object.values(ITPaperCategory).map((type) => ({
  value: type,
  label: type,
}));

interface NewPaperProps {
  magazineId: number;
  paper?: Paper;
}

const NewPaper = ({ magazineId, paper }: NewPaperProps) => {
  const [title, setTitle] = useState(paper?.title || "");
  const [abstract, setAbstract] = useState(paper?.abstract || "");
  const [paperType, setPaperType] = useState<PaperType>(
    paper?.paperType || PaperType.OriginalResearch
  );
  const [paperCategory, setPaperCategory] = useState<ITPaperCategory>(
    paper?.paperCategory || ITPaperCategory.MachineLearning
  );
  const [comment, setComment] = useState(paper?.comment || "");
  const [keywords, setKeywords] = useState(paper?.keywords || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selfAuthored, setSelfAuthored] = useState(false);
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [limits, setLimits] = useState<AppSettings | null>(null);

  const router = useRouter();

  useEffect(() => {
    apiClient.get('/settings/')
      .then(res => setLimits(res.data))
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  useEffect(() => {
    if (paper) {
      setTitle(paper.title);
      setAbstract(paper.abstract);
      setPaperType(paper.paperType);
      setPaperCategory(paper.paperCategory);
      setComment(paper.comment || "");
      setKeywords(paper.keywords || "");
    }
  }, [paper]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      handleFileSelect(event.target.files[0]);
    }
  }

  function handleFileSelect(selectedFile: File) {
    if (selectedFile && selectedFile.type !== "application/pdf") {
      console.log("Proszę wybrać plik w formacie PDF.");
    }
    setUploadedFile(selectedFile);
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileSelect(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  async function handleSubmit() {
    const isNewPaper = !paper;
    const isQuestion1Valid = !isNewPaper || question1 !== "";
    const isQuestion2Valid = !isNewPaper || question2 !== "";
    const isSelfAuthoredValid = !isNewPaper || selfAuthored;
    const isFileValid = uploadedFile || paper?.file;

    const abstractWordCount = abstract.trim().split(/\s+/).filter(w => w.length > 0).length;
    const isAbstractValid = !limits || (abstractWordCount >= limits.abstract_min_words && abstractWordCount <= limits.abstract_max_words);

    if (!title || !abstract || !isFileValid || !isQuestion1Valid || !isQuestion2Valid || !isSelfAuthoredValid || !isAbstractValid) {
      console.log("Proszę uzupełnić wszystkie wymagane pola zgodnie z limitami.");
      return;
    }

    try {
      if (paper) {
        const updatedPaperData = {
          id: paper.id,
          title,
          abstract,
          paperType,
          paperCategory,
          comment,
          keywords,
          file: uploadedFile || paper.file,
        };
        const response = await updatePaper(updatedPaperData);
        console.log("Artykuł został pomyślnie zaktualizowany:", response);
      } else {
        const newPaperData = {
          title,
          abstract,
          paperType,
          paperCategory,
          comment,
          keywords,
          file: uploadedFile!,
          magazineId: magazineId,
        };
        const response = await createPaper(newPaperData);
        console.log("Artykuł został pomyślnie utworzony:", response);
      }

      router.push(`/myspace/papers`);
    } catch (error) {
      console.error("Błąd podczas zapisywania artykułu:", error);
    }
  }

  return (
    <div className={styles.formContainer}>
      <TextField
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Pełen tytuł"
        variant="outlined"
        fullWidth
        required
        className={styles.inputField}
      />

      <TextField
        id="abstract"
        label="Abstrakt"
        helperText={limits ? `Wymagana liczba słów: ${limits.abstract_min_words} - ${limits.abstract_max_words}. Obecnie: ${abstract.trim().split(/\s+/).filter(w => w.length > 0).length}` : "Ładowanie wymagań..."}
        multiline
        rows={5}
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        fullWidth
        required
        className={styles.inputField}
        slotProps={{ formHelperText: { sx: { color: 'white' } } }}
      />

      <TextField
        id="paperType"
        select
        label="Wybierz typ artykułu"
        value={paperType}
        onChange={(e) => setPaperType(e.target.value as PaperType)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {Object.values(PaperType).map((type) => (
          <MenuItem key={type} value={type}>
            {getPaperTypeDisplayText(type)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="paperCategory"
        select
        label="Wybierz kategorię artykułu"
        value={paperCategory}
        onChange={(e) => setPaperCategory(e.target.value as ITPaperCategory)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {paperCategoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {getPaperCategoryDisplayText(option.label)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="comment"
        label="Komentarz"
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        className={styles.inputField}
      />

      <TextField
        id="keywords"
        label="Słowa kluczowe"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        fullWidth
        className={styles.inputField}
      />

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={styles.fileUploadContainer}
      >
        <input
          accept=".pdf"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Box display="flex" flexDirection="column" alignItems="center">
            <FontAwesomeIcon icon={faUpload} size="2x" style={{ marginBottom: '1rem', color: '#666' }} />
            <Typography variant="body1" className={styles.uploadButton}>
              {uploadedFile ? uploadedFile.name : (paper?.file ? "Zmień plik (obecny: " + (typeof paper.file === 'string' ? (paper.file as string).split('/').pop() : 'plik') + ")" : "Przeciągnij plik tutaj lub kliknij aby wybrać")}
            </Typography>
          </Box>
        </label>
      </Box>

      {!paper &&
        <>
          <FormControl component="fieldset" style={{ marginBottom: '1rem', display: 'block' }}>
            <FormLabel component="legend" className={styles.checkboxLabel} required>Czy artykuł został wcześniej przesłany do jakiejkolwiek innej publikacji?</FormLabel>
            <RadioGroup row aria-label="question1" name="question1" value={question1} onChange={(e) => setQuestion1(e.target.value)}>
              <FormControlLabel className={styles.checkboxLabel} value="yes" control={<Radio />} label="Tak" />
              <FormControlLabel className={styles.checkboxLabel} value="no" control={<Radio />} label="Nie" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" style={{ marginBottom: '1rem', display: 'block' }}>
            <FormLabel component="legend" className={styles.checkboxLabel} required>Prosimy o potwierdzenie, że manuskrypt jest przesyłany wyłącznie do tego czasopisma i nie został opublikowany w prasie ani przesłany gdzie indziej.</FormLabel>
            <RadioGroup row aria-label="question2" name="question2" value={question2} onChange={(e) => setQuestion2(e.target.value)}>
              <FormControlLabel className={styles.checkboxLabel} value="yes" control={<Radio />} label="Tak" />
              <FormControlLabel className={styles.checkboxLabel} value="no" control={<Radio />} label="Nie" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" style={{ marginBottom: '1rem', display: 'block' }}>
            <FormControlLabel className={styles.checkboxLabel} required control={<Checkbox checked={selfAuthored} onChange={(e) => setSelfAuthored(e.target.checked)} />} label="Oświadczam, że przekładana praca została napisana przeze mnie samodzielnie." />
          </FormControl>
        </>
      }


      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={styles.submitButton}
        disabled={
          !title ||
          !abstract ||
          (!uploadedFile && !paper?.file) ||
          (!paper && (!selfAuthored || !question1 || !question2)) ||
          (!!limits && (abstract.trim().split(/\s+/).filter(w => w.length > 0).length < limits.abstract_min_words || abstract.trim().split(/\s+/).filter(w => w.length > 0).length > limits.abstract_max_words))
        }
      >
        {paper ? "Zapisz zmiany" : "Utwórz artykuł"}
      </Button>
    </div>
  );
};

export default NewPaper;