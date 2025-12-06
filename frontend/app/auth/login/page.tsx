import React from 'react'
import { redirect } from 'next/navigation'

import AuthContainer from '@/app/components/auth/AuthContainer'
import LeftPanel from '@/app/components/auth/LeftPanel'
import LoginPanel from '@/app/components/auth/LoginPanel'

const LoginPage = async () => {
  return (
    <AuthContainer>
      <LeftPanel />
      <LoginPanel />
    </AuthContainer>
  )
}

export default LoginPage