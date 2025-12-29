import { Brand } from "@/types";
import { Metadata } from "next";
import { BlogClient } from "./client";

interface BrandsPageProps {
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
}
  
export const metadata: Metadata = {
    title: "Admin | Blog",
    description: "Quản lý blog",
  };

export default async function BrandsPage({
    searchParams,
}: BrandsPageProps) {
    const { page, per_page, sort, name, keywords } = searchParams ?? {};
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
            keyof Brand | undefined,
            "asc" | "desc" | undefined,
            ])
            : [];
    const params = {
        sort_key: column,
        order_by: order,
        per_page: limit,
        page: page,
        keywords: name
    }

    return (
        <div className="flex-col">
            <div className="container flex-1 space-y-4 p-8 pt-6">
                <BlogClient params={params}/>
            </div>
        </div>
    );
}
