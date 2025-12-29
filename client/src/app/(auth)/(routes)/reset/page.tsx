"use client"

import { clientSignIn } from "@/components/server/login";
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

const formLogin = z.object({
  otp: z.string()
    .min(1, "OTP là bắt buộc")
        .max(6, "Bạn chỉ có thể nhập tối đa 6 ký tự"),
  password: z.string()
    .min(1, "Mật khẩu là bắt buốc")
    .min(8, "Mật khẩu có tối thiểu 8 ký tự")
    .max(20, "Mật khẩu có tối đa 20 ký tự"),
  password_confirm: z.string()
    .min(1, "Xác nhận mật khẩu là bắt buốc")
    .min(8, "Xác nhận mật khẩu có tối thiểu 8 ký tự")
    .max(20, "Xác nhận mật khẩu có tối đa 20 ký tự"),
});

const URL = process.env.NEXT_PUBLIC_URL_API;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errorPassword, setErrorPassword] = useState('');
  const [errorOtp, setErrorOtp] = useState('');

  const form = useForm({
    resolver: zodResolver(formLogin),
    defaultValues: {
        otp: "",
        password: "",
        password_confirm: "",
        },
    });

   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${URL}/api/auth/reset-password`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.data.statusCode == 200) {
        toast.success(response.data.message);
        router.push('/sign-in');
    }
    } catch (error: any) {
        if (error.response.data.statusCode == 400) {
            if (error.response.data.data) {
                if (error.response.data.data.otp) {
                    setErrorOtp(error.response.data.data.otp[0])
                }
                if (error.response.data.data.password_confirm) {
                    setErrorPassword(error.response.data.data.password_confirm[0])
                }
            }
            if (error.response.data.message) {
                setErrorOtp(error.response.data.message)
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
                    <CardTitle className="text-2xl">Fstudio - Đổi mật khẩu</CardTitle>
                    <CardDescription>
                        Vui lòng điền thông tin vào biểu mẫu
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>OTP</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                disabled={isLoading}
                                placeholder="Nhập otp"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage>{errorOtp??errorOtp}</FormMessage>
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
                            <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password_confirm"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                type="password"
                                disabled={isLoading}
                                placeholder="Nhập xác nhận mật khẩu"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage>{errorPassword??errorPassword}</FormMessage>
                            </FormItem>
                        )}
                        />
                    </div>
                    <Link href="/sign-in" className="text-sm text-cyan-500 underline underline-offset-2">Đăng nhập</Link>
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
                        "Xác nhận"
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