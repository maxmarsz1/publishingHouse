import { Container } from '@mui/material';
import Navbar from '../components/general/Navbar';
import React from 'react';
import Footer from '../components/general/Footer';
import { isUserStaff } from '../utils/auth-server-helper';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isStaff = await isUserStaff();
  return (
    <>
      <Navbar isStaff={isStaff}/>
      <main style={{marginTop: "32px"}}>
        <Container>
          {children}
        </Container>
      </main>
      <Footer/>
    </>
  );
}