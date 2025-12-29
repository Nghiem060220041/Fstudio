"use client"

import { clientSignIn } from "@/components/server/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useCart from "@/hooks/use-cart";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { Fingerprint, LayoutList, Ticket, Trash2, UserCog2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const URL = process.env.NEXT_PUBLIC_URL_API;

const formLogin = z.object({
  password: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự"),
  password_confirm: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự")
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errorPassword, setErrorPassword] = useState('');
  const cart = useCart();
  
  useEffect(() => {
    const checkLogin = async () => {
    const user = await getCookie('user');
      if (!user) {
        window.location.href = '/user/login';
      }
    }
    checkLogin();
  });

  const form = useForm({
    resolver: zodResolver(formLogin),
    defaultValues: {
        password: "",
        password_confirm: "",
    },
  });
    
   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const user = getCookie('user');
      const user2 = user ? JSON.parse(user) : null;
      const response = await axios.patch(`${URL}/api/customers/update/${user2?.id}/password`, data); 
      if (response.status === 200) {
        deleteCookie('user');
        cart.removeAll();
        toast.success("Cập nhật thành công");
        window.location.reload();
    }
    } catch (error: any) {
        if (error.response.data.statusCode == 400) {
          if (error.response.data.data.password_confirm) {
            setErrorPassword(error.response.data.data.password_confirm[0])
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
              <CardHeader className="space-y-1 w-[800px] h-auto">
                    <div className="grid grid-cols-12">
                      <div className="col-span-6">
                        <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
                        <CardDescription>
                            Cập nhật mật khẩu
                        </CardDescription>
                      </div>
                  <div className="col-span-6 flex justify-end align-middle">
                        <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" type="button" className="ml-2" onClick={()=>(router.push('/user/orders'))}>
                                <LayoutList className="w-4 h-4"/>
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                              <p>Đơn đặt hàng</p>
                              </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {/* <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" type="button" className="ml-2" onClick={()=>(router.push('/user/voucher'))}>
                                    <Ticket className="w-4 h-4"/>
                                  </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                  <p>Voucher</p>
                                  </TooltipContent>
                              </Tooltip>
                      </TooltipProvider> */}
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="ml-2" type="button" onClick={()=>(router.push('/user/profile'))}>
                                <UserCog2 className="w-4 h-4"/>
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                              <p>Thông tin cá nhân</p>
                              </TooltipContent>
                          </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="default" size="icon" className="ml-2" type="button" onClick={()=>(router.push('/user/changepassword'))}>
                                      <Fingerprint className="w-4 h-4"/>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Đổi mật khẩu</p>
                                    </TooltipContent>
                                </Tooltip>
                    </TooltipProvider>
                    {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="destructive" size="icon"className="ml-2">
                                      <Trash2 className="w-4 h-4"/>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Yêu cầu xóa tài khoản</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}
                      </div>
                    </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
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
                 <div className="grid gap-2">
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
                                placeholder="Nhập mật khẩu"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage>{errorPassword ?? errorPassword }</FormMessage>
                            </FormItem>
                        )}
                        />
                    </div>
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
                        "Cập nhật mật khẩu"
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