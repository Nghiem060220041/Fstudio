import { Product } from "@/types";
import { Metadata } from "next";
import { ProductClient } from "./client";

interface ProductsPageProps {
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
}
  
export const metadata: Metadata = {
    title: "Admin | Sản phẩm",
    description: "Quản lý sản phẩm",
  };

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const { page, per_page, sort, name, brand_id, category_id, keywords, active } = searchParams ?? {};
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
            keyof Product | undefined,
            "asc" | "desc" | undefined,
            ])
            : [];
    const status       = active   || "";
    const brandId      = brand_id || "";
    const categoryId   = category_id || "";
    
    const params = {
        sort_key: column,
        brand_id: brandId,
        category_id: categoryId,
        order_by: order,
        per_page: limit,
        page: page,
        keywords: name,
        active: status
    }

    return (
        <div className="flex-col">
            <div className="container flex-1 space-y-4 p-8 pt-6">
                <ProductClient params={params}/>
            </div>
        </div>
    );
}
