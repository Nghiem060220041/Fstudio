"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import Currency from "@/components/client/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types";
import { Check, FileDown, Loader, PackageCheck, PartyPopper, Truck, X } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OrderFormProps {
    initialData: Order | null;
}

const formSchema = z.object({
    status:z.string(),
    status_payment:z.string(),
    payment_type:z.string(),
    address: z.any(),
    description: z.any(),
});

const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const status: number[] = [0, 1, 2, 3, 4];
    const [status0, setStatus0] = useState(false);
    const [status1, setStatus1] = useState(false);
    const [status2, setStatus2] = useState(false);
    const [status3, setStatus3] = useState(false);
    const [status4, setStatus4] = useState(false);
    const [status5, setStatus5] = useState(false);
    
    const title        = "Quản lý đơn đặt hàng";
    const description  = initialData ? "Cập nhật đơn đặt hàng" : "Thêm mới đơn đặt hàng";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const defaultValues = {
        description: '',
        address: '',
        payment_type: '',
        status_payment: '',
        status: '', 
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    

    useEffect(() => {
        if (initialData) {
            form.setValue("address", initialData?.address);
            form.setValue("description", initialData?.description);
            form.setValue("status", initialData?.status_code);
            form.setValue("status_payment", initialData?.status_payment_code);
            form.setValue("payment_type", initialData?.payment_type);
            if ((status.indexOf(parseInt(initialData?.status_code)) !== -1)) {
                if (parseInt(initialData?.status_code) >= 0) {
                    setStatus0(true);
                }
            }
            if ((status.indexOf(parseInt(initialData?.status_code)) !== -1)) {
                if (parseInt(initialData?.status_code) >= 1) {
                    setStatus1(true);
                }
            }
            if ((status.indexOf(parseInt(initialData?.status_code)) !== -1)) {
                if (parseInt(initialData?.status_code) >= 2) {
                    setStatus2(true);
                }
            }
            if ((status.indexOf(parseInt(initialData?.status_code)) !== -1)) {
                if (parseInt(initialData?.status_code) >= 3) {
                    setStatus3(true);
                }
            }
            if ((status.indexOf(parseInt(initialData?.status_code)) !== -1)) {
                if (parseInt(initialData?.status_code) >= 4) {
                    setStatus4(true);
                }
            }
            if ((status.indexOf(parseInt(initialData?.status_code)) === -1)) {
                setStatus5(true);
            }
        }
    }, [initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.put(`${URL}/api/orders/${params.orderId}`, data, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                }); 
            if (response.status === 200) {
                router.push('/admin/orders');
                toast.success(toastMessage);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <div className="grid grid-cols-12 gap-x-2">
                        <Card className="col-span-9">
                            <CardHeader>
                                <span className="text-md font-medium flex">Thông tin đơn đặt hàng <p className="ml-2 font-semibold text-sky-500">#{initialData?.code}</p></span>
                                <Separator className="mt-2"/>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow key="address">
                                            <TableCell className="font-medium">Giao hàng đến:</TableCell>
                                            <TableCell className="text-left">{ initialData?.address }</TableCell>
                                        </TableRow>
                                        <TableRow key="dateorder">
                                            <TableCell className="font-medium">Ngày đặt hàng:</TableCell>
                                            <TableCell className="text-left">{ initialData?.createdAt }</TableCell>
                                        </TableRow>
                                        <TableRow key="customer">
                                            <TableCell className="font-medium">Người nhận:</TableCell>
                                            <TableCell className="text-left">{ initialData?.customer.name }</TableCell>
                                        </TableRow>
                                        <TableRow key="phone">
                                            <TableCell className="font-medium">Điện thoại:</TableCell>
                                            <TableCell className="text-left">{ initialData?.customer.phone }</TableCell>
                                        </TableRow>
                                        <TableRow key="email">
                                            <TableCell className="font-medium">Email:</TableCell>
                                            <TableCell className="text-left">{ initialData?.customer.email }</TableCell>
                                        </TableRow>
                                        <TableRow key="typepayment">
                                            <TableCell className="font-medium">Hình thức thanh toán:</TableCell>
                                            <TableCell className="text-left">{ initialData?.payment_type }</TableCell>
                                        </TableRow>
                                        <TableRow key="statuspayment">
                                            <TableCell className="font-medium">Trạng thái thanh toán:</TableCell>
                                            <TableCell className="text-left">{ initialData?.status_payment }</TableCell>
                                        </TableRow>
                                        <TableRow key="datepayment">
                                            <TableCell className="font-medium">Ngày thanh toán:</TableCell>
                                            <TableCell className="text-left">{ initialData?.paymentAt }</TableCell>
                                        </TableRow>
                                        <TableRow key="desc">
                                            <TableCell className="font-medium">Ghi chú:</TableCell>
                                            <TableCell className="text-left">{ initialData?.description }</TableCell>
                                        </TableRow>
                                        <TableRow key="invoice">
                                            <TableCell className="font-medium">Hóa đơn điện tử:</TableCell>
                                            <TableCell className="text-left">
                                                <Link
                                                    href={`${URL}/storage/${initialData?.filename}`}
                                                    className="flex border border-red-500 text-red-500 py-2 px-1 rounded-sm w-[200px] items-center justify-center"
                                                    target="_blank"
                                                    download
                                                >
                                                    <FileDown className="w-4 h-4 mr-2"/>Tải xuống hóa đơn
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <span className="text-md font-medium flex">Trạng thái đơn hàng</span>
                                <Separator className="mt-2"/>
                            </CardHeader>
                            <CardContent>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-[2px] bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${((status0==false) && (status5==false)) && "bg-white text-primary"} ${(status0==true) && "bg-cyan-500 border-cyan-500 text-white" } ${(status5==true) && "bg-slate-100 text-primay"} inline-flex items-center justify-center relative z-10`}>
                                    <Loader className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Đang đợi xác nhận
                                    </h2>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-[2px] bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${((status1==false) && (status5==false)) && "bg-white text-primary"} ${(status1==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} inline-flex items-center justify-center relative z-10`}>
                                    <PackageCheck className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Xác nhận đơn hàng
                                    </h2>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-[2px] bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${((status2==false) && (status5==false)) && "bg-white text-primary"} ${(status2==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} inline-flex items-center justify-center relative z-10`}>
                                    <Truck className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Đang giao hàng
                                    </h2>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-[2px] bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${((status3==false) && (status5==false)) && "bg-white text-primary"} ${(status3==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} inline-flex items-center justify-center relative z-10`}>
                                    <PartyPopper className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Đã giao hàng
                                    </h2>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-[2px] bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${((status4==false) && (status5==false)) && "bg-white text-primary"} ${(status4==true) && "bg-cyan-500 border-cyan-500 text-white"}  ${(status5==true) && "bg-slate-100 text-primay"} inline-flex items-center justify-center relative z-10`}>
                                    <Check className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Hoàn thành
                                    </h2>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className={`flex-shrink-0 w-10 h-10 border rounded-full ${(status5==true) ? "bg-red-500 border-red-500 text-white" : "bg-white text-primary"} inline-flex items-center justify-center relative z-10`}>
                                    <X className="w-4 h-4"/>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-primary py-2 tracking-wider">
                                    Hủy đơn
                                    </h2>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-12 gap-x-2">
                        <Card className="col-span-9">
                            <CardHeader>
                                <span className="text-md font-medium flex">Chi tiết đơn hàng</span>
                                <Separator className="mt-2"/>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Hình ảnh</TableHead>
                                            <TableHead className="w-[250px]">Tên sản phẩm</TableHead>
                                            <TableHead className="">Mẫu mã</TableHead>
                                            <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                                            <TableHead className="w-[100px] text-right">Số lượng</TableHead>
                                            <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {initialData?.children_orders.map((child: any, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{ index + 1 }</TableCell>
                                                <TableCell className="text-center">
                                                    <img className="w-12 h-12 object-cover" src={`${child?.product.image.path}`}/>
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    {child.product.name}
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    {
                                                        child.sku && (
                                                            child.sku.property_options.map((option: any) => (
                                                                <>
                                                                    <span key={child.name}>
                                                                        {option.name}
                                                                    </span><br/>
                                                                </>
                                                            ))
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(child.price)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {child.quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Currency value={child.quantity * child.price}/>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <span className="text-md font-medium flex">Cập nhật trạng thái</span>
                            <Separator className="mt-2"/>
                            </CardHeader>
                            <CardContent className="space-y-8">
                            <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái đơn hàng</FormLabel>
                                    <Select
                                        disabled={loading || initialData?.status_code=="-1"}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn trạng thái đơn hàng"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key="dangchoxacnhan" value="0" disabled={(initialData && (parseInt(initialData?.status_code) < 1 && parseInt(initialData?.status_code) != -1)) ? false : true}>
                                                Đang chờ xác nhận
                                            </SelectItem> 
                                            <SelectItem key="dagiaochodvvc" value="1" disabled={(initialData && (parseInt(initialData?.status_code) < 2 && parseInt(initialData?.status_code) != -1)) ? false : true}>
                                                Xác nhận đơn hàng
                                            </SelectItem>
                                            <SelectItem key="danggiaohang" value="2" disabled={(initialData && (parseInt(initialData?.status_code) < 3 && parseInt(initialData?.status_code) != -1)) ? false : true}>
                                                Đang giao hàng
                                            </SelectItem>
                                            <SelectItem key="dagiaohang" value="3" disabled={(initialData && (parseInt(initialData?.status_code) < 4 && parseInt(initialData?.status_code) != -1)) ? false : true}>
                                                Đã giao hàng
                                            </SelectItem>
                                            <SelectItem key="hoanthanh" value="4" disabled={(initialData && (parseInt(initialData?.status_code) < 5 && parseInt(initialData?.status_code) != -1)) ? false : true}>
                                                Hoàn thành
                                            </SelectItem>
                                            <SelectItem key="huydon" value="-1">
                                                Hủy đơn
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                                />
                            <FormField
                            control={form.control}
                            name="status_payment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái thanh toán</FormLabel>
                                    <Select
                                        disabled={loading || initialData?.status_payment_code=="1" || status5==true || status4==true}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn trạng thái thanh toán"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key="chuathanhtoan" value="0">
                                               Chưa thanh toán
                                            </SelectItem>
                                            <SelectItem key="dathanhtoan" value="1">
                                                Đã thanh toán
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                            </CardContent>
                        </Card>
                        <Card className="col-span-12 mt-8">
                            <CardContent className="pt-6">
                                <Table>
                                    <TableBody>
                                        <TableRow key="total">
                                            <TableCell className="font-medium">Tạm tính:</TableCell>
                                            <TableCell className="text-right"><Currency value={initialData?.total2}/></TableCell>
                                        </TableRow>
                                        <TableRow key="discount">
                                            <TableCell className="font-medium">Giảm giá:</TableCell>
                                            <TableCell className="text-right"><Currency value={-initialData?.discount}/></TableCell>
                                        </TableRow>
                                        <TableRow key="finalTotal">
                                            <TableCell className="font-medium">Số tiền khách phải thanh toán:</TableCell>
                                            <TableCell className="text-right"><Currency value={initialData?.total}/></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button variant="outline" onClick={() => router.push('/admin/orders')} className="ml-auto" type="button" disabled={loading}>
                            Hủy
                        </Button>
                    {
                        ((initialData?.status.toString() != ("Hủy đơn"))) && (
                            <Button type="submit" className="ml-2" disabled={loading}>
                                {action}
                            </Button>
                        )
                    }
                    </div>
                </form>
            </Form>
        </>
    );
}

export default OrderForm;