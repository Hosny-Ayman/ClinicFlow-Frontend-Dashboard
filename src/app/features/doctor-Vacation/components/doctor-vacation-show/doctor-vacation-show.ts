import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { DoctorVacationService } from '../../services/doctor-vacation.service';
import { NotificationService } from '@/app/core/services/notification.service';

import { DoctorVacationSearchRespons } from '../../models/responses/doctor-vacation-search-response';
import { GetAllDoctorVacationInformationRequest } from '../../models/requests/get-all-doctor-vacation-information-request';
import { GetDoctorVacationDashboardInformationRequest } from '../../models/requests/get-doctor-vacation-dashboard-information-request';
import { SpecialityService } from '@/app/core/services/speciality.service';

@Component({
    selector: 'app-doctor-vacation-show',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, SelectModule, TableModule, PaginatorModule],
    templateUrl: './doctor-vacation-show.html',
    styleUrl: './doctor-vacation-show.scss'
})
export class DoctorVacationShow implements OnInit {
    private readonly vacationService = inject(DoctorVacationService);
    private readonly specialityService = inject(SpecialityService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    loading: boolean = false;

    dashboardData: GetDoctorVacationDashboardInformationRequest = {
        totalLeavesCount: 0,
        upcomingLeavesCount: 0,
        activeLeavesCount: 0,
        completedLeavesCount: 0
    };

    vacations: GetAllDoctorVacationInformationRequest[] = [];
    totalRecords: number = 0;

    searchDto: DoctorVacationSearchRespons = {
        pageNumber: 1,
        pageSize: 10,
        fullNameSearch: null,
        emailSearch: null,
        phoneNumberSearch: null,
        gender: null,
        specialtyId: null,
        status: null,
        from: null,
        to: null
    };

    genders = [
        { label: 'كل الجنس', value: null },
        { label: 'ذكر', value: 1 },
        { label: 'أنثى', value: 2 }
    ];

    specialties: any[] = [{ label: 'كل التخصصات', value: null }];

    statuses = [
        { label: 'كل الحالات', value: null },
        { label: 'قادم', value: 1 },
        { label: 'نشط', value: 2 },
        { label: 'منتهي', value: 3 },
        { label: 'ملغي', value: 4 }
    ];

    ngOnInit(): void {
        this.loadSpecialities();
        this.loadDashboardData();
        this.loadVacations();
    }

    loadSpecialities() {
        this.specialityService.GetAllSpecialities().subscribe({
            next: (res: any) => {
                if (res.data) {
                    const mappedSpecialties = res.data.map((s: any) => ({
                        label: s.name,
                        value: s.id
                    }));
                    this.specialties = [{ label: 'كل التخصصات', value: null }, ...mappedSpecialties];
                }
            },
            error: () => {
                this.notificationService.error('فشل في جلب قائمة التخصصات');
            }
        });
    }

    loadDashboardData() {
        this.vacationService.GetDoctorVacationDashboardInformation().subscribe({
            next: (res: any) => {
                if (res.data) {
                    this.dashboardData = res.data;
                }
            }
        });
    }

    loadVacations() {
        this.loading = true;
        this.cdr.detectChanges();
        this.vacationService.GetAllDoctorVacationInformation(this.searchDto).subscribe({
            next: (res: any) => {
                if (res.data) {
                    this.vacations = res.data.data;
                    this.totalRecords = res.data.totalRecords;
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء جلب البيانات');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    applyFilter() {
        this.searchDto.pageNumber = 1;
        this.loadVacations();
    }

    resetFilter() {
        this.searchDto = {
            pageNumber: 1,
            pageSize: 10,
            fullNameSearch: null,
            emailSearch: null,
            phoneNumberSearch: null,
            gender: null,
            specialtyId: null,
            status: null,
            from: null,
            to: null
        };
        this.loadVacations();
    }

    onPageChange(event: any) {
        this.searchDto.pageNumber = event.page + 1;
        this.searchDto.pageSize = event.rows;
        this.loadVacations();
    }

    editVacation(userId: number, vacationId: number) {
        this.router.navigate([`/doctorVacation/${userId}/${vacationId}/edit`]);
    }

    getGenderText(gender: string): string {
        if (!gender) return '';
        const g = gender.toLowerCase();
        if (g === 'male' || g === '1' || g === 'ذكر') return 'ذكر';
        if (g === 'female' || g === '2' || g === 'أنثى') return 'أنثى';
        return gender;
    }

    getStatusStyle(status: string): string {
        const s = status?.toLowerCase();
        if (s === 'inprogress' || s === '2') return 'bg-emerald-50 text-emerald-600';
        if (s === 'notstarted' || s === '1') return 'bg-amber-50 text-amber-600';
        if (s === 'completed' || s === '3') return 'bg-gray-100 text-gray-600';
        if (s === 'cancelled' || s === '4') return 'bg-red-50 text-red-600';
        return 'bg-blue-50 text-blue-600';
    }

    getStatusText(status: string): string {
        const s = status?.toLowerCase();
        if (s === 'inprogress' || s === '2') return 'نشط';
        if (s === 'notstarted' || s === '1') return 'قادم';
        if (s === 'completed' || s === '3') return 'منتهي';
        if (s === 'cancelled' || s === '4') return 'ملغي';
        return status || 'غير معروف';
    }
}
