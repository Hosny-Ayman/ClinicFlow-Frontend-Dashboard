export interface ApiResponse<T> {
    isSuccess: boolean;
    status: number;
    errors: string[] | null;
    data: T;
}
