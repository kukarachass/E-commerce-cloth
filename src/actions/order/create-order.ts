import {IOrder} from "@/types/IOrder";

interface CreateOrderProps {
    data: Omit<IOrder, "userId">;
}

export async function createOrder({ data }: CreateOrderProps){
    return
}