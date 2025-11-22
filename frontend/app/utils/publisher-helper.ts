import apiClient  from "@/app/utils/api-client";
import { Publisher, User } from "@/app/types/types"; 

export async function getPublisherData(id: number): Promise<Publisher>{
    try {
        console.log(`Fetching ${id} publisher data`);
        const response = await apiClient.get(`/publisher/${id}/`);
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
        const response = await apiClient.get(`/user/publishers/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher data:", error);
        throw new Error("Failed to fetch publisher data");
    }
}

export async function createPublisher(publisher: { name: string; description?: string }): Promise<Publisher> {
    try {
        const data = {
            name: publisher.name,
            description: publisher.description || null,
        };

        const response = await apiClient.post('/publishers/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating partial publisher:", error);
        throw error;
    }
}

export async function updatePublisher(publisher: Partial<Publisher> & { id: number }): Promise<Publisher> {
    try {
        const data: Record<string, any> = {}; 

        if (publisher.name !== undefined) data.name = publisher.name;
        if (publisher.description !== undefined) data.description = publisher.description;
        if (publisher.joinCode !== undefined) data.join_code = publisher.joinCode;
        if (publisher.dueDate !== undefined) {
            data.due_date = publisher.dueDate ? new Date(publisher.dueDate).toISOString() : null;
        }

        const response = await apiClient.patch(`/publishers/${publisher.id}/`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating publisher:", error);
        throw error;
    }
}

export async function deletePublisher(publisher_id: number): Promise<void> {
    try {
        await apiClient.delete(`/publishers/${publisher_id}/`);
    }
    catch (error) {
        console.error("Error deleting publisher:", error);
        throw error;
    } 
}

export async function generateNewJoinCode(publisher_id: number): Promise<string> {
    try {
        const response = await apiClient.get(`/publisher/${publisher_id}/generate-join-code/`);
        return response.data.join_code;
    }
    catch (error) {
        console.error("Error generating new join code:", error);
        throw error;
    } 
}

export async function getPublisherMembers(publisher_id: number): Promise<User[]> {
    try {
        const response = await apiClient.get(`/publisher/${publisher_id}/members/`);
        console.log("Fetched publisher members:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher members:", error);
        throw error;
    }
}

export async function deletePublisherMember(publisher_id: number, user_id: number): Promise<void> {
    try {
        await apiClient.delete(`/publisher/${publisher_id}/members/${user_id}/`);
        console.log("Deleted publisher member");
    } catch (error) {
        console.error("Error deleting publisher member:", error);
        throw error;
    }
}

export async function joinPublisher(join_code: string): Promise<Publisher> {
    try {
        const response = await apiClient.post(`/publisher/join/`, { join_code });
        return response.data;
    } catch (error) {
        console.error("Error joining publisher:", error);
        throw error;
    }
}