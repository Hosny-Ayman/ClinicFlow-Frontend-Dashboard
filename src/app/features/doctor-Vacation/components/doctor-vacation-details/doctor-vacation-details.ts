import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DoctorVacationService } from '../../services/doctor-vacation.service';
import { NotificationService } from '@/app/core/services/notification.service';

@Component({
    selector: 'app-doctor-vacation-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './doctor-vacation-details.html',
    styleUrl: './doctor-vacation-details.scss'
})
export class DoctorVacationDetails implements OnInit {
    private router = inject(Router);
    private location = inject(Location);
    private vacationService = inject(DoctorVacationService);
    private notificationService = inject(NotificationService);

    vacation: any = null;

    ngOnInit() {
        const state = this.location.getState() as any;
        if (state && state.vacation) {
            this.vacation = state.vacation;
        } else {
            this.router.navigate(['/doctorVacation']);
        }
    }

    get vacationDuration(): string {
        if (!this.vacation) return '';
        const start = new Date(this.vacation.startDate);
        const end = new Date(this.vacation.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} أيام`;
    }

    goBack() {
        this.location.back();
    }

    editVacation() {
        this.router.navigate([`/doctorVacation/${this.vacation.userId}/${this.vacation.id}/edit`]);
    }

    cancelVacation() {
        if (confirm('هل أنت متأكد من إلغاء هذه الإجازة؟')) {
            const payload = {
                userId: this.vacation.userId,
                startDate: this.vacation.startDate,
                endDate: this.vacation.endDate,
                reason: this.vacation.reason,
                status: 4,
                id: this.vacation.id
            };

            this.vacationService.UpdateDoctorVacation(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم إلغاء الإجازة بنجاح');
                    this.vacation.status = 'Cancelled';
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء إلغاء الإجازة');
                }
            });
        }
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
