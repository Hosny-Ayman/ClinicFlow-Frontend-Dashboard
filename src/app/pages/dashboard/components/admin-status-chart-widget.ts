import { Component, effect, inject, signal, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppointmentStatusBreakdownDto } from '@/app/features/appointment/models/responses/get-admin-dashboard-statistics-response';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-admin-status-chart-widget',
    imports: [ChartModule, CommonModule],
    template: ` <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 h-full flex flex-col">
        <div class="font-bold text-lg mb-8 text-center text-surface-900 dark:text-surface-0">المواعيد حسب الحالة</div>

        <div class="flex items-center justify-between flex-grow mt-4 px-4">
            <!-- Legend (First in DOM = Right in RTL) -->
            <div class="flex flex-col gap-5 w-1/2">
                @for (item of mappedStatusData(); track item.status) {
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="w-3 h-3 rounded-full" [style.backgroundColor]="item.color"></span>
                            <span class="font-semibold text-sm text-surface-900 dark:text-surface-0">{{ item.label }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-sm text-surface-900 dark:text-surface-0">{{ item.count }}</span>
                            <span class="text-surface-500 text-xs w-10 text-left">({{ getPercentage(item.count) }}%)</span>
                        </div>
                    </div>
                }
            </div>

            <!-- Chart (Second in DOM = Left in RTL) -->
            <div class="relative w-1/2 flex justify-end">
                <div class="relative" style="width: 200px; height: 200px;">
                    <p-chart type="doughnut" [data]="chartData()" [options]="chartOptions()" height="200px" width="200px" />
                    <!-- Centered Total Overlay -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span class="text-4xl font-bold text-surface-900 dark:text-surface-0">{{ totalAppointments() }}</span>
                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 mt-1">إجمالي المواعيد</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AdminStatusChartWidget {
    layoutService = inject(LayoutService);
    statusData = input<AppointmentStatusBreakdownDto[]>([]);
    totalAppointments = input<number>(0);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);
    mappedStatusData = signal<any[]>([]);

    constructor() {
        effect(() => {
            const data = this.statusData();
            if (data) {
                setTimeout(() => {
                    this.initChart(data);
                }, 150);
            }
        });
    }

    getPercentage(count: number): number {
        const total = this.totalAppointments();
        if (total === 0) return 0;
        return Math.round((count / total) * 100);
    }

    getStatusConfig(status: string) {
        switch (status) {
            case 'Completed':
                return { label: 'حضر اليوم', color: '#00a67e', order: 1 };
            case 'CheckedIn':
                return { label: 'في الانتظار', color: '#f59e0b', order: 2 };
            case 'Cancelled':
                return { label: 'ملغي', color: '#ef4444', order: 3 };
            case 'NoShow':
                return { label: 'لم يحضر', color: '#cbd5e1', order: 4 };
            default:
                return { label: status, color: '#3b82f6', order: 5 };
        }
    }

    initChart(data: AppointmentStatusBreakdownDto[]) {
        const processed = data.map((d) => ({ ...d, ...this.getStatusConfig(d.status) })).sort((a, b) => a.order - b.order); // ترتيب الأسطورة زي الصورة

        this.mappedStatusData.set(processed);

        this.chartData.set({
            labels: processed.map((d) => d.label),
            datasets: [
                {
                    data: processed.map((d) => d.count),
                    backgroundColor: processed.map((d) => d.color),
                    hoverBackgroundColor: processed.map((d) => d.color),
                    borderWidth: 0
                }
            ]
        });

        this.chartOptions.set({
            cutout: '75%',
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        });
    }
}
