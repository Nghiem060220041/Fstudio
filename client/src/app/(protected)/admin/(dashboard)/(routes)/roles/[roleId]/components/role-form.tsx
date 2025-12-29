"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Role } from "@/types";
import { getSession } from "next-auth/react";
import { TableRole } from "./table-role";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface RoleFormProps {
    initialData: Role | null
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên là bắt buộc.",
    }),
    permissions: z.any()
});

export const RoleForm: React.FC<RoleFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    
    const title        = initialData ? "Quản lý vai trò" : "Quản lý vai trò";
    const description  = initialData ? "Chỉnh sửa vai trò" : "Thêm mới vai trò";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            form.setValue("name", initialData.name);
        }
    }, [initialData, form]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const permissionsString = localStorage.getItem("permissions");

            let permissions:Array<Number> = [];
            if (permissionsString) {
                permissions = permissionsString.split(',').map(Number);
            }

            data = { ...data, permissions };
            const session = await getSession();

            if (initialData) {
                const response = await axios.put(`${URL}/api/roles/${params.roleId}`, data, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/roles');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/roles`, data, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/roles');
                    toast.success(toastMessage);
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/roles/${params.roleId}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/roles');
                toast.success("Xóa thành công");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={ onDelete }
                loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />
                {initialData && (
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}>
                            <Trash className="h-4 w-4" />
                        </Button> 
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Xóa vai trò</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên vai trò</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên vai trò"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <TableRole params={{ roleId: 1 }} form={ form } /> 
                    <div className="flex items-center justify-end">
                        <Button variant="outline" onClick={()=>router.push('/admin/roles')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}