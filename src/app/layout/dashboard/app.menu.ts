import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { PermissionService } from '@/app/core/services/permission.service';
import { Permission } from '@/app/core/enums/Permission';
import { AuthService } from '@/app/core/services/auth.service';

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
    private authService = inject(AuthService);

    ngOnInit() {
        this.model = [
            {
                label: 'الرئيسية',
                items: [{ label: 'لوحة التحكم', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'لوحة الإدارة',
                icon: 'pi pi-fw pi-briefcase',
                path: '/pages',
                items: [
                    {
                        label: 'المصادقة والصلاحيات',
                        icon: 'pi pi-fw pi-shield',
                        path: '/auth',
                        items: [
                            {
                                label: 'خطأ في النظام',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'غير مصرح',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    ...(this.permissionService.hasPermission(Permission.DoctorsView)
                        ? [
                              {
                                  label: 'إدارة الأطباء',
                                  icon: 'pi pi-fw pi-heart',
                                  path: '/s',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.DoctorsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة الأطباء',
                                                    icon: 'pi pi-fw pi-users',
                                                    routerLink: ['/doctor/show']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.DoctorsCreate)
                                          ? [
                                                {
                                                    label: 'إضافة طبيب جديد',
                                                    icon: 'pi pi-fw pi-user-plus',
                                                    routerLink: ['/doctor/create']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.DoctorSchedulesUpdate)
                                          ? [
                                                {
                                                    label: 'إعداد جدول المواعيد',
                                                    icon: 'pi pi-fw pi-calendar',
                                                    routerLink: [`/DoctorSchedule/${this.authService.currentUser()?.id}/edit`]
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
                                  label: 'إدارة الاستقبال',
                                  icon: 'pi pi-fw pi-desktop',
                                  path: '/d',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.ReceptionistsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة موظفي الاستقبال',
                                                    icon: 'pi pi-fw pi-users',
                                                    routerLink: ['/receptionist/show']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.ReceptionistsCreate)
                                          ? [
                                                {
                                                    label: 'إضافة موظف جديد',
                                                    icon: 'pi pi-fw pi-user-plus',
                                                    routerLink: ['/receptionist/create']
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),

                    ...(this.permissionService.hasPermission(Permission.PatientsView)
                        ? [
                              {
                                  label: 'إدارة المرضى',
                                  icon: 'pi pi-fw pi-id-card',
                                  path: '/p',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.PatientsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة المرضى',
                                                    icon: 'pi pi-fw pi-users',
                                                    routerLink: ['/patient/show']
                                                }
                                            ]
                                          : []),

                                      ...(this.permissionService.hasPermission(Permission.PatientsCreate)
                                          ? [
                                                {
                                                    label: 'إضافة مريض جديد',
                                                    icon: 'pi pi-fw pi-user-plus',
                                                    routerLink: ['/patient/create']
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),

                    {
                        label: 'الصفحة غير موجودة',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    }
                ]
            }
        ];
    }
}
