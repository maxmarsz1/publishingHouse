import React from 'react'

import AuthContainer from '@/app/components/auth/AuthContainer'
import LeftPanel from '@/app/components/auth/LeftPanel'
import AuthPanel from '@/app/components/auth/AuthPanel'

const LoginPage = () => {
  return (
    <AuthContainer>
      <LeftPanel/>
      <AuthPanel mode='login'/>
    </AuthContainer>
  )
}

export default LoginPage