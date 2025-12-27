import apiClient from "@/app/utils/api-client";
import { Magazine, User } from "@/app/types/types";

export async function getMagazineData(id: number): Promise<Magazine> {
    try {
        console.log(`Fetching ${id} magazine data`);
        const response = await apiClient.get(`/magazine/${id}/`);
        console.log("Fetched magazine data:", response.data);
        const transformedMagazine = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            dueDate: response.data.due_date,
            joinCode: response.data.join_code
        }
        console.log("Transformed data:", transformedMagazine);
        return transformedMagazine;
    } catch (error) {
        console.error("Error fetching magazine data:", error);
        throw new Error("Failed to fetch magazine data");
    }
}

export async function getMagazines(): Promise<Magazine[]> {
    try {
        const response = await apiClient.get(`/user/magazines/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching magazine data:", error);
        throw new Error("Failed to fetch magazine data");
    }
}

export async function createMagazine(magazine: { name: string; description?: string }): Promise<Magazine> {
    try {
        const data = {
            name: magazine.name,
            description: magazine.description || null,
        };

        const response = await apiClient.post('/magazines/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating partial magazine:", error);
        throw error;
    }
}

export async function updateMagazine(magazine: Partial<Magazine> & { id: number }): Promise<Magazine> {
    try {
        const data: Record<string, any> = {};

        if (magazine.name !== undefined) data.name = magazine.name;
        if (magazine.description !== undefined) data.description = magazine.description;
        if (magazine.joinCode !== undefined) data.join_code = magazine.joinCode;
        if (magazine.dueDate !== undefined) {
            data.due_date = magazine.dueDate ? new Date(magazine.dueDate).toISOString() : null;
        }

        const response = await apiClient.patch(`/magazines/${magazine.id}/`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating magazine:", error);
        throw error;
    }
}

export async function deleteMagazine(magazine_id: number): Promise<void> {
    try {
        await apiClient.delete(`/magazines/${magazine_id}/`);
    }
    catch (error) {
        console.error("Error deleting magazine:", error);
        throw error;
    }
}

export async function generateNewJoinCode(magazine_id: number): Promise<string> {
    try {
        const response = await apiClient.get(`/magazine/${magazine_id}/generate-join-code/`);
        return response.data.join_code;
    }
    catch (error) {
        console.error("Error generating new join code:", error);
        throw error;
    }
}

export async function getMagazineMembers(magazine_id: number): Promise<User[]> {
    try {
        const response = await apiClient.get(`/magazine/${magazine_id}/members/`);
        console.log("Fetched magazine members:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching magazine members:", error);
        throw error;
    }
}

export async function deleteMagazineMember(magazine_id: number, user_id: number): Promise<void> {
    try {
        await apiClient.delete(`/magazine/${magazine_id}/members/${user_id}/`);
        console.log("Deleted magazine member");
    } catch (error) {
        console.error("Error deleting magazine member:", error);
        throw error;
    }
}

export async function joinMagazine(join_code: string): Promise<Magazine> {
    try {
        const response = await apiClient.post(`/magazine/join/`, { join_code });
        return response.data;
    } catch (error) {
        console.error("Error joining magazine:", error);
        throw error;
    }
}

export async function distributeReviews(magazine_id: number): Promise<{ message: string }> {
    try {
        const response = await apiClient.post(`/magazine/${magazine_id}/distribute-reviews/`);
        return response.data;
    } catch (error) {
        console.error("Error distributing reviews:", error);
        throw error;
    }
}