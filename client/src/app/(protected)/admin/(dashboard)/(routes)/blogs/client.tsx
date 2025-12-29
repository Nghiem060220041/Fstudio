"use client"

import { BlogsTableShell } from "@/components/common/blogs-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface BlogClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const BlogClient: React.FC<BlogClientProps> = ({ params }) => {
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchBrands = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/blogs`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setBlogs(data.data);
                    setTotal(data.meta.total);
                } else {
                    setBlogs([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchBrands();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách bài đăng"
                    description="Quản lý bài đăng"
                />
            </div>
            <Separator />
            <BlogsTableShell
                data={blogs}
                pageCount={pageCount}
            />
        </>
    );
}