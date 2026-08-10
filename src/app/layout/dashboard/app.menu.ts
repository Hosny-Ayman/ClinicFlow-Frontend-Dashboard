import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { PermissionService } from '@/app/core/services/permission.service';
import { Permission } from '@/app/core/enums/Permission';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    private permissionService = inject(PermissionService);

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                path: '/pages',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        path: '/auth',
                        items: [
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    ...(this.permissionService.hasPermission(Permission.DoctorsView)
                        ? [
                              {
                                  label: 'دكتور',
                                  icon: 'pi pi-fw pi-user',
                                  path: '/s',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.DoctorsCreate)
                                          ? [
                                                {
                                                    label: 'انشاء دكتور',
                                                    icon: 'pi pi-fw pi-times-circle',
                                                    routerLink: ['/doctor/create']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.DoctorsUpdate)
                                          ? [
                                                {
                                                    label: 'جميع الدكاتره',
                                                    icon: 'pi pi-fw pi-times-circle',
                                                    routerLink: ['/auth/error']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.DoctorsUpdate)
                                          ? [
                                                {
                                                    label: 'Add',
                                                    icon: 'pi pi-fw pi-lock',
                                                    routerLink: ['/auth/access']
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    }
                ]
            }
        ];
    }
}
