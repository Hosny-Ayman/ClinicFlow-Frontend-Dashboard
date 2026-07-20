import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingService } from './app/core/service/setting.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    private readonly settingService = inject(SettingService);

    ngOnInit(): void {
        this.settingService.loadLogo();
    }
}
