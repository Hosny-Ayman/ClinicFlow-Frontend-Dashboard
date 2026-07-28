import { SettingService } from '@/app/core/services/setting.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
    label: string;
    route: string;
}

@Component({
  selector: 'app-public-navbar',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.scss',
})
export class PublicNavbar {
    private readonly settingService = inject(SettingService);
    readonly logo = this.settingService.logo;

    isMenuOpen = false;

    navItems: NavItem[] = [
        { label: 'الميزات', route: '/features' },
        { label: 'الأسعار', route: '/pricing' },
        { label: 'من نحن', route: '/about' },
        { label: 'تواصل معنا', route: '/contact' }
    ];
}
