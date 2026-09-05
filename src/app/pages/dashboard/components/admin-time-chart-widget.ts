import { Component, effect, inject, signal, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AppointmentTimeBreakdownDto } from '@/app/features/appointment/models/responses/get-admin-dashboard-statistics-response';

@Component({
    standalone: true,
    selector: 'app-admin-time-chart-widget',
    imports: [ChartModule],
    template: ` <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 h-full flex flex-col">
        <div class="font-bold text-lg mb-8 text-center text-surface-900 dark:text-surface-0">المواعيد حسب الفترة الزمنية</div>
        <div class="flex-grow min-h-[250px]">
            <p-chart type="line" [data]="chartData()" [options]="chartOptions()" class="h-full block w-full" />
        </div>
    </div>`
})
export class AdminTimeChartWidget {
    layoutService = inject(LayoutService);
    timeData = input<AppointmentTimeBreakdownDto[]>([]);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    constructor() {
        effect(() => {
            const data = this.timeData();
            if (data) {
                setTimeout(() => {
                    this.initChart(data);
                }, 150);
            }
        });
    }

    initChart(data: AppointmentTimeBreakdownDto[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const labels = data.map((d) => d.timePeriod);
        const counts = data.map((d) => d.count);

        this.chartData.set({
            labels: labels,
            datasets: [
                {
                    label: 'المواعيد',
                    data: counts,
                    fill: false,
                    borderColor: '#00a67e',
                    borderWidth: 2,
                    tension: 0,
                    pointBackgroundColor: '#00a67e',
                    pointBorderColor: '#00a67e',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: '#111827',
                    font: { weight: 'bold' },
                    offset: 4
                }
            },
            scales: {
                x: {
                    ticks: { color: textMutedColor, font: { size: 11 } },
                    grid: { display: false }
                },
                y: {
                    ticks: {
                        color: textMutedColor,
                        stepSize: 10,
                        font: { size: 11 }
                    },
                    grid: {
                        color: documentStyle.getPropertyValue('--surface-border'),
                        drawBorder: false,
                        borderDash: [5, 5]
                    },
                    beginAtZero: true
                }
            }
        });
    }
}
