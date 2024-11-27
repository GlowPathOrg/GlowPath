export interface UserI {
    _id?: string;
    email: string;
    password: string;
    role: 'traveller' | 'observer';
    // comparePassword: (candidatePassword: string) => Promise<boolean>;
}