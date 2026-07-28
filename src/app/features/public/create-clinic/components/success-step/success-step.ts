import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateClinicResponse } from '../../models/responses/CreateClinicResponse';

@Component({
    selector: 'app-success-step',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './success-step.html',
    styleUrl: './success-step.scss'
})
export class SuccessStep {
    @Input({ required: true })
    data!: CreateClinicResponse;

    @Output() goToDashboard = new EventEmitter<void>();
}
