"use client"

import { OrdersTableShell } from "@/components/common/orders-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface OrderClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any,
        status: any,
        payment_type: any,
        status_payment: any,
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const OrderClient: React.FC<OrderClientProps> = ({ params }) => {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/orders`, {
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
                    setOrders(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                }
            } catch (error) {
            }
        };

        fetchOrders();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    if (!hasRole) {
        return <>Bạn không có quyền truy cập chức năng này!</>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách đơn đặt hàng"
                    description="Quản lý đơn đặt hàng"
                />
            </div>
            <Separator />
            <OrdersTableShell
                data={orders}
                pageCount={pageCount}
            />
        </>
    );
}