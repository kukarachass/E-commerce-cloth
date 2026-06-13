import EmptyPage from "@/components/account/EmptyPage"
import {useGetOrders} from "@/hooks/order/useGetOrders";
import OrdersSkeletonLoader from "@/components/ui/skeleton-loaders/OrdersSkeletonLoader";
import {toast} from "sonner";


export default function MyOrdersPage() {

    const { data: orders, isPending, isError} = useGetOrders();
    if(isPending) return <OrdersSkeletonLoader/>
    if(isError){
        toast.error("Something went wrong")
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-[var(--text)] text-[24px] font-bold">My Orders</h1>

            {orders?.length === 0 ? (
                <EmptyPage pageName={"orders"} />
            ) : (
                <div className="flex flex-col gap-3">
                    {orders?.map((order) => (
                        <div key={order.id} className="flex flex-row items-center justify-between p-5 border border-[#ebebeb] rounded-[12px] hover:border-[#ccc] transition-colors duration-150">
                            <div className="flex flex-col gap-1">
                                <span className="text-[13px] text-[#999]">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                                <span className="text-[15px] font-semibold text-[var(--text)]">
                                    {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                                <span className="text-[13px] text-[#999]">{order.email}</span>
                            </div>

                            <div className="flex flex-row items-center gap-6">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[15px] font-bold text-[var(--text)]">€{order.totalAmount}</span>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                        order.paymentStatus === "paid"
                                            ? "bg-green-50 text-green-600"
                                            : order.paymentStatus === "pending"
                                                ? "bg-yellow-50 text-yellow-600"
                                                : "bg-red-50 text-red-500"
                                    }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 3l5 5-5 5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}