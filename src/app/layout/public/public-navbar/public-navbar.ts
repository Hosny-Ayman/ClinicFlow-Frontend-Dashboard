import { SettingService } from '@/app/core/services/setting.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
    label: string;
    route: string;
}

@Component({
    selector: 'app-public-navbar',
    imports: [RouterLink, RouterLinkActive, CommonModule],
    standalone: true,
    templateUrl: './public-navbar.html',
    styleUrl: './public-navbar.scss'
})
export class PublicNavbar {
    private readonly settingService = inject(SettingService);
    readonly logo = this.settingService.logo;

    isMenuOpen = false;

    navItems: NavItem[] = [
        { label: 'الرئيسية', route: '/home' },
        { label: 'من نحن', route: '/about' },
        { label: 'المميزات', route: '/features' }
    ];
}
