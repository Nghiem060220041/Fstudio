"use client"

import { BrandsTableShell } from "@/components/common/brands-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import fetchClient from "@/lib/fetch-client";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface BrandClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const BrandClient: React.FC<BrandClientProps> = ({ params }) => {
    const [brands, setBrands] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/brands`, {
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
                    setBrands(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                } else {
                    setBrands([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchBrands();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    if (!hasRole) {
        return <>Bạn không có quyền truy cập chức năng này!</>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách thương hiệu"
                    description="Quản lý thương hiệu"
                />
            </div>
            <Separator />
            <BrandsTableShell
                data={brands}
                pageCount={pageCount}
            />
        </>
    );
}