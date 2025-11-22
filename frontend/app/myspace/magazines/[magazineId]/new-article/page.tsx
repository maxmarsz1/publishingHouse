'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublisherData } from "@/app/utils/publisher-helper";
import ArticleForm from "@/app/components/article/ArticleForm";
import ArticleFormatting from "@/app/components/article/ArticleFormating";
import { Publisher } from "@/app/types/types";

const NewArticlePage = () => {
  const params = useParams();
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const magazineId = params?.magazineId;

  useEffect(() => {
    const fetchData = async () => {
      if (!magazineId) return;

      const idAsNumber = Number(magazineId);
      if (isNaN(idAsNumber) || !idAsNumber) {
        setError(`Invalid publisherId provided: ${magazineId}`);
        setLoading(false);
        return;
      }

      try {
        const data = await getPublisherData(idAsNumber);
        setPublisher(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load publisher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [magazineId]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!publisher) {
    return <div>Wydawnictwo nie zostało znalezione.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{ marginBottom: "16px", fontWeight: 400 }}>{publisher.name} - Nowy raport</h1>
        <ArticleFormatting />
      </div>
      <ArticleForm publisherId={publisher.id} />
    </div>
  );
};

export default NewArticlePage;
