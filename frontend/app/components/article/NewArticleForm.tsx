"use client";

import React from "react";
import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

import { ArticleType, ArticleTypeDisplay, ITArticleCategory, ITArticleCategoryDisplay, Publisher } from "@/app/types/types";
import styles from "./NewArticleForm.module.css";
import { createArticle } from "@/app/utils/article-helper-client";

const raportTypeOptions = Object.values(ArticleType).map((type) => ({
  value: type,
  label: type,
}));

const articleCategoryOptions = Object.values(ITArticleCategory).map((type) => ({
  value: type,
  label: type,
}));

interface NewRaportProps {
  publisher: Publisher;
}

const NewArticle = ({ publisher }: NewRaportProps) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleType, setArticleType] = useState<ArticleType>(
    ArticleType.OriginalResearch
  );
  const [articleCategory, setArticleCategory] = useState<ITArticleCategory>(
    ITArticleCategory.MachineLearning
  );
  const [comment, setComment] = useState("");
  const [keywords, setKeywords] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const router = useRouter();

  function handleFileSelect(selectedFile: File) {
    if (selectedFile && selectedFile.type !== "application/pdf") {
      console.log("Proszę przesłać plik w formacie PDF.");
      setUploadedFile(null);
      return;
    }
    setUploadedFile(selectedFile);
  }

  async function handleSubmit(){
    if (!title || !abstract || !uploadedFile) {
      console.log("Proszę uzupełnić tytuł, abstrakt i przesłać plik.");
      return;
    }
    try {
      const articleData = {
        title,
        abstract,
        articleType,
        articleCategory,
        comment,
        keywords,
        file: uploadedFile,
        publisherId: publisher.id,
      }
      const response = await createArticle(articleData);
      console.log("Raport został pomyślnie utworzony:", response);
      router.push(`/myspace/articles/${response.id}`);
    }
    catch(error){
      console.error("Błąd podczas tworzenia raportu:", error);
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        component="label"
        className={styles.uploadButton}
      >
        {uploadedFile ? 
        (<p>Wybrany plik: {uploadedFile.name}</p>) : 
        (<p>Prześlij plik</p>)
        }
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
        value={articleType}
        onChange={(e) => setArticleType(e.target.value as ArticleType)}
        className={`${styles.halfWidth} ${styles.inputField}`}
      >
        {raportTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {ArticleTypeDisplay[option.label]}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="category"
        select
        label="Wybierz kategorie artykułu"
        value={articleCategory}
        onChange={(e) =>
          setArticleCategory(e.target.value as ITArticleCategory)
        }
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
        value={comment}
        multiline
        rows={5}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        className={styles.inputField}
      />
      <TextField
        id="keywords"
        label="Słowa kluczowe (oddzielone przecinkiem)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        fullWidth
        className={styles.inputField}
      />

      

      <Button
        variant="contained"
        color="primary"
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        Wyślij
      </Button>
    </div>
  );
};

export default NewArticle;
