import React from 'react';
import { isUserStaff } from '@/app/utils/auth-server-helper';
import { getPublisherData } from '@/app/utils/publisher-helper';
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper'
import MagazineClientView from './MagazineClientView';
import axios from 'axios';

interface Props {
  params: { magazineId: string };
}

const PublisherView = async ({ params }: Props) => {
  const { magazineId } = await params;
  const idAsNumber = +magazineId;

  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid publisher_id provided: ${magazineId}`);
    return <p>Invalid publisher ID</p>;
  }

  const isStaff = await isUserStaff();
  const publisher = await getPublisherData(idAsNumber);
  const dueDate = publisher.dueDate ? new Date(publisher.dueDate) : null;
  const adminArticles = isStaff ? await getAdminPublisherArticles(idAsNumber) : null;
  const regularUserArticles = !isStaff ? await getUserPublisherArticles(idAsNumber) : null;
  return (
    // <></>
    <MagazineClientView
      publisher={publisher}
      dueDate={dueDate}
      isStaff={isStaff}
      adminArticles={adminArticles}
      regularUserArticles={regularUserArticles}
    />
  );
};

export default PublisherView;