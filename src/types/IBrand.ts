import {getBrands} from "@/actions/filters/brands/brands";

export type IBrand = Awaited<ReturnType<typeof getBrands>>[number]
