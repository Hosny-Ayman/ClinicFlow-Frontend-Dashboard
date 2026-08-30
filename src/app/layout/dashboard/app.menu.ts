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
                    ...(this.permissionService.hasPermission(Permission.AppointmentsViewAll) || this.permissionService.hasPermission(Permission.AppointmentsCreate)
                        ? [
                              {
                                  label: 'إدارة المواعيد',
                                  icon: 'pi pi-fw pi-calendar',
                                  path: '/a',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.AppointmentsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة المواعيد',
                                                    icon: 'pi pi-fw pi-list',
                                                    routerLink: ['/appointment/show']
                                                }
                                            ]
                                          : []),
                                      ...(this.permissionService.hasPermission(Permission.AppointmentsCreate)
                                          ? [
                                                {
                                                    label: 'حجز موعد جديد',
                                                    icon: 'pi pi-fw pi-calendar-plus',
                                                    routerLink: ['/appointment/create']
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),

                    ...(this.permissionService.hasPermission(Permission.DoctorsView)
                        ? [
                              {
                                  label: 'إدارة الأطباء',
                                  icon: 'pi pi-fw pi-user-edit',
                                  path: '/s',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.DoctorsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة الأطباء',
                                                    icon: 'pi pi-fw pi-list',
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
                                                    icon: 'pi pi-fw pi-clock',
                                                    routerLink: [`/DoctorSchedule/${this.authService.currentUser()?.id}/edit`]
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),

                    ...(this.permissionService.hasPermission(Permission.DoctorVacationsView)
                        ? [
                              {
                                  label: 'إدارة الإجازات',
                                  icon: 'pi pi-fw pi-calendar-times',
                                  path: '/v',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.DoctorVacationsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة الإجازات',
                                                    icon: 'pi pi-fw pi-list',
                                                    routerLink: ['/doctorVacation']
                                                }
                                            ]
                                          : []),
                                      ...(this.permissionService.hasPermission(Permission.DoctorVacationsCreate)
                                          ? [
                                                {
                                                    label: 'إضافة إجازة جديدة',
                                                    icon: 'pi pi-fw pi-calendar-plus',
                                                    routerLink: ['/doctorVacation/create']
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
                                  icon: 'pi pi-fw pi-users',
                                  path: '/p',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.PatientsViewAll)
                                          ? [
                                                {
                                                    label: 'قائمة المرضى',
                                                    icon: 'pi pi-fw pi-list',
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
                                                    icon: 'pi pi-fw pi-list',
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

                    ...(this.permissionService.hasPermission(Permission.ClinicsView)
                        ? [
                              {
                                  label: 'إدارة العيادة',
                                  icon: 'pi pi-fw pi-building',
                                  path: '/c',
                                  items: [
                                      ...(this.permissionService.hasPermission(Permission.ClinicsSettings)
                                          ? [
                                                {
                                                    label: 'إعدادات العيادة',
                                                    icon: 'pi pi-fw pi-cog',
                                                    routerLink: [`/clinic/${this.authService.currentUser()?.clinicId}/edit`]
                                                }
                                            ]
                                          : []),
                                      ...(this.permissionService.hasPermission(Permission.ClinicsUpdate)
                                          ? [
                                                {
                                                    label: 'أوقات عمل العيادة',
                                                    icon: 'pi pi-fw pi-clock',
                                                    routerLink: ['/clinicWorkingHours']
                                                }
                                            ]
                                          : [])
                                  ]
                              }
                          ]
                        : []),

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
                    }
                ]
            }
        ];
    }
}
