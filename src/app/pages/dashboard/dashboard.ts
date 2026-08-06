import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { ClinicSetupCard } from '@/app/features/clinic-setup/components/clinic-setup-card/clinic-setup-card';
import { SetupProgressWidget } from './components/setup-progress-widget/setup-progress-widget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, ClinicSetupCard, SetupProgressWidget],
    template: `
        <app-clinic-setup-card></app-clinic-setup-card>

        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12">
                <app-setup-progress-widget></app-setup-progress-widget>
            </div>

            <app-stats-widget class="contents" />

            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>

            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget /> <
            </div>
        </div>
    `
})
export class Dashboard {}
