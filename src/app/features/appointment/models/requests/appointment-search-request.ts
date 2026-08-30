export interface AppointmentSearchDtoRequest {
    pageNumber: number;
    pageSize: number;
    sortField?: string | null;
    sortOrder?: number | null;
    fullNameOrPhoneNumberSearch?: string | null;
    statusSearch?: number | null;
    doctorIdSearch?: number | null;
    dateSearch?: string | null;
}
