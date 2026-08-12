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

import { UserService } from '../../services/user.service';
import { NotificationService } from '@/app/core/services/notification.service';

import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { GetAllReceptionistsResponse } from '../../models/responses/get-all-receptionists-response';
import { ReceptionistsSearchRequest } from '../../models/requests/receptionists-search-request';

@Component({
    selector: 'app-receptionists-show',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, InputTextModule, SelectModule, TooltipModule, MenuModule],
    templateUrl: './receptionists-show.html',
    styleUrl: './receptionists-show.scss'
})
export class ReceptionistsShow implements OnInit {
    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    receptionists: GetAllReceptionistsResponse[] = [];
    totalRecords: number = 0;
    loading: boolean = true;
    exportItems: MenuItem[] | undefined;

    request: ReceptionistsSearchRequest = {
        pageNumber: 1,
        pageSize: 5,
        sortField: null,
        sortOrder: null,
        fullNameSearch: null,
        emailSearch: null,
        phoneNumberSearch: null,
        status: null
    };

    statuses = [
        { label: 'الكل', value: null },
        { label: 'نشط', value: true },
        { label: 'غير نشط', value: false }
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

    loadReceptionists(event?: TableLazyLoadEvent) {
        this.loading = true;
        this.cdr.detectChanges();

        if (event) {
            this.request.pageNumber = Math.floor((event.first || 0) / (event.rows || 5)) + 1;
            this.request.pageSize = event.rows || 5;
            this.request.sortField = (event.sortField as string) || null;
            this.request.sortOrder = event.sortOrder || null;
        }

        this.userService.GetAllReceptionistsformations(this.request).subscribe({
            next: (res) => {
                this.receptionists = res.data.data;
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
        this.loadReceptionists();
    }

    clearFilters() {
        this.request = {
            pageNumber: 1,
            pageSize: this.request.pageSize,
            sortField: null,
            sortOrder: null,
            fullNameSearch: null,
            emailSearch: null,
            phoneNumberSearch: null,
            status: null
        };
        this.loadReceptionists();
    }

    toggleStatus(receptionist: GetAllReceptionistsResponse) {
        this.userService.ToggleUserStatus(Number(receptionist.id)).subscribe({
            next: () => {
                const actionWord = receptionist.status === 'Active' ? 'إيقاف' : 'تفعيل';
                this.notificationService.success(`تم ${actionWord} حساب موظف الاستقبال بنجاح`);
                this.loadReceptionists();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء تغيير حالة موظف الاستقبال');
            }
        });
    }

    editReceptionist(id: Number) {
        this.router.navigate(['/receptionist', id, 'edit']);
    }

    detailsReceptionist(id: Number) {
        this.router.navigate(['/receptionist', id, 'details']);
    }

    exportToPDF() {
        const element = document.getElementById('receptionistsTable');

        if (!element) return;

        htmlToImage.toPng(element, { backgroundColor: '#ffffff', pixelRatio: 2 }).then((dataUrl) => {
            const imgWidth = element.offsetWidth;
            const imgHeight = element.offsetHeight;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = (imgHeight * pdfPageWidth) / imgWidth;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight);
            pdf.save('Receptionists_List.pdf');
        });
    }
}
