import apiClient from "./api-client";
import { Publisher, User } from "../types/types";

export async function createPublisher(publisher: Publisher): Promise<Publisher> {
    try {
        const data = {
            name: publisher.name,
            description: publisher.description || null,
            join_code: publisher.joinCode || null,
            due_date: publisher.dueDate ? new Date(publisher.dueDate).toISOString() : null,
        };
        const response =  await apiClient.post('/publishers/', data);
        return response.data;
    }
    catch (error) {
        console.error("Error creating publisher:", error);
        throw error;
    } 
}

export async function updatePublisher(publisher: Publisher): Promise<Publisher> {
    try {
        const data = {
            name: publisher.name,
            description: publisher.description || null,
            join_code: publisher.joinCode || null,
            due_date: publisher.dueDate ? new Date(publisher.dueDate).toISOString() : null,
        };
        const response =  await apiClient.put(`/publishers/${publisher.id}/`, data);
        return response.data;
    }
    catch (error) {
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

export async function getPublisherMembers(publisherId: number): Promise<User[]> {
    try {
        const response = await apiClient.get(`/publisher/${publisherId}/members/`);
        console.log("Fetched publisher members:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching publisher members:", error);
        throw error;
    }
}