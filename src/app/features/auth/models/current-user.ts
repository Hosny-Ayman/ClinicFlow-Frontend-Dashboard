export interface CurrentUser {
    id: number;
    fullName: string;
    email: string;
    clinicId: number;
    roles: string[];
}
