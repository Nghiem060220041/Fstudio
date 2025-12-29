"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CalendarIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { format } from "date-fns"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Coupon } from "@/types";
import { getSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface CouponFormProps {
    initialData: Coupon | null;
}

const formSchema = z.object({
    code: z.string().min(1, {
        message: "Mã giảm giá là bắt buộc.",
    }).max(20, {
        message: "Tối đa 20 ký tự.",
    }),
    name: z.string().min(1, {
        message: "Tên là bắt buộc.",
    }).max(191, {
        message: "Mô tả tối đa 191 ký tự.",
    }),
    quantity: z.any(),
    type: z.string().min(1, {
        message: "Vui lòng chọn loại giảm giá",
    }),
    value: z.any(),
    value_max: z.any(),
    expiredDate: z.date(),
    description: z.any(),
    active: z.boolean(),
    new_customer: z.boolean(),
    has_expired: z.boolean(),
});

const CouponForm: React.FC<CouponFormProps> = ({ initialData }) => {
    const params                      = useParams();
    const router                      = useRouter();
    const [open, setOpen]             = useState(false);    
    const [loading, setLoading]       = useState(false);
    const [errorCode, setErrorCode]   = useState('');
    const [errorValue, setErrorValue] = useState('');
    const [max, setMax]               = useState(100);
    const [hasExpired, setHasExpired] = useState(true);
    const [isPercent, setIsPercent] = useState(false);
    
    const title        = "Quản lý mã giảm giá";
    const description  = initialData ? "Cập nhật mã giảm giá" : "Thêm mới mã giảm giá";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const defaultValues = {
        name: '',
        code: '',
        quantity: '',
        type: '',
        value: '',
        value_max: '',
        expiredDate: new Date(),
        description: '',
        active: false,
        new_customer: false,
        has_expired: true,
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("active", initialData?.active);
            form.setValue("value", initialData?.value.toString());
            form.setValue("value_max", initialData?.value_max.toString());
            form.setValue("has_expired", initialData?.has_expired);
            form.setValue("new_customer", initialData?.new_customer);
            form.setValue("quantity", (initialData?.quantity-initialData?.quantity_used).toString());
            form.setValue("type", initialData?.type);
            form.setValue("code", initialData?.code);
            form.setValue("expiredDate", new Date(initialData?.expiredDate));
            form.setValue("description", initialData?.description);
            setHasExpired(initialData?.has_expired);
        }
    }, [initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const id = params.couponId;
            const datas = {
                ...data,
                id
            }
            if (initialData) {
                const response = await axios.put(`${URL}/api/coupons/${params.couponId}`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/coupons');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/coupons`, data, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/coupons');
                    toast.success(toastMessage);
                }
            }
        } catch (error: any) {
            toast.error("Đã xảy ra lỗi");
            if (error.response.data.statusCode == 400) {
                if (error.response.data.data.code) {
                    setErrorCode(error.response.data.data.code[0])
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/coupons/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/coupons');
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
                        <p>Xóa mã giảm giá</p>
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
                                    <FormLabel>Tên mã giảm giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên mã giảm giá"
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
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã giảm giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Mã giảm giá"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>{errorCode && errorCode}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                        control={form.control}
                        name="has_expired"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={(isChecked: boolean) => {
                                        field.onChange(isChecked);
                                        setHasExpired(isChecked);
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none w-full">
                                <FormLabel>
                                Có thời hạn
                                </FormLabel>
                                <FormDescription>
                                Khi bật mã giảm giá sẽ có thời hạn sử dụng
                                    </FormDescription>
                            {
                                hasExpired && (
                                    <FormField
                                        control={form.control}
                                        name="expiredDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày hết hạn</FormLabel>
                                                <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Chọn ngày</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        fromYear={1970}
                                                        toYear={2030}
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={loading || ((date) => date < new Date())}
                                                        initialFocus
                                                    />
                                                    </PopoverContent>
                                                </Popover>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )    
                            }
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại khuyến mãi</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                value == "0" ? setMax(100) : setMax(100000000);
                                                value == "0" ? setIsPercent(true) : setIsPercent(false);
                                            }}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn loại khuyến mãi"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key="percent" value="0">
                                               Phần trăm
                                            </SelectItem>
                                            <SelectItem key="value" value="1">
                                                Tiền
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số lượng mã giảm giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            disabled={loading}
                                            placeholder="Số lượng"
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
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trị giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={max}
                                            disabled={loading}
                                            placeholder="Giá trị"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>{errorValue && errorValue}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        isPercent && (
                            <div className="grid grid-cols-1 gap-8">
                                <FormField
                                    control={form.control}
                                    name="value_max"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giảm tối đa</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="100000000"
                                                    disabled={loading}
                                                    placeholder="Giảm tối đa"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage>{errorValue && errorValue}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )
                    }
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
                                Mã giảm giá sẽ hiển thị ở sản phẩm
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="new_customer"
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
                                Dành cho người dùng mới
                                </FormLabel>
                                <FormDescription>
                                Mã giảm giá áp dụng cho người dùng lần đầu tiên đặt hàng.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/coupons')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit">
                            {loading && <Icons.spinner className="h-4 w-4 mr-2 animate-spin" /> }
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default CouponForm;