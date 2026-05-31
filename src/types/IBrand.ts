import {getBrands} from "@/actions/brands/brands";

export type IBrand = Awaited<ReturnType<typeof getBrands>>[number]
