import { User } from "../types/types";
import apiServer from "./api-server";


export async function getAccountData(): Promise<User> {
    try{
        const response = await apiServer.get('user/');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching account data:", error);
        throw error;
    }
}
