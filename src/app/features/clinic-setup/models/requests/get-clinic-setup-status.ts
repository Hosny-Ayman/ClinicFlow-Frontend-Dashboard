export interface GetClinicSetupStatus {
    isSetupCompleted: boolean;
    hasSkippedSetup: boolean;
    progress: number;
    steps: SetupStepDtoRequest[];
}

export interface SetupStepDtoRequest {
    key: string;
    title: string;
    isCompleted: boolean;
}
