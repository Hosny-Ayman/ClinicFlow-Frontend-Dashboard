import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { GetPatientResponse } from '../../models/responses/get-patient-response';

@Component({
    selector: 'app-patient-details',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './patient-details.html',
    styleUrl: './patient-details.scss'
})
export class PatientDetails implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly patientService = inject(PatientService);
    private readonly cdr = inject(ChangeDetectorRef);

    patientId: number | null = null;
    patientData: GetPatientResponse | null = null;
    loading: boolean = true;
    error: boolean = false;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.patientId = Number(idParam);
            this.loadPatientDetails();
        } else {
            this.error = true;
            this.loading = false;
        }
    }

    loadPatientDetails(): void {
        this.loading = true;
        this.cdr.detectChanges();
        this.patientService.GetPatient(this.patientId!).subscribe({
            next: (res) => {
                this.patientData = res.data;
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
