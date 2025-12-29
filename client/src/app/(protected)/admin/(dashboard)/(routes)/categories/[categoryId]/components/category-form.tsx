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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Category } from "@/types";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface CategoryFormProps {
    initialData: Category | null;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên là bắt buộc.",
    }),
    active:z.boolean().default(false).optional(),
    home:z.boolean().default(false).optional(),
    description: z.any(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    
    const title        = "Quản lý danh mục";
    const description  = initialData ? "Cập nhật danh mục" : "Thêm mới danh mục";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const defaultValues = {
        name: '',
        description: '',
        active: false, 
        home: false, 
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("description", initialData?.description);
            form.setValue("active", initialData?.active);
            form.setValue("home", initialData?.home);
        }
    }, [initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();

            if (initialData) {
                const response = await axios.put(`${URL}/api/categories/${params.categoryId}`, data, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/categories');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/categories`, data, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/categories');
                    toast.success(toastMessage);
                } else if (response.status = 422) {
                    
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
            const response = await axios.delete(`${URL}/api/categories/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/categories');
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
                        <p>Xóa danh mục</p>
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
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên danh mục"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Hiển thị
                                </FormLabel>
                                <FormDescription>
                                Danh mục sẽ được kích hoạt.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="home"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Menubar
                                </FormLabel>
                                <FormDescription>
                                Danh mục sẽ hiển thị ở menubar trang chủ.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/categories')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button disabled={loading} type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default CategoryForm;