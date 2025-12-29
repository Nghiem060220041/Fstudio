"use client"

import { CouponsTableShell } from "@/components/common/coupons-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CouponClientProps {
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

export const CouponClient: React.FC<CouponClientProps> = ({ params }) => {
    const [coupons, setCoupons] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/coupons`, {
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
                    setCoupons(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                } else {
                    setCoupons([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchCoupons();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    if (!hasRole) {
        return <>Bạn không có quyền truy cập chức năng này!</>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách mã giảm giá"
                    description="Quản lý mã giảm giá"
                />
            </div>
            <Separator />
            <CouponsTableShell
                data={coupons}
                pageCount={pageCount}
            />
        </>
    );
}