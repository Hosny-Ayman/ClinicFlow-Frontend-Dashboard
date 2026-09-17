export interface CurrentUser {
    id: number;
    firstName?: string;
    lastName?: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    clinicId: number;
    roles: string[];
    permissions: number;
}
