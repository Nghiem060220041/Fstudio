"use client"

import { AlertModal } from "@/components/modals/alert-modal";
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
import { Fingerprint, Ticket, LayoutList, Trash2, UserCog2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const URL = process.env.NEXT_PUBLIC_URL_API;

const formLogin = z.object({
  name: z.string()
    .min(1, "Tên là bắt buộc")
    .min(6, "Tối thiểu 6 ký tự")
        .max(50, "Bạn chỉ có thể nhập tối đa 50 ký tự."),
  address: z.any(),
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
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const [open, setOpen] = useState(false);    
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  
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
        name: "",
        address: "",
        phone: "",
        email: "",
    },
  });
    
   useEffect(() => {
    const user = getCookie('user');
    if (user) {
        const userParse = JSON.parse(user);
        form.setValue("name", userParse.name);
        form.setValue("email", userParse.email);
        form.setValue("phone", userParse.phone);
        form.setValue("address", userParse.address);
    }
  }, []);

   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const user = getCookie('user');
      const user2 = user ? JSON.parse(user) : null;
      const customer = user2?.id;
      const datas = {
        ...data,
        customer
      }
      const response = await axios.put(`${URL}/api/customers/update/${user2?.id}/FE`, datas); 
    if (response.status === 200) {
        router.push('/user/profile');
        toast.success("Cập nhật thành công");
    }
    } catch (error: any) {
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

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const user = getCookie('user');
      const user2 = user ? JSON.parse(user) : null;
        const response = await axios.delete(`${URL}/api/customers/update/${user2?.id}/delete`)
        if (response.status === 200) {
            toast.success("Xóa thành công");
            deleteCookie('user');
          cart.removeAll();
          window.location.reload();
        }
    } catch (error) {
        toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
        setOpen(false);
    }
};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={ onDelete }
        loading={isLoading} />
        <div className="flex flex-col items-center justify-center py-12">   
            <Card>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="space-y-1 w-[800px] h-auto">
                    <div className="grid grid-cols-12">
                      <div className="col-span-6">
                        <CardTitle className="text-2xl">Thông tin tài khoản</CardTitle>
                        <CardDescription>
                            Cập nhật thông tin cá nhân
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
                              <Button variant="default" size="icon"  type="button" className="ml-2" onClick={()=>(router.push('/user/profile'))}>
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
                                    <Button variant="outline" size="icon" type="button" className="ml-2" onClick={()=>(router.push('/user/changepassword'))}>
                                      <Fingerprint className="w-4 h-4"/>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Đổi mật khẩu</p>
                                    </TooltipContent>
                                </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="destructive" type="button" size="icon"className="ml-2"  onClick={() => setOpen(true)}>
                                      <Trash2 className="w-4 h-4"/>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Yêu cầu xóa tài khoản</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                      </div>
                    </div>
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
                            <FormMessage/>
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
                            <FormLabel>Điện thoại</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                disabled={isLoading}
                                placeholder="Nhập số điện thoại"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage>{errorPhone??errorPhone}</FormMessage>
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
                            <FormMessage>{errorEmail??errorEmail}</FormMessage>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                disabled={isLoading}
                                placeholder="Nhập địa chỉ"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
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
                        "Cập nhật thông tin"
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