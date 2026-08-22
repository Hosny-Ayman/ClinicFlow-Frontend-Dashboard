export enum Permission {
    None = 0,

    DoctorsView = 1 << 0,
    DoctorsViewAll = 1 << 1,
    DoctorsCreate = 1 << 2,
    DoctorsUpdate = 1 << 3,
    DoctorsDelete = 1 << 4,

    PatientsView = 1 << 5,
    PatientsViewAll = 1 << 6,
    PatientsCreate = 1 << 7,
    PatientsUpdate = 1 << 8,
    PatientsDelete = 1 << 9,

    ReceptionistsView = 1 << 10,
    ReceptionistsViewAll = 1 << 11,
    ReceptionistsCreate = 1 << 12,
    ReceptionistsUpdate = 1 << 13,
    ReceptionistsDelete = 1 << 14,

    ClinicsCreate = 1 << 15,
    ClinicsView = 1 << 16,
    ClinicsViewAll = 1 << 17,
    ClinicsUpdate = 1 << 18,
    ClinicsDelete = 1 << 19,
    ClinicsSettings = 1 << 20,

    DoctorSchedulesView = 1 << 21,
    DoctorSchedulesCreate = 1 << 22,
    DoctorSchedulesUpdate = 1 << 23,
    DoctorSchedulesDelete = 1 << 24,

    DoctorVacationsView = 1 << 25,
    DoctorVacationsViewAll = 1 << 26,
    DoctorVacationsCreate = 1 << 27,
    DoctorVacationsUpdate = 1 << 28,
    DoctorVacationsDelete = 1 << 29
}
