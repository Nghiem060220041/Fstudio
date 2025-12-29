"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const URL = process.env.NEXT_PUBLIC_URL_API;

const formRegister = z.object({
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
  password: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự"),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPhone, setErrorPhone] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
        const user = await getCookie('user');
          if (user) {
            window.location.href = '/';
          }
        }
        checkLogin();
      });
    
    const form = useForm({
        resolver: zodResolver(formRegister),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            },
        });

    const onSubmit = async(data: z.infer<typeof formRegister>) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${URL}/api/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.statusCode == 200) {
                toast.success(response.data.message);
                router.push('/user/login');
            }
        } catch (error: any) {
            toast.error("Đã xảy ra lỗi");
            if (error.response.data.statusCode == 400) {
                if (error.response.data.data.email) {
                    setErrorEmail(error.response.data.data.email[0])
                }
                if (error.response.data.data.phone) {
                    setErrorPhone(error.response.data.data.phone[0])
                }
            }
        } finally {
        setIsLoading(false);
        }
   }

    return (
        <>
            <div className="flex flex-col items-center justify-center py-12">   
                <Card>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="space-y-1 w-[400px] h-auto">
                        <CardTitle className="text-2xl">Fstudio - Đăng ký</CardTitle>
                        <CardDescription>
                            Vui lòng đăng ký để tiếp tục mua sắm
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
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
                                    disabled={isLoading}
                                    placeholder="Nhập họ tên"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Nhập số điện thoại"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage>{errorPhone && errorPhone}</FormMessage>
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Nhập email"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage>{errorEmail && errorEmail}</FormMessage>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input
                                    type="password"
                                    disabled={isLoading}
                                    placeholder="Nhập mật khẩu"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <Link href="/user/login" className="text-sm text-cyan-500 underline underline-offset-2">Hoặc bạn đã có tài khoản, Đăng nhập</Link>
                        </CardContent>
                        <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                            <Icons.spinner className="h-4 w-4 animate-spin" />
                            ) : (
                            "Đăng ký"
                            )}
                        </Button>
                        </CardFooter>
                    </form>
                    </Form>
                </Card>
            </div>
        </>
    );
    
}