import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicSetupCardService } from '@/app/features/clinic-setup/services/clinic-setup-card.service';

@Component({
    selector: 'app-setup-progress-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './setup-progress-widget.html'
})
export class SetupProgressWidget implements OnInit {
    private readonly clinicSetupService = inject(ClinicSetupCardService);
    private readonly cdr = inject(ChangeDetectorRef);

    isVisible = false;
    progress = 0;
    steps: any[] = [];

    ngOnInit() {
        this.loadStatus();
    }

    loadStatus() {
        this.clinicSetupService.GetClinicSetupCard().subscribe({
            next: (res) => {
                const data = res.data;
                if (!data) return;

                if (data.isSetupCompleted) {
                    this.isVisible = false;
                } else if (data.hasSkippedSetup) {
                    this.isVisible = true;
                    this.progress = Math.round(data.progress || 25);
                    this.steps = data.steps || [];
                } else {
                    this.isVisible = false;
                }

                this.cdr.detectChanges();
            }
        });
    }

    continueSetup() {
        this.clinicSetupService.UpdateClinicSetupCard({ hasSkippedSetup: false }).subscribe({
            next: () => {
                window.location.reload();
            }
        });
    }

    hideWidget() {
        this.isVisible = false;
    }
}
