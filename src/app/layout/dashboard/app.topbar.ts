import { Component, inject, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '@/app/core/services/auth.service';
import { SettingService } from '@/app/core/services/setting.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, MenuModule, BadgeModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img *ngIf="settingService.logo() as logo" [src]="logo.imageUrl" alt="ClinicFlow Logo" class="h-8 w-auto" />
                <span>ClinicFlow</span>
            </a>
        </div>

        <div class="layout-topbar-actions flex items-center">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-action relative" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-bell p-overlay-badge" pBadge value="3" severity="danger"></i>
            </button>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="hidden lg:flex items-center ml-2 relative">
                <p-menu #userMenu [model]="userMenuItems" [popup]="true" appendTo="body" (onShow)="isMenuOpen = true" (onHide)="isMenuOpen = false" [style]="{ width: '240px', 'margin-top': '10px' }"> </p-menu>

                <button type="button" class="p-link flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-md" (click)="toggleUserMenu($event)">
                    <div class="relative inline-flex items-center justify-center">
                        <p-avatar shape="circle" size="large" [label]="authService.currentUser()?.fullName?.charAt(0) || 'H'" styleClass="bg-primary text-primary-contrast font-bold text-lg"></p-avatar>
                        <span class="absolute w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full dark:border-gray-900" style="bottom: 2px; right: 0px;"></span>
                    </div>

                    <div class="flex flex-col items-start text-left min-w-max">
                        <span class="font-bold text-sm text-color leading-none mb-1">{{ authService.currentUser()?.fullName ?? 'حسني نور' }}</span>
                        <span class="text-xs text-color-secondary font-medium leading-none">{{ authService.currentUser()?.roles?.[0] ?? 'Receptionist' }}</span>
                    </div>

                    <i class="pi pi-chevron-up text-xs text-color-secondary ml-1 transition-transform duration-300" [ngClass]="{ 'rotate-180': isMenuOpen }"></i>
                </button>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnDestroy {
    readonly authService = inject(AuthService);
    readonly layoutService = inject(LayoutService);
    readonly settingService = inject(SettingService);

    @ViewChild('userMenu') userMenu!: Menu;

    isMenuOpen = false;

    readonly userMenuItems: MenuItem[] = [
        { label: 'My Profile', icon: 'pi pi-user' },
        { label: 'Settings', icon: 'pi pi-cog' },
        { separator: true },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                if (this.userMenu) {
                    this.userMenu.hide();
                }

                setTimeout(() => {
                    this.authService.logout().subscribe();
                }, 150);
            }
        }
    ];

    toggleUserMenu(event: Event): void {
        this.userMenu.toggle(event);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    ngOnDestroy() {
        if (this.userMenu) {
            this.userMenu.hide();
        }

        const orphanedMenus = document.querySelectorAll('.p-menu-overlay');
        orphanedMenus.forEach((menu) => menu.remove());
    }
}
