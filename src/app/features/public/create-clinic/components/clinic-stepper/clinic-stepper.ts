import { Component, input } from '@angular/core';

@Component({
    selector: 'app-clinic-stepper',
    imports: [],
    templateUrl: './clinic-stepper.html',
    styleUrl: './clinic-stepper.scss'
})
export class ClinicStepper {
    readonly currentStep = input.required<number>();
}
