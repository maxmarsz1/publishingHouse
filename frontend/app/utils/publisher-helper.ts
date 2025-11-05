import apiServer  from "@/app/utils/api-server";
import { Publisher } from "@/app/types/types"; 

export async function getPublisherData(id: number): Promise<Publisher>{
    try {
        console.log(`Fetching ${id} publisher data`);
        const response = await apiServer.get(`/publisher/${id}/`);
        console.log("Fetched publisher data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher data:", error);
        throw new Error("Failed to fetch publisher data");
    }
}

export async function getPublishers(): Promise<Publisher[]> {
    try {
        const response = await apiServer.get(`/user/publishers/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher data:", error);
        throw new Error("Failed to fetch publisher data");
    }
}