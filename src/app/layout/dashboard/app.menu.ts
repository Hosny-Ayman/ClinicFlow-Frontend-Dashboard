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
                                      ...(this.permissionService.hasPermission(Permission.DoctorsViewAll)
                                          ? [
                                                {
                                                    label: 'الأطباء',
                                                    icon: 'pi pi-fw pi-users',
                                                    routerLink: ['/doctor/show']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.DoctorsCreate)
                                          ? [
                                                {
                                                    label: 'انشاء طبيب',
                                                    icon: 'pi pi-fw pi-user-plus',
                                                    routerLink: ['/doctor/create']
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
                    ...(this.permissionService.hasPermission(Permission.ReceptionistsView)
                        ? [
                              {
                                  label: 'موظفي الاستقبال',
                                  icon: 'pi pi-fw pi-user',
                                  path: '/d',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.ReceptionistsViewAll)
                                          ? [
                                                {
                                                    label: 'موظفي الاستقبال',
                                                    icon: 'pi pi-fw pi-users',
                                                    routerLink: ['/receptionist/show']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.ReceptionistsCreate)
                                          ? [
                                                {
                                                    label: 'انشاء موظف استقبال',
                                                    icon: 'pi pi-fw pi-user-plus',
                                                    routerLink: ['/receptionist/create']
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
