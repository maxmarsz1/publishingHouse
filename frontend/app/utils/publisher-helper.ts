import apiServer  from "@/app/utils/api-server";
import { Publisher } from "@/app/types/types"; 

export async function getPublisherData(id: number): Promise<Publisher>{
    try {
        console.log(`Fetching ${id} publisher data`);
        const response = await apiServer.get(`/publisher/${id}/`);
        console.log("Fetched publisher data:", response.data);
        const transformedPublisher = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            dueDate: response.data.due_date,
            joinCode: response.data.join_code
        }
        console.log("Transformed data:", transformedPublisher);
        return transformedPublisher;
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