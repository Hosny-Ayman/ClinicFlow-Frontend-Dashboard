import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminDashboardStatisticsDtoResponse } from '@/app/features/appointment/models/responses/get-admin-dashboard-statistics-response';

@Component({
    standalone: true,
    selector: 'app-admin-stats-widget',
    imports: [CommonModule],
    template: `
        <!-- إجمالي المواعيد -->
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col h-full relative">
                <div class="flex justify-between items-start mb-6">
                    <span class="font-bold text-surface-900 dark:text-surface-0 text-lg">إجمالي المواعيد</span>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-400/10 text-blue-500">
                        <i class="pi pi-calendar text-xl"></i>
                    </div>
                </div>
                <div class="text-center mb-6">
                    <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">{{ data().totalAppointments }}</span>
                </div>
                <div class="text-center flex flex-col gap-2 mt-auto">
                    <span class="text-muted-color text-sm font-medium">مواعيد اليوم</span>
                    <span [class]="data().totalAppointmentsDiff >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-bold flex items-center justify-center gap-1">
                        {{ abs(data().totalAppointmentsDiff) }} عن أمس
                        <i [class]="data().totalAppointmentsDiff >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                    </span>
                </div>
            </div>
        </div>

        <!-- حضر اليوم -->
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col h-full relative">
                <div class="flex justify-between items-start mb-6">
                    <span class="font-bold text-surface-900 dark:text-surface-0 text-lg">حضر اليوم</span>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-400/10 text-[#00a67e]">
                        <i class="pi pi-check text-xl"></i>
                    </div>
                </div>
                <div class="text-center mb-6">
                    <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">{{ data().attendedAppointments }}</span>
                </div>
                <div class="text-center flex flex-col gap-2 mt-auto">
                    <span class="text-muted-color text-sm font-medium">{{ getPercentage(data().attendedAppointments) }}% من إجمالي المواعيد</span>
                    <span [class]="data().attendedAppointmentsDiff >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-bold flex items-center justify-center gap-1">
                        {{ abs(data().attendedAppointmentsDiff) }} عن أمس
                        <i [class]="data().attendedAppointmentsDiff >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                    </span>
                </div>
            </div>
        </div>

        <!-- في الانتظار -->
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col h-full relative">
                <div class="flex justify-between items-start mb-6">
                    <span class="font-bold text-surface-900 dark:text-surface-0 text-lg">في الانتظار</span>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-orange-50 dark:bg-orange-400/10 text-orange-400">
                        <i class="pi pi-clock text-xl"></i>
                    </div>
                </div>
                <div class="text-center mb-6">
                    <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">{{ data().waitingAppointments }}</span>
                </div>
                <div class="text-center flex flex-col gap-2 mt-auto">
                    <span class="text-muted-color text-sm font-medium">{{ getPercentage(data().waitingAppointments) }}% من إجمالي المواعيد</span>
                    <span [class]="data().waitingAppointmentsDiff >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-bold flex items-center justify-center gap-1">
                        {{ abs(data().waitingAppointmentsDiff) }} عن أمس
                        <i [class]="data().waitingAppointmentsDiff >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                    </span>
                </div>
            </div>
        </div>

        <!-- ملغي -->
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col h-full relative">
                <div class="flex justify-between items-start mb-6">
                    <span class="font-bold text-surface-900 dark:text-surface-0 text-lg">ملغي</span>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-400/10 text-red-500">
                        <i class="pi pi-times text-xl"></i>
                    </div>
                </div>
                <div class="text-center mb-6">
                    <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">{{ data().cancelledAppointments }}</span>
                </div>
                <div class="text-center flex flex-col gap-2 mt-auto">
                    <span class="text-muted-color text-sm font-medium">{{ getPercentage(data().cancelledAppointments) }}% من إجمالي المواعيد</span>
                    <span [class]="data().cancelledAppointmentsDiff >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-bold flex items-center justify-center gap-1">
                        {{ abs(data().cancelledAppointmentsDiff) }} عن أمس
                        <i [class]="data().cancelledAppointmentsDiff >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                    </span>
                </div>
            </div>
        </div>
    `
})
export class AdminStatsWidget {
    data = input.required<GetAdminDashboardStatisticsDtoResponse>();

    getPercentage(count: number): number {
        const total = this.data().totalAppointments;
        if (total === 0) return 0;
        return Math.round((count / total) * 100);
    }

    abs(value: number): number {
        return Math.abs(value);
    }
}
