import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly messageService = inject(MessageService);

    success(detail: string): void {
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: detail });
    }

    error(detail: string): void {
        this.messageService.add({ severity: 'error', summary: 'فشل', detail: detail });
    }

    warn(detail: string): void {
        this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: detail });
    }

    info(detail: string): void {
        this.messageService.add({ severity: 'info', summary: 'معلومه', detail: detail });
    }
}
