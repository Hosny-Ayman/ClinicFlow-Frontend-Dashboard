import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingService } from './app/core/services/setting.service';
import { Toast } from 'primeng/toast';
import { AuthService } from './app/core/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast],
    template: `<p-toast></p-toast> <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    private readonly settingService = inject(SettingService);
    private readonly authService = inject(AuthService);

    ngOnInit(): void {
        this.settingService.loadLogo();
    }
}
