"use client"
import { OrdersTableShellPublic } from "@/components/common/orders-table-shell-public";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Order } from "@/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Fingerprint, Heart, LayoutList, Ticket, Trash2, UserCog2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OrdersApiResponse {
  data: Order[] | null;
  meta: {
    total: number;
  };
}

interface OrderClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any,
        status: any,
        payment_type: any,
        status_payment: any,
    }
  }

export const OrderClient: React.FC<OrderClientProps> = ({ params }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
      const checkLogin = async () => {
      const user = await getCookie('user');
        if (!user) {
          window.location.href = '/user/login';
        }
      }
      checkLogin();
    });
  
    const user = getCookie('user');
    const user2 = user ? JSON.parse(user) : null
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${URL}/api/orders/index/${user2?.id}`, {
                    params,
                });
                if (response.status === 200) {
                    const data = response.data;
                    setOrders(data.data);
                    setTotal(data.meta.total);
                }
            } catch (error) {
            }
        };

        fetchOrders();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);
    
    return (
        <>
          <div className="flex flex-col items-center justify-center py-12">   
              <Card>
                <CardHeader className="space-y-1 w-[1070px] h-auto">
                      <div className="grid grid-cols-12">
                        <div className="col-span-6">
                          <CardTitle className="text-2xl">Lịch sử đặt hàng</CardTitle>
                          <CardDescription>
                              Danh sách đơn đặt hàng gần đây
                          </CardDescription>
                        </div>
                    <div className="col-span-6 flex justify-end align-middle">
                          <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button variant="default" size="icon" className="ml-2" type="button" onClick={()=>(router.push('/user/orders'))}>
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
                                    <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/voucher'))}>
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
                                <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/profile'))}>
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
                              <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/changepassword'))}>
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
                        <OrdersTableShellPublic
                          data={orders}
                          pageCount={pageCount}
                        />
                        </CardContent>
                        <CardFooter>
                      </CardFooter>
              </Card>
          </div>
      </>
    );
  }