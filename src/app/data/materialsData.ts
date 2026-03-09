export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'student' | 'teacher';
    plan: 'free' | 'premium';
}

export interface LoginResponse {
    message: string;
    user: User;
}

export interface Material {
    id: string;
    title: string;
    subject: 'physics' | 'chemistry' | 'biology';
    type: '3d-model' | 'infographic';
    description: string;
    thumbnail: string;
    tags: string[];
    grade: number;
    file_url?: string;
}

export interface ModelInput {
    title: string;
    description: string;
    subject: string;
    grade: number;
    tags: string[] | string;
    file_url: string;
    thumbnail: string | null;
}

export const materials: Material[] = [];

export const getSubjectName = (subject: Material['subject']): string => {
    const names: Record<Material['subject'], string> = {
        physics: 'Vật lý',
        chemistry: 'Hóa học',
        biology: 'Sinh học',
    };
    return names[subject];
};

export const getTypeName = (type: Material['type']): string => {
    const names: Record<Material['type'], string> = {
        '3d-model': 'Mô hình 3D',
        'infographic': 'Infographic',
    };
    return names[type];
};
