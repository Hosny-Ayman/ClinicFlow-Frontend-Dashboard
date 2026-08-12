import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { CreateAndEditUserRequest } from '../../models/requests/create-and-edit-user-request';

@Component({
    selector: 'app-receptionist-details',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './receptionist-details.html',
    styleUrl: './receptionist-details.scss'
})
export class ReceptionistDetails implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);

    private readonly cdr = inject(ChangeDetectorRef);

    userId: number | null = null;
    receptionistData: CreateAndEditUserRequest | null = null;
    loading: boolean = true;
    error: boolean = false;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.userId = Number(idParam);
            this.loadDetails();
        } else {
            this.error = true;
            this.loading = false;
        }
    }

    loadDetails() {
        this.loading = true;
        this.cdr.detectChanges();

        this.userService.GetUser(this.userId!).subscribe({
            next: (res: any) => {
                this.receptionistData = res.data;
                this.loading = false;

                this.cdr.detectChanges();
            },
            error: () => {
                this.error = true;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    toggleStatus() {
        if (!this.receptionistData || !this.userId) return;

        this.userService.ToggleUserStatus(this.userId).subscribe({
            next: () => {
                const actionWord = this.receptionistData!.isActive ? 'إيقاف' : 'تفعيل';
                this.notificationService.success(`تم ${actionWord} حساب موظف الاستقبال بنجاح`);

                this.loadDetails();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء تغيير حالة الموظف');
            }
        });
    }

    editReceptionist() {
        this.router.navigate(['/receptionist', this.userId, 'edit']);
    }
}
