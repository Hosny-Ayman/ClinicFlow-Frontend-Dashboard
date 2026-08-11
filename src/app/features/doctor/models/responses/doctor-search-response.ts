export interface DoctorSearchRequest {
    pageNumber: number;
    pageSize: number;

    sortField?: string | null;
    sortOrder?: number | null;

    fullNameSearch?: string | null;
    emailSearch?: string | null;
    phoneNumberSearch?: string | null;

    gender?: number | null;
    specialtyId?: number | null;
}
