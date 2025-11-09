import React from "react";

import { getPublisherData } from "@/app/utils/publisher-helper";
import NewArticleForm from "@/app/components/article/NewArticleForm";
import ArticleFormatting from "@/app/components/article/ArticleFormating";

interface Props {
  params: { publisherId: string };
}


const page = async ({ params }: Props) => {
  const { publisherId } = await params;
  
  const idAsNumber = +publisherId; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid publisherId provided: ${publisherId}`);
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
      <NewArticleForm publisher={publisher}/>
    </div>
  );
};

export default page;
