import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopDoctorDto } from '@/app/features/appointment/models/responses/get-admin-dashboard-statistics-response';

@Component({
    standalone: true,
    selector: 'app-admin-top-doctors-widget',
    imports: [CommonModule],
    template: ` <div class="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-100 dark:border-surface-800 h-full">
        <div class="font-bold text-lg mb-8 text-center text-surface-900 dark:text-surface-0">أعلى الأطباء من حيث المواعيد</div>
        <ul class="list-none p-0 m-0 flex flex-col gap-6 mt-4">
            @for (doctor of doctors(); track doctor.doctorName) {
                <li class="flex items-center justify-between">
                    <!-- اسم وصورة الطبيب (يمين) -->
                    <div class="flex items-center gap-3 w-4/12 justify-end">
                        <span class="font-semibold text-sm whitespace-nowrap text-surface-900 dark:text-surface-0 text-right">د. {{ doctor.doctorName.split(' ').slice(0, 2).join(' ') }}</span>
                        <img [src]="doctor.imageUrl || 'assets/default-avatar.png'" [alt]="doctor.doctorName" class="w-10 h-10 rounded-full shadow-sm object-cover" />
                    </div>

                    <!-- Progress Bar (وسط) -->
                    <div class="w-6/12 px-4 flex justify-center" dir="rtl">
                        <div class="bg-surface-200 dark:bg-surface-700 rounded-full h-2 w-full overflow-hidden">
                            <div class="bg-[#00a67e] h-full rounded-full" [style.width.%]="getPercentage(doctor.appointmentCount)"></div>
                        </div>
                    </div>

                    <!-- الرقم (يسار) -->
                    <div class="w-2/12 text-left font-bold text-lg text-surface-900 dark:text-surface-0">
                        {{ doctor.appointmentCount }}
                    </div>
                </li>
            }
            @if (doctors().length === 0) {
                <div class="text-center text-muted-color py-6">لا يوجد بيانات</div>
            }
        </ul>
    </div>`
})
export class AdminTopDoctorsWidget {
    doctors = input<TopDoctorDto[]>([]);

    getMaxCount(): number {
        const docs = this.doctors();
        if (!docs || docs.length === 0) return 0;
        return Math.max(...docs.map((d) => d.appointmentCount));
    }

    getPercentage(count: number): number {
        const max = this.getMaxCount();
        if (max === 0) return 0;
        return Math.round((count / max) * 100);
    }
}
