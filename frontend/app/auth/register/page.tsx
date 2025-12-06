import React from 'react'

import AuthContainer from '@/app/components/auth/AuthContainer'
import RegisterPanel from '@/app/components/auth/RegisterPanel'

const RegisterPage = () => {
  return (
    <AuthContainer>
      <RegisterPanel />
    </AuthContainer>
  )
}

export default RegisterPage