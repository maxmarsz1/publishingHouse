'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox } from "@mui/material";
import { Article, ArticleType, ArticleTypeDisplay, ITArticleCategory, ITArticleCategoryDisplay } from "@/app/types/types";
import { createArticle, updateArticle } from "@/app/utils/article-helper";
import styles from "./ArticleForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const articleCategoryOptions = Object.values(ITArticleCategory).map((type) => ({
  value: type,
  label: type,
}));

interface NewRaportProps {
  publisherId: number;
  article?: Article;
}

const NewArticle = ({ publisherId, article }: NewRaportProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [abstract, setAbstract] = useState(article?.abstract || "");
  const [articleType, setArticleType] = useState<ArticleType>(
    article?.articleType || ArticleType.OriginalResearch
  );
  const [articleCategory, setArticleCategory] = useState<ITArticleCategory>(
    article?.articleCategory || ITArticleCategory.MachineLearning
  );
  const [comment, setComment] = useState(article?.comment || "");
  const [keywords, setKeywords] = useState(article?.keywords || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selfAuthored, setSelfAuthored] = useState(false);
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setAbstract(article.abstract);
      setArticleType(article.articleType);
      setArticleCategory(article.articleCategory);
      setComment(article.comment || "");
      setKeywords(article.keywords || "");
    }
  }, [article]);

  function handleFileSelect(selectedFile: File) {
    if (selectedFile && selectedFile.type !== "application/pdf") {
      console.log("Proszę przesłać plik w formacie PDF.");
      setUploadedFile(null);
      return;
    }
    setUploadedFile(selectedFile);
  }

  async function handleSubmit() {
    const isNewArticle = !article;
    const isQuestion1Valid = !isNewArticle || question1 !== "";
    const isQuestion2Valid = !isNewArticle || question2 !== "";
    const isSelfAuthoredValid = !isNewArticle || selfAuthored;
    const isFileValid = uploadedFile || article?.file;

    if (!title || !abstract || !isFileValid || !isQuestion1Valid || !isQuestion2Valid || !isSelfAuthoredValid) {
      console.log("Proszę uzupełnić wszystkie wymagane pola.");
      return;
    }

    try {
      if (article) {
        const updatedArticleData = {
          id: article.id,
          title,
          abstract,
          articleType,
          articleCategory,
          comment,
          keywords,
          file: uploadedFile || article.file,
        };
        const response = await updateArticle(updatedArticleData);
        console.log("Raport został pomyślnie zaktualizowany:", response);
      } else {
        const newArticleData = {
          title,
          abstract,
          articleType,
          articleCategory,
          comment,
          keywords,
          file: uploadedFile!,
          publisherId: publisherId,
        };
        const response = await createArticle(newArticleData);
        console.log("Raport został pomyślnie utworzony:", response);
      }

      router.push(`/myspace/articles`);
    } catch (error) {
      console.error("Błąd podczas zapisywania raportu:", error);
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
        multiline
        rows={5}
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        fullWidth
        required
        className={styles.inputField}
      />

      <TextField
        id="articleType"
        select
        label="Wybierz typ artykułu"
        value={articleType}
        onChange={(e) => setArticleType(e.target.value as ArticleType)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {Object.values(ArticleType).map((type) => (
          <MenuItem key={type} value={type}>
            {ArticleTypeDisplay[type]}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="articleCategory"
        select
        label="Wybierz kategorię artykułu"
        value={articleCategory}
        onChange={(e) => setArticleCategory(e.target.value as ITArticleCategory)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {articleCategoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {ITArticleCategoryDisplay[option.label]}
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

      <Button
        variant="outlined"
        component="label"
        className={styles.uploadButton}
      >
        <FontAwesomeIcon icon={faUpload} />&nbsp;
        Prześlij plik
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
      </Button>
      {uploadedFile && <p style={{ marginBottom: '2rem', fontSize: '12px' }}>Wybrano plik: {uploadedFile.name}</p>}

      {!article &&
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
          (!uploadedFile && !article?.file) ||
          (!article && (!selfAuthored || !question1 || !question2))
        }
      >
        {article ? "Zapisz zmiany" : "Utwórz raport"}
      </Button>
    </div>
  );
};

export default NewArticle;