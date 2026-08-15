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

import { PatientService } from '../../services/patient.service';
import { GetAllPatientsResponse } from '../../models/responses/get-all-patients-response';
import { PatientSearchRequest } from '../../models/requests/patient-search-request';

import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

@Component({
    selector: 'app-patients-show',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, InputTextModule, SelectModule, TooltipModule, MenuModule],
    templateUrl: './patients-show.html',
    styleUrl: './patients-show.scss'
})
export class PatientsShow implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    patients: GetAllPatientsResponse[] = [];
    totalRecords: number = 0;
    loading: boolean = true;
    exportItems: MenuItem[] | undefined;

    request: PatientSearchRequest = {
        pageNumber: 1,
        pageSize: 5,
        sortField: '',
        sortOrder: undefined,
        fullNameSearch: undefined,
        emailSearch: '',
        phoneNumberSearch: '',
        nationalIdSearch: '',
        gender: undefined,
        bloodType: undefined
    };

    genders = [
        { label: 'الكل', value: null },
        { label: 'ذكر', value: 1 },
        { label: 'أنثى', value: 2 }
    ];

    bloodTypes = [
        { label: 'كل الفصائل', value: null },
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
    ];

    ngOnInit(): void {
        this.exportItems = [
            {
                label: 'تصدير PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportToPDF()
            }
        ];
    }

    loadPatients(event?: TableLazyLoadEvent) {
        this.loading = true;
        this.cdr.detectChanges();

        if (event) {
            this.request.pageNumber = Math.floor((event.first || 0) / (event.rows || 5)) + 1;
            this.request.pageSize = event.rows || 5;
            this.request.sortField = (event.sortField as string) || '';
            this.request.sortOrder = event.sortOrder;
        }

        this.patientService.GetAllPatients(this.request).subscribe({
            next: (res) => {
                this.patients = res.data.data;
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
        this.loadPatients();
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
            nationalIdSearch: '',
            gender: undefined,
            bloodType: undefined
        };
        this.loadPatients();
    }

    editPatient(id: number) {
        this.router.navigate(['/patient', id, 'edit']);
    }

    detailsPatient(id: number) {
        this.router.navigate(['/patient', id, 'details']);
    }

    exportToPDF() {
        const element = document.getElementById('patientsTable');

        if (!element) {
            console.error('لم يتم العثور على عنصر الجدول patientsTable');
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
                pdf.save('Patients_List.pdf');
            })
            .catch((err) => {
                console.error('حدث خطأ أثناء تصدير PDF:', err);
            });
    }
}
