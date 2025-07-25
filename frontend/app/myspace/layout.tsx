import { Container } from '@mui/material';
import Navbar from '../components/Navbar';
import React from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div 
    // style={{ display: 'flex' }}
    >
      <Navbar />
      <main style={{marginTop: "32px"}}>
        <Container>
          {children}
        </Container>
      </main>
    </div>
  );
}