'use client'

import React, { useEffect, useState } from 'react'
import MagazineContainer from "../../components/magazines/MagazineContainer"
import { getPublishers } from '@/app/utils/publisher-helper'
import { Publisher } from '@/app/types/types';


export default function Publishers() {
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);

  useEffect(() => {
    getPublishers().then(setPublishers).catch(console.error);
  }, []);

  if (!publishers) return <p>Ładowanie...</p>;

  return <MagazineContainer publishers={publishers} />;
}