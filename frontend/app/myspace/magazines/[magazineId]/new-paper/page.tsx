'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMagazineData } from "@/app/utils/magazine-helper";
import PaperForm from "@/app/components/paper/PaperForm";
import PaperFormatting from "@/app/components/paper/PaperFormatting";
import { Magazine } from "@/app/types/types";

const NewPaperPage = () => {
  const params = useParams();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const magazineId = params?.magazineId;

  useEffect(() => {
    const fetchData = async () => {
      if (!magazineId) return;

      const idAsNumber = Number(magazineId);
      if (isNaN(idAsNumber) || !idAsNumber) {
        setError(`Invalid magazineId provided: ${magazineId}`);
        setLoading(false);
        return;
      }

      try {
        const data = await getMagazineData(idAsNumber);
        setMagazine(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load magazine data.");
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

  if (!magazine) {
    return <div>Czasopismo nie zostało znalezione.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{ marginBottom: "16px", fontWeight: 400 }}>{magazine.name} - Nowy artykuł</h1>
        <PaperFormatting />
      </div>
      <PaperForm magazineId={magazine.id} />
    </div>
  );
};

export default NewPaperPage;
