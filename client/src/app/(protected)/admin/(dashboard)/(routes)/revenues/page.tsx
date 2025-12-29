import { Order } from "@/types";
import { Metadata } from "next";
import { OrderClient } from "./client";

interface OrdersPageProps {
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
}
  
export const metadata: Metadata = {
    title: "Admin | Doanh thu",
    description: "Quản lý doanh thu",
  };

export default async function OrdersPage({
    searchParams,
}: OrdersPageProps) {
    const { page, per_page, sort, code, keywords, status, payment_type, from, to } = searchParams ?? {};
    const limit = typeof per_page === "string" ? parseInt(per_page) : 10;
    const offset =
        typeof page === "string"
        ? parseInt(page) > 0
            ? (parseInt(page) - 1) * limit
            : 0
        : 0;
    const [column, order] =
        typeof sort === "string"
        ? (sort.split(".") as [
            keyof Order | undefined,
            "asc" | "desc" | undefined,
            ])
            : [];
    const active = status || "";
    const paymentT = payment_type || "";
    const params = {
        sort_key: column,
        order_by: order,
        per_page: limit,
        page: page,
        keywords: code,
        status: active,
        payment_type: paymentT,
        from: from,
        to: to,
    }


    return (
        <div className="flex-col">
            <div className="container flex-1 space-y-4 p-8 pt-6">
                <OrderClient params={params}/>
            </div>
        </div>
    );
}
