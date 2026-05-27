export interface UserDTO {
    id: string
    name: string
    lastName?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    email: string;
    image?: string | null;
}