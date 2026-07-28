import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ClinicInformationForm } from '../../models/forms/clinic-information-form';
import { isInvalid } from '@/app/shared/utils/form.utils';
import { NumbersOnlyDirective } from '@/app/shared/directives/numbers-only.directive';

@Component({
    selector: 'app-clinic-information-step',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, NumbersOnlyDirective],
    templateUrl: './clinic-information-step.html',
    styleUrl: './clinic-information-step.scss'
})
export class ClinicInformationStep implements OnInit {
    ngOnInit(): void {
        console.log('FORM =', this.form);
    }
    @Input({ required: true })
    form!: FormGroup<ClinicInformationForm>;

    protected readonly isInvalid = isInvalid;

    @Output()
    next = new EventEmitter<void>();

    get f() {
        return this.form.controls;
    }
}
