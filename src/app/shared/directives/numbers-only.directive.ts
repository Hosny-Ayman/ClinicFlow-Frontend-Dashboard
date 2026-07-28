import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appNumbersOnly]',
    standalone: true
})
export class NumbersOnlyDirective {
    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        input.value = input.value.replace(/\D/g, '');
    }
}
