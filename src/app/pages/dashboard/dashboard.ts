import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicSetupCard } from '@/app/features/clinic-setup/components/clinic-setup-card/clinic-setup-card';
import { AdminStatsWidget } from './components/admin-stats-widget';
import { AdminTimeChartWidget } from './components/admin-time-chart-widget';
import { AdminStatusChartWidget } from './components/admin-status-chart-widget';
import { AdminTopDoctorsWidget } from './components/admin-top-doctors-widget';
import { AppointmentService } from '@/app/features/appointment/services/appointment.service';
import { GetAdminDashboardStatisticsDtoResponse } from '@/app/features/appointment/models/responses/get-admin-dashboard-statistics-response';
import { NotificationService } from '@/app/core/services/notification.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ClinicSetupCard, AdminStatsWidget, AdminTimeChartWidget, AdminStatusChartWidget, AdminTopDoctorsWidget],
    template: `
        <app-clinic-setup-card></app-clinic-setup-card>

        <div class="grid grid-cols-12 gap-6 xl:gap-8">
            @if (loading()) {
                <div class="col-span-12 flex justify-center items-center py-16">
                    <i class="pi pi-spin pi-spinner text-4xl text-[#00a67e]"></i>
                </div>
            } @else if (dashboardData()) {
                <div class="col-span-12">
                    <div class="flex items-center gap-3 mb-2">
                        <i class="pi pi-objects-column text-3xl text-surface-900 dark:text-surface-0"></i>
                        <div>
                            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1 m-0">لوحة التحكم</h2>
                            <p class="text-muted-color m-0">نظرة عامة على أداء العيادة اليوم</p>
                        </div>
                    </div>
                </div>

                <app-admin-stats-widget class="contents" [data]="dashboardData()!"> </app-admin-stats-widget>

                <div class="col-span-12 xl:col-span-5">
                    <app-admin-time-chart-widget [timeData]="dashboardData()!.appointmentsByTimePeriod"> </app-admin-time-chart-widget>
                </div>

                <div class="col-span-12 xl:col-span-4">
                    <app-admin-status-chart-widget [statusData]="dashboardData()!.appointmentsByStatus" [totalAppointments]="dashboardData()!.totalAppointments"> </app-admin-status-chart-widget>
                </div>

                <div class="col-span-12 xl:col-span-3">
                    <app-admin-top-doctors-widget [doctors]="dashboardData()!.topDoctors"> </app-admin-top-doctors-widget>
                </div>
            }
        </div>
    `
})
export class Dashboard implements OnInit {
    private readonly appointmentService = inject(AppointmentService);
    private readonly notificationService = inject(NotificationService);

    dashboardData = signal<GetAdminDashboardStatisticsDtoResponse | null>(null);
    loading = signal<boolean>(true);

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading.set(true);
        this.appointmentService.GetAdminDashboardStatistics().subscribe({
            next: (res) => {
                if (res.data) {
                    this.dashboardData.set(res.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                const errorMsg = err?.error?.errors?.[0] || 'حدث خطأ أثناء جلب بيانات لوحة التحكم';
                this.notificationService.error(errorMsg);
            }
        });
    }
}
