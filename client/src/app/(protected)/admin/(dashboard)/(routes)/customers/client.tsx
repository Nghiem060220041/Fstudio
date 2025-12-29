"use client"

import { CustomersTableShell } from "@/components/common/customers-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CustomerClientProps {
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

export const CustomerClient: React.FC<CustomerClientProps> = ({ params }) => {
    const [customers, setCustomers] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/customers`, {
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
                    setCustomers(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                } else {
                    setCustomers([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchBanners();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    if (!hasRole) {
        return <>Bạn không có quyền truy cập chức năng này!</>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách khách hàng"
                    description="Quản lý khách hàng"
                />
            </div>
            <Separator />
            <CustomersTableShell
                data={customers}
                pageCount={pageCount}
            />
        </>
    );
}