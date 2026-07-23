import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingService } from './app/core/services/setting.service';
import { Toast } from 'primeng/toast';
import { AuthService } from './app/core/services/auth.service';
import { LoadingSpinner } from './app/shared/components/loading-spinner/loading-spinner';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast, LoadingSpinner],
    template: `<app-loading-spinner />

        <p-toast></p-toast>

        <router-outlet></router-outlet><p-toast></p-toast> <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    private readonly settingService = inject(SettingService);

    ngOnInit(): void {
        this.settingService.loadLogo();
    }
}
