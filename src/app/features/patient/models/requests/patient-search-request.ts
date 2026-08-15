export interface PatientSearchRequest {
    pageNumber: number;
    pageSize: number;

    sortField?: string | null;
    sortOrder?: number | null;

    fullNameSearch?: string | null;
    emailSearch?: string | null;
    phoneNumberSearch?: string | null;
    nationalIdSearch?: string | null;

    gender?: number | null;
    bloodType?: string | null;
}
