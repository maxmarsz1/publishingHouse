import AccountForm from '@/app/components/account/AccountForm'
import { getAccountData } from '@/app/utils/account-helper'
import React from 'react'

const UsersPage = async () => {
    const userData = await getAccountData();
    return (
        <div>
            <h1>Twoje dane</h1>
            <AccountForm userData={userData}/>
        </div>
    )
}

export default UsersPage