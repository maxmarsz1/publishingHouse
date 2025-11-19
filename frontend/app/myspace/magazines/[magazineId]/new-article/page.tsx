import React from "react";

import { getPublisherData } from "@/app/utils/publisher-helper";
import ArticleForm from "@/app/components/article/ArticleForm";
import ArticleFormatting from "@/app/components/article/ArticleFormating";

interface Props {
  params: { magazineId: string };
}


const page = async ({ params }: Props) => {
  const { magazineId } = await params;
  
  const idAsNumber = +magazineId; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid publisherId provided: ${magazineId}`);
  }
  const publisher = await getPublisherData(idAsNumber);

  if (!publisher) {
    return <div>Wydawnictwo nie zostało znalezione.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{marginBottom: "16px", fontWeight: 400}}>{publisher.name} - Nowy raport</h1>
        <ArticleFormatting />
      </div>
      <ArticleForm publisherId={publisher.id}/>
    </div>
  );
};

export default page;
