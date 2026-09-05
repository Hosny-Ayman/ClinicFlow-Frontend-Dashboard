import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Made by
        <a href="https://www.linkedin.com/in/hosny-ayman-6a6563434/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Hosny Ayman</a>
    </div>`
})
export class AppFooter {}
