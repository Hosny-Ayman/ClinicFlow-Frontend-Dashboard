import { SettingService } from '@/app/core/services/setting.service';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hero',
    imports: [ButtonModule, RouterLink],
    standalone: true,
    templateUrl: './hero.html',
    styleUrl: './hero.scss'
})
export class Hero implements OnInit {
    private readonly settingService = inject(SettingService);
    readonly Image = this.settingService.SystemImage;

    ngOnInit(): void {
        this.settingService.loadImage('SystemImageBackground');
    }
}
