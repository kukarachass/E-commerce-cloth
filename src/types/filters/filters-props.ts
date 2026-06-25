import {Gender} from "@/hooks/useGender";

export interface FilterProps{
    gender: Gender,
    categorySlug?: string;
    productIds?: string[];
}