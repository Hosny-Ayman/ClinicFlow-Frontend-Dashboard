export interface DoctorVacationSearchRespons {
    pageNumber: number;
    pageSize: number;
    sortField?: string | null;
    sortOrder?: number | null;
    fullNameSearch?: string | null;
    emailSearch?: string | null;
    phoneNumberSearch?: string | null;
    gender?: number | null;
    specialtyId?: number | null;
    status?: number | null;
    from?: string | null;
    to?: string | null;
}
