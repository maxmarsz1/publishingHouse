import { Container } from '@mui/material';
import Navbar from '../components/general/Navbar';
import React from 'react';
import Footer from '../components/general/Footer';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main style={{marginTop: "32px"}}>
        <Container>
          {children}
        </Container>
      </main>
      <Footer/>
    </>
  );
}