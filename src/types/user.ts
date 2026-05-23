export interface UserDTO {
    id: string
    name: string
    lastName?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    street?: string | null;
    houseNumber?: string | null;
    houseAddition?: string | null;
    postcode?: string | null;
    city?: string | null;
    phoneNumber?: string | null;
    email: string;
    image?: string | null;
}