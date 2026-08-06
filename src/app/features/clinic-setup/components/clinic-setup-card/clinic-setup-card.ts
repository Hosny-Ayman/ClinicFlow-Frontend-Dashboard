import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicSetupCardService } from '../../services/clinic-setup-card.service';
import { DoctorForm } from '@/app/features/doctor/components/create-edit-doctor/doctor-form';
import { ReceptionistForm } from '@/app/features/user/components/receptionist-form/receptionist-form';
import { ClinicWorkingHourForm } from '@/app/features/clinic-working-hour/components/clinic-working-hour-form/clinic-working-hour-form';
import { SetupCompletedStep } from '../SetupCompletedStep/setup-completed-step/setup-completed-step';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-clinic-setup-card',
    standalone: true,
    imports: [CommonModule, DialogModule, DoctorForm, ReceptionistForm, ClinicWorkingHourForm, SetupCompletedStep],
    templateUrl: './clinic-setup-card.html',
    styleUrl: './clinic-setup-card.scss'
})
export class ClinicSetupCard implements OnInit {
    private readonly clinicSetupService = inject(ClinicSetupCardService);
    private readonly cdr = inject(ChangeDetectorRef);

    isVisible = false;
    currentStep = 1;
    isOwner = true;

    ngOnInit(): void {
        this.loadSetupStatus();
    }

    loadSetupStatus() {
        this.clinicSetupService.GetClinicSetupCard().subscribe({
            next: (res) => {
                const data = res.data;

                if (!data) {
                    this.isVisible = true;
                    this.currentStep = 1;
                } else if (data.hasSkippedSetup) {
                    this.isVisible = false;
                } else {
                    let realStep = 1;

                    if (!data.steps[0].isCompleted) {
                        realStep = 1;
                    } else if (!data.steps[1].isCompleted) {
                        realStep = 2;
                    } else if (!data.steps[2].isCompleted) {
                        realStep = 3;
                    } else {
                        realStep = 4;
                    }

                    if (realStep === 4) {
                        if (this.isVisible) {
                            this.currentStep = 4;
                            this.isVisible = true;
                        } else {
                            this.isVisible = false;
                        }
                    } else {
                        this.isVisible = true;
                        this.currentStep = realStep;
                    }
                }

                this.cdr.detectChanges();
            }
        });
    }

    onStepSuccess() {
        this.loadSetupStatus();
    }

    skipSetup() {
        this.clinicSetupService.UpdateClinicSetupCard({ hasSkippedSetup: true }).subscribe({
            next: () => {
                this.isVisible = false;
                this.cdr.detectChanges();
            }
        });
    }
}
