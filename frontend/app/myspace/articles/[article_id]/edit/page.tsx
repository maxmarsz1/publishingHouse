import React from "react";

import { getPublisherData } from "@/app/utils/publisher-helper";
import ArticleForm from "@/app/components/article/ArticleForm";
import ArticleFormatting from "@/app/components/article/ArticleFormating";
import { getArticleData } from "@/app/utils/article-helper";

interface Props {
  params: { article_id: string };
}


const page = async ({ params }: Props) => {
  const { article_id } = await params;
  
  const idAsNumber = +article_id; 
  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid article_id provided: ${article_id}`);
  }
  const article = await getArticleData(idAsNumber);

  if (!article) {
    return <div>Artykuł nie zostało znaleziony.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{marginBottom: "16px", fontWeight: 400}}>{article.title} - Edytuj raport</h1>
        <ArticleFormatting />
      </div>
      <ArticleForm article={article} publisherId={article.publisher.id}/>
    </div>
  );
};

export default page;
