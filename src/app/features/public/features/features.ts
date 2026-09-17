import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FeatureCard {
    id: string;
    title: string;
    description: string;
    icon: string;
}

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './features.html',
    styleUrl: './features.scss'
})
export class Features {
    readonly topFeatures: FeatureCard[] = [
        {
            id: 'settings',
            title: 'إعدادات العيادة',
            description: 'إعداد ساعات العمل، التخصصات، الخدمات والعديد من الإعدادات المرنة.',
            icon: 'pi pi-cog'
        },
        {
            id: 'prescriptions',
            title: 'الوصفات الطبية',
            description: 'إصدار وإدارة الوصفات الطبية بسهولة مع إمكانية الطباعة والمتابعة.',
            icon: 'pi pi-file-edit'
        },
        {
            id: 'medical-records',
            title: 'السجلات الطبية',
            description: 'حفظ التاريخ الطبي للمرضى، والوصفات والتقارير والفحوصات بشكل آمن.',
            icon: 'pi pi-book'
        },
        {
            id: 'doctors',
            title: 'إدارة الأطباء',
            description: 'إدارة بيانات الأطباء وتخصصاتهم ومواعيدهم وساعات العمل.',
            icon: 'pi pi-user-plus'
        },
        {
            id: 'patients',
            title: 'إدارة المرضى',
            description: 'حفظ بيانات المرضى بشكل منظم وسريع مع إمكانية البحث والتصنيف المتقدم.',
            icon: 'pi pi-users'
        },
        {
            id: 'appointments',
            title: 'إدارة المواعيد',
            description: 'تنظيم وجدولة المواعيد بسهولة مع تجنب تضارب المواعيد وإشعارات تلقائية.',
            icon: 'pi pi-calendar'
        }
    ];

    readonly bottomFeatures: FeatureCard[] = [
        {
            id: 'responsive',
            title: 'متاح على جميع الأجهزة',
            description: 'يعمل على الكمبيوتر، التابلت والموبايل من أي مكان وفي أي وقت.',
            icon: 'pi pi-desktop'
        },
        {
            id: 'multi-user',
            title: 'دعم متعدد المستخدمين',
            description: 'إمكانية إضافة فريق العمل (أطباء، استقبال، إداريين) بصلاحيات مختلفة.',
            icon: 'pi pi-users'
        },
        {
            id: 'security',
            title: 'الأمان والخصوصية',
            description: 'حماية عالية لبيانات المرضى مع نظام صلاحيات متقدم للمستخدمين.',
            icon: 'pi pi-shield'
        },
        {
            id: 'notifications',
            title: 'الإشعارات',
            description: 'إشعارات للمواعيد والتحديثات عبر البريد الإلكتروني أو داخل النظام.',
            icon: 'pi pi-bell'
        },
        {
            id: 'analytics',
            title: 'التقارير والإحصائيات',
            description: 'تقارير شاملة تساعدك على متابعة أداء العيادة واتخاذ قرارات أفضل.',
            icon: 'pi pi-chart-line'
        }
    ];

    readonly checklistItems: string[] = [
        'إعداد سريع وسهل',
        'دعم فني مستمر',
        'تحديثات مجانية'
    ];
}
