import { User, LoginResponse, ModelInput } from '../data/materialsData';

const IS_DEV = import.meta.env?.DEV;
// Vercel/Vite sẽ tìm biến VITE_API_URL trong cấu hình Environment Variables
export const BASE_URL = import.meta.env.VITE_API_URL || (IS_DEV ? `http://127.0.0.1:3005` : '');
const API_URL = `${BASE_URL}/api`;

export const api = {
    // User APIs
    getUsers: async (): Promise<User[]> => {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
        return data;
    },

    register: async (userData: Partial<User> & { password?: string }): Promise<{ id: number; message: string }> => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }
        return data;
    },

    login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }
        return data;
    },

    // Model APIs
    getModels: async (): Promise<any[]> => {
        const response = await fetch(`${API_URL}/models`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch models');
        return data;
    },

    getModel: async (id: string | number): Promise<any> => {
        const response = await fetch(`${API_URL}/models/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch model');
        return data;
    },

    saveModel: async (modelData: ModelInput): Promise<{ id: number; message: string }> => {
        const response = await fetch(`${API_URL}/models`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modelData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to save model');
        return data;
    },

    uploadModelFile: async (file: File): Promise<{ file_url: string; message: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to upload file');
        return data;
    },

    uploadThumbnail: async (file: File): Promise<{ thumbnail_url: string; message: string }> => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await fetch(`${API_URL}/upload-thumbnail`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to upload thumbnail');
        return data;
    },

    deleteModel: async (id: string | number): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/models/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete model');
        return data;
    },

    // AI Search API
    aiSearch: async (query: string): Promise<{
        results: any[];
        ai_insight: string;
        keywords: string[];
        predicted_subject: string | null;
    }> => {
        const response = await fetch(`${API_URL}/ai-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'AI search failed');
        return data;
    },

    // Forgot Password API
    forgotPassword: async (email: string): Promise<{ message: string; reset_code: string; user_name: string }> => {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to send reset code');
        return data;
    },

    // Reset Password API
    resetPassword: async (email: string, token: string, newPassword: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to reset password');
        return data;
    }
};
