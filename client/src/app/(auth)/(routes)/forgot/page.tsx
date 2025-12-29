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
  email: z.string()
    .min(1, "Email là bắt buộc")
    .email("Phải là email")
    .max(60, "Bạn chỉ có thể nhập tối đa 60 ký tự.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Không đúng định dạng email"),
});

const URL = process.env.NEXT_PUBLIC_URL_API;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errorEmail, setErrorEmail] = useState('');

  const form = useForm({
    resolver: zodResolver(formLogin),
    defaultValues: {
        email: "",
        },
    });

   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${URL}/api/auth/reset-password?email=${data.email}`);
    if (response.data.statusCode == 200) {
        toast.success(response.data.message);
        router.push('/reset');
    }
    } catch (error: any) {
        if (error.response.data.statusCode == 400) {
            if (error.response.data.message) {
                setErrorEmail(error.response.data.message)
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
                    <CardTitle className="text-2xl">Fstudio - Quên mật khẩu</CardTitle>
                    <CardDescription>
                        Vui lòng cung cấp email để lấy OTP
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
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
                            <FormMessage>{errorEmail??errorEmail}</FormMessage>
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
                        "Gửi"
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