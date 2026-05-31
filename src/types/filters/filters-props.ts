import {Gender} from "@/store/useGenderStore";

export interface FilterProps{
    gender: Gender,
    categorySlug?: string;
    productIds?: string[];
}