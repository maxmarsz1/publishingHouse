import { User } from "../types/types";
import apiClient from "./api-client";


export type PartialUserData = Omit<Partial<User>, 'id'>;

export async function updateAccountData(userData: PartialUserData): Promise<User> {
    try {
        const response = await apiClient.put('user/', userData);
        return response.data;
    } catch (error) {
        console.error("Error updating account data:", error);
        throw error;
    }
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try{
        await apiClient.post('user/change-password/', {
            current_password: currentPassword,
            new_password: newPassword
        });
    }
    catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}