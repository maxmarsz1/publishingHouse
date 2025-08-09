import React from 'react'

import AuthContainer from '@/app/components/auth/AuthContainer'
import LeftPanel from '@/app/components/auth/LeftPanel'
import RegisterPanel from '@/app/components/auth/RegisterPanel'

const RegisterPage = () => {
  return (
    <AuthContainer>
      <LeftPanel/>
      <RegisterPanel/>
    </AuthContainer>
  )
}

export default RegisterPage