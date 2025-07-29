import React from "react";

import { getPublisherData } from "@/app/utils/publisher-helper";
import NewRaport from "@/app/components/raports/NewRaport";
import RaportFormating from "@/app/components/raports/RaportFormating";

interface Props {
  params: { publisherID: string };
}


const page = async ({ params }: Props) => {
  const { publisherID } = await params;
  const publisher = getPublisherData(+publisherID);

  if (!publisher) {
    return <div>Wydawnictwo nie zostało znalezione.</div>;
  }

  return (
    <div>
      <div>
        <h1 style={{marginBottom: "16px", fontWeight: 400}}>{publisher.name} - Nowy raport</h1>
        <RaportFormating />
      </div>
      <NewRaport publisher={publisher}/>
    </div>
  );
};

export default page;
