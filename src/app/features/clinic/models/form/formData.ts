export interface DataForm {
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    description: string | null;
    logoImage: File | null;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
    };
}
