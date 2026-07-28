import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SettingService } from '@/app/core/services/setting.service';

@Component({
  selector: 'app-public-footer',
  imports: [
        RouterLink,
        AvatarModule,
        ButtonModule,
        CardModule,
        DividerModule
  ],
  standalone: true,
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.scss',
})
export class PublicFooter {
    private readonly settingService = inject(SettingService);
    readonly logo = this.settingService.logo;
}
