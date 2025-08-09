import React from 'react'

import AuthContainer from '@/app/components/auth/AuthContainer'
import LeftPanel from '@/app/components/auth/LeftPanel'
import LoginPanel from '@/app/components/auth/LoginPanel'

const LoginPage = () => {
  return (
    <AuthContainer>
      <LeftPanel/>
      <LoginPanel/>
    </AuthContainer>
  )
}

export default LoginPage