'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PaperForm from "@/app/components/paper/PaperForm";
import PaperFormatting from "@/app/components/paper/PaperFormatting";
import { getPaperData } from "@/app/utils/paper-helper";
import { Paper } from "@/app/types/types";

const EditArticlePage = () => {
  const params = useParams();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paperId = params?.paperId;

  useEffect(() => {
    const fetchData = async () => {
      if (!paperId) return;

      const idAsNumber = Number(paperId);
      if (isNaN(idAsNumber) || !idAsNumber) {
        setError(`Invalid paper_id provided: ${paperId}`);
        setLoading(false);
        return;
      }

      try {
        const data = await getPaperData(idAsNumber);
        setPaper(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load paper data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paperId]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!paper) {
    return <div>Artykuł nie został znaleziony.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{ marginBottom: "16px", fontWeight: 400 }}>{paper.title} - Edytuj raport</h1>
        <PaperFormatting />
      </div>
      <PaperForm paper={paper} magazineId={paper.magazine.id} />
    </div>
  );
};

export default EditArticlePage;
