
import {UserDTO} from "@/types/user";
import {InferSelectModel} from "drizzle-orm";
import {user} from "@/db/schema";

export function toUserDTO(userData: InferSelectModel<typeof user>): UserDTO {
    return {
        id: userData.id,
        name: userData.name,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        image: userData.image,
    }
}