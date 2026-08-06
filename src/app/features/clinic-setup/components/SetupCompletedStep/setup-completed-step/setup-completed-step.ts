import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ClinicSetupCardService } from '../../../services/clinic-setup-card.service';

@Component({
    selector: 'app-setup-completed-step',
    imports: [],
    templateUrl: './setup-completed-step.html',
    styleUrl: './setup-completed-step.scss'
})
export class SetupCompletedStep implements OnInit {
    private readonly clinicSetupCardService = inject(ClinicSetupCardService);

    @Output() goToDashboard = new EventEmitter<void>();

    ngOnInit(): void {
        this.clinicSetupCardService.CreateClinicSetupCard({ hasSkippedSetup: false }).subscribe();
    }
}
