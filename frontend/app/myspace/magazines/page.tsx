'use client'

import React, { useEffect, useState } from 'react'
import MagazineContainer from "../../components/magazines/MagazineContainer"
import { getMagazines } from '@/app/utils/magazine-helper'
import { Magazine } from '@/app/types/types';


export default function Magazines() {
  const [magazines, setMagazines] = useState<Magazine[] | null>(null);

  useEffect(() => {
    getMagazines().then(setMagazines).catch(console.error);
  }, []);

  if (!magazines) return <p>Ładowanie...</p>;

  return <MagazineContainer magazines={magazines} />;
}