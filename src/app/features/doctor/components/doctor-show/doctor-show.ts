import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { DoctorService } from '../../services/doctor.service';
import { SpecialityService } from '@/app/core/services/speciality.service';
import { NotificationService } from '@/app/core/services/notification.service';

import { GetAllDoctorsInformationsResponse } from '../../models/requests/get-all-doctors-informations-response';
import { DoctorSearchRequest } from '../../models/requests/doctor-search-request';

import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { UserService } from '@/app/features/user/services/user.service';

@Component({
    selector: 'app-doctor-show',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, InputTextModule, SelectModule, TooltipModule, MenuModule],
    templateUrl: './doctor-show.html',
    styleUrl: './doctor-show.scss'
})
export class DoctorShow implements OnInit {
    private readonly doctorService = inject(DoctorService);
    private readonly specialityService = inject(SpecialityService);
    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    doctors: GetAllDoctorsInformationsResponse[] = [];
    totalRecords: number = 0;
    loading: boolean = true;
    exportItems: MenuItem[] | undefined;

    request: DoctorSearchRequest = {
        pageNumber: 1,
        pageSize: 5,
        sortField: '',
        sortOrder: undefined,
        fullNameSearch: undefined,
        emailSearch: '',
        phoneNumberSearch: '',
        gender: undefined,
        specialtyId: undefined
    };

    genders = [
        { label: 'الكل', value: null },
        { label: 'ذكر', value: 1 },
        { label: 'أنثى', value: 2 }
    ];

    specialties: any[] = [{ label: 'كل التخصصات', value: null }];

    ngOnInit(): void {
        this.loadSpecialities();

        this.exportItems = [
            {
                label: 'تصدير PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportToPDF()
            }
        ];
    }

    loadSpecialities() {
        this.specialityService.GetAllSpecialities().subscribe({
            next: (res: any) => {
                const mapped = res.data.map((s: any) => ({ label: s.name, value: s.id }));
                this.specialties = [{ label: 'كل التخصصات', value: null }, ...mapped];
                this.cdr.detectChanges();
            }
        });
    }

    loadDoctors(event?: TableLazyLoadEvent) {
        this.loading = true;
        this.cdr.detectChanges();

        if (event) {
            this.request.pageNumber = Math.floor((event.first || 0) / (event.rows || 5)) + 1;
            this.request.pageSize = event.rows || 5;
            this.request.sortField = (event.sortField as string) || '';
            this.request.sortOrder = event.sortOrder;
        }

        this.doctorService.GetAllDoctorsInformations(this.request).subscribe({
            next: (res) => {
                this.doctors = res.data.data;
                this.totalRecords = res.data.totalRecords;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    search() {
        this.request.pageNumber = 1;
        this.loadDoctors();
    }

    clearFilters() {
        this.request = {
            pageNumber: 1,
            pageSize: this.request.pageSize,
            sortField: '',
            sortOrder: undefined,
            fullNameSearch: undefined,
            emailSearch: '',
            phoneNumberSearch: '',
            gender: undefined,
            specialtyId: undefined
        };
        this.loadDoctors();
    }

    toggleStatus(doctor: GetAllDoctorsInformationsResponse) {
        this.userService.ToggleUserStatus(doctor.userId).subscribe({
            next: () => {
                const actionWord = doctor.status === 'Active' ? 'إيقاف' : 'تفعيل';
                this.notificationService.success(`تم ${actionWord} حساب الطبيب بنجاح`);

                this.loadDoctors();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء تغيير حالة الطبيب');
            }
        });
    }

    editDoctor(id: number) {
        this.router.navigate(['/doctor', id, 'edit']);
    }

    detailsDoctor(id: number) {
        this.router.navigate(['/doctor', id, 'details']);
    }

    exportToPDF() {
        const element = document.getElementById('doctorsTable');

        if (!element) {
            console.error('مش لاقي العنصر اللي الـ ID بتاعه doctorsTable');
            return;
        }

        htmlToImage
            .toPng(element, { backgroundColor: '#ffffff', pixelRatio: 2 })
            .then((dataUrl) => {
                const imgWidth = element.offsetWidth;
                const imgHeight = element.offsetHeight;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfPageWidth = pdf.internal.pageSize.getWidth();
                const pdfPageHeight = (imgHeight * pdfPageWidth) / imgWidth;
                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight);
                pdf.save('Doctors_List.pdf');
            })
            .catch((err) => {
                console.error('حصل مشكلة أثناء إنشاء الـ PDF: ', err);
            });
    }
}
