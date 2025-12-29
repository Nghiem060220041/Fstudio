"use client"

import { UsersTableShell } from "@/components/common/users-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserClientProps {
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

export const UserClient: React.FC<UserClientProps> = ({ params }) => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/users`, {
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
                    setUsers(data.data);
                    setTotal(data.meta.total);
                    setHasRole(true);
                } else {
                    setUsers([]);
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
                    title="Danh sách người dùng"
                    description="Quản lý người dùng"
                />
            </div>
            <Separator />
            <UsersTableShell
                data={users}
                pageCount={pageCount}
            />
        </>
    );
}