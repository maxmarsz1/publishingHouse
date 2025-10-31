import React from 'react'
import { redirect } from 'next/navigation'
import { getAccessToken } from '@/app/utils/auth-server-helper'

import AuthContainer from '@/app/components/auth/AuthContainer'
import LeftPanel from '@/app/components/auth/LeftPanel'
import AuthPanel from '@/app/components/auth/AuthPanel'

const LoginPage = async () => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    redirect('/myspace'); 
  }

  return (
    <AuthContainer>
      <LeftPanel/>
      <AuthPanel mode='login'/>
    </AuthContainer>
  )
}

export default LoginPage