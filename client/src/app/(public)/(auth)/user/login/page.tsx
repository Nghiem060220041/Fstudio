"use client"

import { clientSignIn } from "@/components/server/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
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
  password: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự"),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errorEmail, setErrorEmail] = useState('');
  
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
    resolver: zodResolver(formLogin),
    defaultValues: {
        name: "",
        phone: "",
        email: "",
        password: "",
        },
    });

   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const res = await clientSignIn(data) || "";
      if(res==""){
        toast.success("Đăng nhập thành công");
        window.location.href = '/';
      }

      if (res && res?.response.data.statusCode == 400 && res?.response.data.message) {
        setErrorEmail(res?.response.data.message);
        return;
      }
    } catch (error: any) {
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
                    <CardTitle className="text-2xl">Fstudio - Đăng nhập</CardTitle>
                    <CardDescription>
                        Vui lòng đăng nhập để tiếp tục
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
                    <Link href="/user/register" className="text-sm text-cyan-500 underline underline-offset-2">Đăng ký nếu chưa có tài khoản tại đây</Link>
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
                        "Đăng nhập"
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