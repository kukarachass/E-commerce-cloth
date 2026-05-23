
import {auth} from "@/lib/auth";
import {UserDTO} from "@/types/user";

export function toUserDTO(user: typeof auth.$Infer.Session.user): UserDTO {
    return {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        street: user.street,
        houseNumber: user.houseNumber,
        houseAddition: user.houseAddition,
        postcode: user.postcode,
        city: user.city,
        phoneNumber: user.phoneNumber,
        email: user.email,
        image: user.image,
    }
}