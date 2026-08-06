import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateClinicResponse } from '../../models/responses/CreateClinicResponse';
import { ClinicSetupCardService } from '@/app/features/clinic-setup/services/clinic-setup-card.service';

@Component({
    selector: 'app-success-step',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './success-step.html',
    styleUrl: './success-step.scss'
})
export class SuccessStep implements OnInit {
    private readonly clinicSetupCardService = inject(ClinicSetupCardService);

    ngOnInit(): void {
        this.clinicSetupCardService.CreateClinicSetupCard({ hasSkippedSetup: false }).subscribe();
    }
    @Input({ required: true })
    data!: CreateClinicResponse;

    @Output() goToDashboard = new EventEmitter<void>();
}
