import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeatureItem {
    id: string;
    icon: string;
    titleLine1: string;
    titleLine2: string;
}

interface SocialLink {
    name: string;
    icon: string;
    url: string;
    ariaLabel: string;
}

interface ContactItem {
    type: 'email' | 'phone' | 'text';
    icon: string;
    value: string;
    label: string;
    link?: string;
    dir?: 'ltr' | 'rtl';
}

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.html',
    styleUrl: './about.scss'
})
export class About {
    readonly features: FeatureItem[] = [
        {
            id: 'support',
            icon: 'pi pi-heart',
            titleLine1: 'دعم مستمر',
            titleLine2: 'وتطوير دائم'
        },
        {
            id: 'efficiency',
            icon: 'pi pi-chart-bar',
            titleLine1: 'زيادة الكفاءة',
            titleLine2: 'والإنتاجية'
        },
        {
            id: 'usability',
            icon: 'pi pi-users',
            titleLine1: 'تجربة سهلة',
            titleLine2: 'لكل المستخدمين'
        },
        {
            id: 'security',
            icon: 'pi pi-shield',
            titleLine1: 'أمان وخصوصية',
            titleLine2: 'البيانات'
        }
    ];

    readonly socialLinks: SocialLink[] = [
        {
            name: 'LinkedIn',
            icon: 'pi pi-linkedin',
            url: 'https://www.linkedin.com/in/hosny-ayman-6a6563434/',
            ariaLabel: 'Hosny Ayman on LinkedIn'
        },
        {
            name: 'GitHub',
            icon: 'pi pi-github',
            url: 'https://github.com/Hosny-Ayman',
            ariaLabel: 'Hosny Ayman on GitHub'
        },
        {
            name: 'Website',
            icon: 'pi pi-globe',
            url: '#',
            ariaLabel: 'Hosny Ayman Portfolio'
        }
    ];

    readonly contactItems: ContactItem[] = [
        {
            type: 'email',
            icon: 'pi pi-envelope',
            value: 'hosnyaymandev@gmail.com',
            label: 'البريد الإلكتروني',
            link: 'mailto:hosnyaymandev@gmail.com',
            dir: 'ltr'
        },
        {
            type: 'phone',
            icon: 'pi pi-phone',
            value: '01097476025',
            label: 'رقم الهاتف',
            link: 'tel:01097476025',
            dir: 'ltr'
        },
        {
            type: 'text',
            icon: 'pi pi-map-marker',
            value: 'مصر',
            label: 'الموقع',
            dir: 'rtl'
        }
    ];
}
