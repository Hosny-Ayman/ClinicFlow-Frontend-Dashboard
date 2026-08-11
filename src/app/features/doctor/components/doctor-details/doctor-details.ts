import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service'; // اتأكد من المسار
import { GetDoctorFullInformationRequest } from '../../models/responses/get-doctor-full-information-response';

@Component({
    selector: 'app-doctor-details',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './doctor-details.html',
    styleUrl: './doctor-details.scss'
})
export class DoctorDetails implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly doctorService = inject(DoctorService);
    private readonly cdr = inject(ChangeDetectorRef);

    doctorId: number | null = null;
    doctorData: GetDoctorFullInformationRequest | null = null;
    loading: boolean = true;
    error: boolean = false;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.doctorId = Number(idParam);
            this.loadDoctorDetails();
        } else {
            this.error = true;
            this.loading = false;
        }
    }

    loadDoctorDetails() {
        this.loading = true;
        this.cdr.detectChanges();
        this.doctorService.GetDoctor(this.doctorId!).subscribe({
            next: (res) => {
                this.doctorData = res.data;
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
}
