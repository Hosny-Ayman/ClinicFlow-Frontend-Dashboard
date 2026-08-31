export const Permission = {
    None: 0n,

    DoctorsView: 1n << 0n,
    DoctorsViewAll: 1n << 1n,
    DoctorsCreate: 1n << 2n,
    DoctorsUpdate: 1n << 3n,
    DoctorsDelete: 1n << 4n,

    PatientsView: 1n << 5n,
    PatientsViewAll: 1n << 6n,
    PatientsCreate: 1n << 7n,
    PatientsUpdate: 1n << 8n,
    PatientsDelete: 1n << 9n,

    ReceptionistsView: 1n << 10n,
    ReceptionistsViewAll: 1n << 11n,
    ReceptionistsCreate: 1n << 12n,
    ReceptionistsUpdate: 1n << 13n,
    ReceptionistsDelete: 1n << 14n,

    ClinicsCreate: 1n << 15n,
    ClinicsView: 1n << 16n,
    ClinicsViewAll: 1n << 17n,
    ClinicsUpdate: 1n << 18n,
    ClinicsDelete: 1n << 19n,
    ClinicsSettings: 1n << 20n,

    DoctorSchedulesView: 1n << 21n,
    DoctorSchedulesCreate: 1n << 22n,
    DoctorSchedulesUpdate: 1n << 23n,
    DoctorSchedulesDelete: 1n << 24n,

    DoctorVacationsView: 1n << 25n,
    DoctorVacationsViewAll: 1n << 26n,
    DoctorVacationsCreate: 1n << 27n,
    DoctorVacationsUpdate: 1n << 28n,
    DoctorVacationsDelete: 1n << 29n,

    AppointmentsCreate: 1n << 30n,
    AppointmentsView: 1n << 31n,
    AppointmentsViewAll: 1n << 32n,
    AppointmentsUpdate: 1n << 33n,

    MedicalRecordsView: 1n << 34n,
    MedicalRecordsViewAll: 1n << 35n,
    MedicalRecordsCreate: 1n << 36n,
    MedicalRecordsUpdate: 1n << 37n,

    PrescriptionsView: 1n << 38n,
    PrescriptionsViewAll: 1n << 39n,
    PrescriptionsCreate: 1n << 40n,
    PrescriptionsUpdate: 1n << 41n
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];
