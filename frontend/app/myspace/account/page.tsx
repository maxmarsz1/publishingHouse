'use client';

import AccountForm from '@/app/components/account/AccountForm';
import { User } from '@/app/types/types';
import { getAccountData } from '@/app/utils/account-helper';
import React, { useEffect, useState } from 'react';

const UsersPage = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAccountData();
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch account data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Ładowanie...</div>; 
    }

    return (
        <div>
            <h1>Twoje dane</h1>
            {userData && <AccountForm userData={userData}/>}
        </div>
    );
};

export default UsersPage;