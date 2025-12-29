"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formLogin = z.object({
  email: z.string()
    .min(1, "Email là bắt buộc")
    .email("Phải là email")
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Không đúng định dạng email"),
  password: z.string()
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự"),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "";
  const [errorMessages, setErrorMessages] = useState<{
    CredentialsSignin: string;
    Default: string;
    error: string;
  }>({
    CredentialsSignin: "Sai tài khoản hoặc mật khẩu",
    Default: "Sai tài khoản hoặc mật khẩu",
    error: "",
  });

  const form = useForm<z.infer<typeof formLogin>>({
    resolver: zodResolver(formLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const credentials = form.getValues();
      const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboards";
  
      signIn("credentials", { ...credentials, callbackUrl });
      const session = await getSession();
      if (session?.accessToken) {
        setErrorMessages({
          CredentialsSignin: "",
          Default: "",
          error: "",
        });
        toast.success("Đăng nhập thành công!");
      } else {
        setErrorMessages({
          CredentialsSignin: "Sai tài khoản hoặc mật khẩu",
          Default: "Sai tài khoản hoặc mật khẩu",
          error: error,
        });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 w-[400px] h-auto">
              <CardTitle className="text-2xl">Fstudio - Admin</CardTitle>
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
                      <FormMessage>{error ? errorMessages.CredentialsSignin : ""}</FormMessage>
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
            <Link href="/forgot" className="text-sm text-cyan-500 underline underline-offset-2">Quên mật khẩu?</Link>
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
    </>
  );
}