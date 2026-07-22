import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private activeRequests = 0;

    readonly isLoading = signal(false);

    show(): void {
        this.activeRequests++;

        if (!this.isLoading()) {
            this.isLoading.set(true);
        }
    }

    hide(): void {
        if (this.activeRequests > 0) {
            this.activeRequests--;
        }

        if (this.activeRequests === 0) {
            this.isLoading.set(false);
        }
    }
}
