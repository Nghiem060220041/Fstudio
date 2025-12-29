import { Coupon } from "@/types";
import { Metadata } from "next";
import { CouponClient } from "./client";

interface CouponsPageProps {
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
}
  
export const metadata: Metadata = {
    title: "Admin | Mã giảm giá",
    description: "Quản lý mã giảm giá",
  };

export default async function CouponsPage({
    searchParams,
}: CouponsPageProps) {
    const { page, per_page, sort, name, keywords, active } = searchParams ?? {};
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
            keyof Coupon | undefined,
            "asc" | "desc" | undefined,
            ])
            : [];
    const status = active || "";
    const params = {
        sort_key: column,
        order_by: order,
        per_page: limit,
        page: page,
        keywords: name,
        active: status,
    }

    return (
        <div className="flex-col">
            <div className="container flex-1 space-y-4 p-8 pt-6">
                <CouponClient params={params}/>
            </div>
        </div>
    );
}
