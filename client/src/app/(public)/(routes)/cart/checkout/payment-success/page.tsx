"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card-update";
import axios from "axios";
import { ChevronLeft, PartyPopper, X } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const URL = process.env.NEXT_PUBLIC_URL_API;

export default async function SuccessPage({ }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        const checkResponse = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/orders/vnpay/v2/vnpay-ipn?${new URLSearchParams(searchParams).toString()}`, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });
        
            } catch (error: any) {
                if (error.response.data.statusCode == 400) {
                    if (error.response.data.message) {
                        return (
                            <>
                            <div className="flex flex-col items-center justify-center py-12">   
                                <Card className="grid w-[400px] place-items-center">
                                    <CardHeader>
                                        <div className="grid h-20 w-20 rounded-full place-items-center bg-muted">
                                            <X className="w-10 h-10 text-red-500"/>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-semibold">Thanh toán thất bại!</span>
                                            <p className="text-sm">{error.response.data.message}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="grid grid-cols-12 gap-x-4 w-full">
                                                <Button variant="outline" className="col-span-12" type="button" onClick={() => { router.push('/') }}>
                                                <ChevronLeft className="w-4 h-4 mr-2"/>Tiếp tục mua sắm
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                            </>
                        );
                    }
                }
            }
        }

        checkResponse();
    }, [searchParams]);


    return (
        <>
        <div className="flex flex-col items-center justify-center py-12">   
            <Card className="grid w-[400px] place-items-center">
                <CardHeader>
                    <div className="grid h-20 w-20 rounded-full place-items-center bg-muted">
                        <PartyPopper className="w-10 h-10 text-emerald-400"/>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-semibold">Thanh toán thành công!</span>
                    <p className="text-sm">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn sẽ được chúng tôi xử lý trong thời gian sớm nhất.</p>
                </CardContent>
                <CardFooter>
                    <div className="grid grid-cols-12 gap-x-4 w-full">
                            <Button variant="outline" className="col-span-12" type="button" onClick={() => { router.push('/') }}>
                            <ChevronLeft className="w-4 h-4 mr-2"/>Tiếp tục mua sắm
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
        </>
    );
  }