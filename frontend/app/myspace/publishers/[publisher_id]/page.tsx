import React from 'react';
import { isUserStaff } from '@/app/utils/auth-server-helper';
import { getPublisherData } from '@/app/utils/publisher-helper';
import { getAdminPublisherArticles, getUserPublisherArticles } from '@/app/utils/article-helper'
import PublisherClientView from './PublisherClientView';
import { UserArticles } from '@/app/types/types';

interface Props {
  params: { publisher_id: string };
}

const PublisherView = async ({ params }: Props) => {
  const { publisher_id } = await params;
  const idAsNumber = +publisher_id;

  if (isNaN(idAsNumber) || !idAsNumber) {
    console.error(`Invalid publisher_id provided: ${publisher_id}`);
    return <p>Invalid publisher ID</p>;
  }

  const isStaff = await isUserStaff();
  const publisher = await getPublisherData(idAsNumber);
  const dueDate = publisher.dueDate ? new Date(publisher.dueDate) : null;
  const adminArticles = isStaff ? await getAdminPublisherArticles(idAsNumber) : null;
  const regularUserArticles = !isStaff ? await getUserPublisherArticles(idAsNumber) : null;

  return (
    <PublisherClientView
      publisher={publisher}
      dueDate={dueDate}
      isStaff={isStaff}
      adminArticles={adminArticles}
      regularUserArticles={regularUserArticles}
    />
  );
};

export default PublisherView;