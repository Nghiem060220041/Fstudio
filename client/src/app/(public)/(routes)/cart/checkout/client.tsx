"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useCart from "@/hooks/use-cart";
import { Icons } from "@/lib/icons";
import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import { CheckIcon, ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import SummaryCheckout from "../components/summary-checkout";

const URL = process.env.NEXT_PUBLIC_URL_API;

const formOrder = z.object({
  name: z.string()
    .min(1, "Tên là bắt buộc")
    .min(6, "Tối thiểu 6 ký tự")
    .max(50, "Bạn chỉ có thể nhập tối đa 50 ký tự."),
  phone: z.string()
    .min(1, "Điện thoại là bắt buộc")
    .min(10, "Tối thiểu 10 ký tự")
    .max(15, "Bạn chỉ có thể nhập tối đa 15 ký tự.")
    .regex(/^[0-9]{10,15}$/, "Không đúng định dạng số điện thoại"),
  email: z.string()
    .min(1, "Email là bắt buộc")
    .email("Phải là email")
    .max(60, "Bạn chỉ có thể nhập tối đa 60 ký tự.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Không đúng định dạng email"),
  address: z.string()
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự.").optional(),
  description: z.string()
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự.").optional(),
  cart: z.any(),
});

interface CheckoutCLientProps {
}

export const CheckoutClient: React.FC<CheckoutCLientProps> = ({ }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = getCookie('user');
    const [customerId, setCustomerId] = useState("");
    const cart = useCart();
    const removeAll = useCart((state) => state.removeAll);
    const [typePayment, setTypePayment] = useState("0"); 
    const [discount, setDiscount] = useState(0); 
    const [couponCode, setCouponCode] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [errorProduct, setErrorProduct] = useState('');
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formOrder),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            description: "",
        },
    });
    const onSubmit = async(data: z.infer<typeof formOrder>,) => {
        try {
            setIsLoading(true);
            const carts = cart.items;
            const datas = {
                ...data,
                carts,
                customerId,
                typePayment,
                ...(discount !== 0 ? { couponCode } : {})
            };
            const response = await axios.post(`${URL}/api/orders`, datas, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status == 200) {
                removeAll();
                toast.success("Đặt hàng thành công!");
                router.push(`/order/${response.data.code}`);
            }
        } catch (error: any) {
            if (error.response.data.statusCode == 400) {
                if (error.response.data.message) {
                    setErrorProduct(error.response.data.message);
                    setDiscount(0);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            const userParse = JSON.parse(user);
            form.setValue("name", userParse.name);
            form.setValue("email", userParse.email);
            form.setValue("phone", userParse.phone);
            setCustomerId(userParse.id);
        }
    }, [user]);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            if (couponCode == "") {
                return setErrorCode("Vui lòng cung cấp mã giảm giá.");
            } else {
                const user = await getCookie('user');
                const usr  = JSON.parse(user);
                const response = await axios.get(`${URL}/api/orders/status-payment/check-coupon/${usr.id}/${couponCode}`);
                if (response.status == 200) {
                    setDiscount(response.data.data);
                    setErrorCode(response.data.message);
                } 
            }
        } catch (error: any) {
            if (error.response.data.statusCode == 400) {
                if (error.response.data.message) {
                    setErrorCode(error.response.data.message);
                    setDiscount(0);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Thông tin liên hệ</h1>
                <p className="text-sm">Vui lòng cung cấp thông tin liên hệ để chúng tôi giao hàng đến cho bạn.</p>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                    <div className="lg:col-span-7">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Họ tên</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập họ tên"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập số điện thoại"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập email"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Địa chỉ nhận hàng</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Nhập địa chỉ nhận hàng"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                                </div>
                            <div className="w-full">
                            <h2 className="text-xl font-semibold py-4">MÃ GIẢM GIÁ</h2>
                            <Card>
                                <CardContent className="flex mt-6">
                                    <div className="w-full grid grid-cols-12 grap-x-4">
                                    <div className="mr-2 col-span-9">
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <UncontrolledFormMessage className="py-2">{ errorCode && errorCode }</UncontrolledFormMessage>
                                    </div>
                                    <Button variant="default" className="col-span-3" type="button" onClick={handleClick}>
                                        Áp dụng
                                    </Button>     
                                    </div>
                                </CardContent>  
                            </Card>
                        </div>
                        <div className="w-full">
                            <h2 className="text-xl font-semibold py-4">PHƯƠNG THỨC THANH TOÁN</h2>
                            <RadioGroup
                                value={typePayment}
                                onChange={setTypePayment}
                            >
                                <RadioGroup.Option
                                key="COD"
                                value="0"
                                    className={({ active, checked }) =>
                                    `${checked ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-primary' : ''}
                                    relative flex cursor-pointer rounded-lg px-5 py-4 border focus:outline-none w-full mb-4`
                                }
                                >
                                {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`font-medium text-gray-900 flex`}
                                            >
                                                <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2">
<path d="M19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V18C21 19.1046 20.1046 20 19 20Z" stroke="currentColor" />
<path d="M16.5 14C16.2239 14 16 13.7761 16 13.5C16 13.2239 16.2239 13 16.5 13C16.7761 13 17 13.2239 17 13.5C17 13.7761 16.7761 14 16.5 14Z" fill="currentColor" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 7V5.60322C18 4.28916 16.7544 3.33217 15.4847 3.67075L4.48467 6.60409C3.60917 6.83756 3 7.63046 3 8.53656V9" stroke="currentColor" />
</svg>
COD (Thanh toán khi nhận hàng)
                                            </RadioGroup.Label>
                                            </div>
                                    </div>
                                    {checked && (
                                        <div className="shrink-0 bg-primary rounded-full">
                                            <CheckIcon className="h-5 w-5 text-white p-1" />
                                        </div>
                                    )}
                                    </div>
                                )}
                                </RadioGroup.Option>
                                <RadioGroup.Option
                                key="VNPAY"
                                value="1"
                                className={({ active, checked }) =>
                                    `${checked ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-primary' : ''}
                                    relative flex cursor-pointer rounded-lg px-5 py-4 border focus:outline-none w-full mb-4`
                                }
                                >
                                {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium text-gray-900 flex`}
                                        >
                                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2"><g fill="none" stroke="#000" stroke-linejoin="round"><path d="m28.6222 37.7222 14.4444-14.4444c.5778-.5778.5778-1.7333 0-2.3111l-8.6667-8.6667c-.5778-.5778-1.7333-.5778-2.3111 0l-6.3556 6.3556-9.2444-9.2444c-.5778-.5778-1.7333-.5778-2.3111 0l-9.2444 9.2444c-.5778.5778-.5778 1.7333 0 2.3111l16.7556 16.7556c1.7333 1.7333 5.2 1.7333 6.9333 0z"/><g stroke-linecap="round"><path d="m25.7333 18.6556-8.0889 8.0889c-2.3111 2.3111-4.6222 2.3111-6.9333 0"/><path d="m18.2222 30.7889c-1.1556 1.1556-2.3111 1.1556-3.4667 0m22.5333-15.6c-1.262-1.1556-2.8889-.5778-4.0444.5778l-15.0222 15.0222"/><path d="m18.2222 15.7667c-4.6222-4.6222-10.4 1.1556-5.7778 5.7778l5.2 5.2-5.2-5.2"/><path d="m23.4222 20.9667-4.0444-4.0444"/><path d="m21.6889 22.7-4.6222-4.6222c-.5778-.5778-1.4444-1.4444-2.3111-1.1556"/><path d="m14.7556 20.3889c-.5778-.5778-1.4444-1.4444-1.1556-2.3111m5.7778 6.9333-4.6222-4.6222"/></g></g></svg>
                                            VNPAY
                                        </RadioGroup.Label>
                                        </div>
                                    </div>
                                    {checked && (
                                        <div className="shrink-0 bg-primary rounded-full">
                                            <CheckIcon className="h-5 w-5 text-white p-1" />
                                        </div>
                                    )}
                                    </div>
                                )}
                                </RadioGroup.Option>
                                <RadioGroup.Option
                                key="MOMO"
                                value="2"
                                disabled
                                className={({ active, checked }) =>
                                    `${checked ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-primary' : ''}
                                    relative flex cursor-pointer rounded-lg px-5 py-4 border focus:outline-none w-full mb-4 bg-slate-50`
                                }
                                >
                                {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium text-gray-900 flex`}
                                        >
                                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"><circle cx="34.5709" cy="13.4286" r="7.9291"/><path d="m5.5008 21.3573v-11.8915c0-1.9849 1.8504-3.964 3.9644-3.964 2.1186 0 3.9644 1.9783 3.9644 3.964v11.8915"/><path d="m13.4288 9.4648c0-1.9849 1.8504-3.964 3.9644-3.964 2.1186 0 3.9644 1.9783 3.9644 3.964v11.8915"/><path d="m5.5 42.5v-11.8925c0-1.985 1.8504-3.9642 3.9644-3.9642 2.1186 0 3.9644 1.9784 3.9644 3.9642v11.8925"/><path d="m13.4288 30.6075c0-1.985 1.8504-3.9642 3.9644-3.9642 2.1186 0 3.9644 1.9784 3.9644 3.9642v11.8925"/><circle cx="34.5709" cy="34.5714" r="7.9291"/></g></svg>
                                            MOMO (Đang bảo trì)
                                        </RadioGroup.Label>
                                        </div>
                                    </div>
                                    {checked && (
                                        <div className="shrink-0 bg-primary rounded-full">
                                            <CheckIcon className="h-5 w-5 text-white p-1" />
                                        </div>
                                    )}
                                    </div>
                                )}
                                </RadioGroup.Option>
                            </RadioGroup>  
                        </div>
                        <div className="grid grid-cols-12 gap-x-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-8 col-span-6"
                            disabled={isLoading}
                            onClick={()=>router.push('/')}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2"/> Tiếp tục mua sắm
                        </Button>
                        <Button
                            type="submit"
                            className="w-full mt-8 col-span-6"
                            disabled={isLoading || cart.items.length==0}
                        >
                            {isLoading ? (
                            <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <ShoppingBag className="h-4 w-4 mr-2"/>   
                            )}
                            Đặt hàng
                        </Button>
                        </div>   
                    </form>
                    </Form>
                    </div>
                    <SummaryCheckout discount={discount} message={ errorProduct } />
                </div>
            </div>
        </>
    );
}