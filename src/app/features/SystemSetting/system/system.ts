import { SettingService } from '@/app/core/services/setting.service';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-system',
    imports: [],
    templateUrl: './system.html',
    styleUrl: './system.scss'
})
export class System {
    private readonly _settingService = inject(SettingService);
}
