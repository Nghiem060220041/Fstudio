"use client"

import { CategoriesTableShell } from "@/components/common/categories-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CategoryClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any,
        active: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const CategoryClient: React.FC<CategoryClientProps> = ({ params }) => {
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/categories`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 403) {
                    setHasRole(false);
                }

                if (response.status === 200) {
                    const data = response.data;
                    setCategories(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                } else {
                    setCategories([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchCategories();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    if (!hasRole) {
        return <>Bạn không có quyền truy cập chức năng này!</>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách danh mục"
                    description="Quản lý danh mục"
                />
            </div>
            <Separator />
            <CategoriesTableShell
                data={categories}
                pageCount={pageCount}
            />
        </>
    );
}