"use client"

import Currency from "@/components/client/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types";
import axios from "axios";
import { Check, FileDown, Loader, PackageCheck, PartyPopper, Truck, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OrderClientProps {
}

export const OrderClient: React.FC<OrderClientProps> = async ({ }) => {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const status: number[] = [0, 1, 2, 3, 4];
    const [status0, setStatus0] = useState(false);
    const [status1, setStatus1] = useState(false);
    const [status2, setStatus2] = useState(false);
    const [status3, setStatus3] = useState(false);
    const [status4, setStatus4] = useState(false);
    const [status5, setStatus5] = useState(false);

    if (params.code !== '') {
        useEffect(() => {
            const fetchRole = async () => {
                try {
                    const response = await axios.get(`${URL}/api/orders/search-order/${params.code}`);
      
                    if (response.status === 200) {
                        const data = response.data;
                        setOrder(data.data);
                    } else {
                        setOrder(null);
                    }
                } catch (error) {
                }
            };
      
            fetchRole();
            if (order) {
                if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                    if (parseInt(order?.status_code) >= 0) {
                        setStatus0(true);
                    }
                }
                if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                    if (parseInt(order?.status_code) >= 1) {
                        setStatus1(true);
                    }
                }
                if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                    if (parseInt(order?.status_code) >= 2) {
                        setStatus2(true);
                    }
                }
                if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                    if (parseInt(order?.status_code) >= 3) {
                        setStatus3(true);
                    }
                }
                if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                    if (parseInt(order?.status_code) >= 4) {
                        setStatus4(true);
                    }
                }
                if ((status.indexOf(parseInt(order?.status_code)) === -1)) {
                    setStatus5(true);
                }
            }
        }, []);
    }

    useEffect(() => {
        if (order) {
            if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                if (parseInt(order?.status_code) >= 0) {
                    setStatus0(true);
                }
            }
            if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                if (parseInt(order?.status_code) >= 1) {
                    setStatus1(true);
                }
            }
            if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                if (parseInt(order?.status_code) >= 2) {
                    setStatus2(true);
                }
            }
            if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                if (parseInt(order?.status_code) >= 3) {
                    setStatus3(true);
                }
            }
            if ((status.indexOf(parseInt(order?.status_code)) !== -1)) {
                if (parseInt(order?.status_code) >= 4) {
                    setStatus4(true);
                }
            }
            if ((status.indexOf(parseInt(order?.status_code)) === -1)) {
                setStatus5(true);
            }
        }
    }, [order]);

    const handlePayment = async () => {
        try {
            const response = await axios.get(`${URL}/api/orders/vnpay/${params.code}`);
            if (response.status == 200) {
                window.location.href = response.data.url;
            } 
        } catch (error: any) {
            
        }
    };
    
    const handleCancelOrder = async () => {
        try {
            const response = await axios.get(`${URL}/api/orders/status-order/cancelled/${params.code}`);
            if (response.status == 200) {
                toast.success("Hủy đặt hàng thành công.");
                window.location.reload();
            } 
        } catch (error: any) {
            
        }
    };
    
    const handleReceiveOrder = async () => {
    };

    return (
        <>
            <div className="sm:px-6 lg:px-8">
                <h2 className="text-xl uppercase font-semibold text-center pb-8">Chi tiết đơn đặt hàng #{ order?.code }</h2>
                <Card>
                    <CardHeader>
                        <div className="grid gap-8 row-gap-0 lg:grid-cols-6">
                            <div className="relative text-center">
                                <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${((status0==false) && (status5==false)) && "bg-indigo-50"} ${(status0==true) && "bg-cyan-500 border-cyan-500 text-white" } ${(status5==true) && "bg-slate-100 text-primay"} sm:w-20 sm:h-20`}>
                                <Loader className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Đang đợi xác nhận</h6>
                            <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
                                <svg
                                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                >
                                <line
                                    fill="none"
                                    strokeMiterlimit="10"
                                    x1="2"
                                    y1="12"
                                    x2="22"
                                    y2="12"
                                />
                                <polyline
                                    fill="none"
                                    strokeMiterlimit="10"
                                    points="15,5 22,12 15,19 "
                                />
                                </svg>
                            </div>
                            </div>
                            <div className="relative text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${((status1==false) && (status5==false)) && "bg-indigo-50"} ${(status1==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} sm:w-20 sm:h-20`}>
                                <PackageCheck className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Đã được xác nhận</h6>
                            <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
                                <svg
                                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                >
                                <line
                                    fill="none"
                                    strokeMiterlimit="10"
                                    x1="2"
                                    y1="12"
                                    x2="22"
                                    y2="12"
                                />
                                <polyline
                                    fill="none"
                                    strokeMiterlimit="10"
                                    points="15,5 22,12 15,19 "
                                />
                                </svg>
                            </div>
                            </div>
                            <div className="relative text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${((status2==false) && (status5==false)) && "bg-indigo-50"} ${(status2==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} sm:w-20 sm:h-20`}>
                                <Truck className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Đang giao hàng</h6>
                            <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
                                <svg
                                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                >
                                <line
                                    fill="none"
                                    strokeMiterlimit="10"
                                    x1="2"
                                    y1="12"
                                    x2="22"
                                    y2="12"
                                />
                                <polyline
                                    fill="none"
                                    strokeMiterlimit="10"
                                    points="15,5 22,12 15,19 "
                                />
                                </svg>
                            </div>
                            </div>
                            <div className="relative text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${((status3==false) && (status5==false)) && "bg-indigo-50"} ${(status3==true) && "bg-cyan-500 border-cyan-500 text-white"} ${(status5==true) && "bg-slate-100 text-primay"} sm:w-20 sm:h-20`}>
                                <PartyPopper className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Đã giao hàng</h6>
                                <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
                                <svg
                                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                >
                                <line
                                    fill="none"
                                    strokeMiterlimit="10"
                                    x1="2"
                                    y1="12"
                                    x2="22"
                                    y2="12"
                                />
                                <polyline
                                    fill="none"
                                    strokeMiterlimit="10"
                                    points="15,5 22,12 15,19 "
                                />
                                </svg>
                            </div>
                            </div>
                            <div className="relative text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${((status4==false) && (status5==false)) && "bg-indigo-50"} ${(status4==true) && "bg-cyan-500 border-cyan-500 text-white"}  ${(status5==true) && "bg-slate-100 text-primay"} sm:w-20 sm:h-20`}>
                                <Check className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Hoàn thành</h6>
                                <div className="top-0 right-0 flex items-center justify-center h-24 lg:-mr-8 lg:absolute">
                                <svg
                                className="w-8 text-gray-700 transform rotate-90 lg:rotate-0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                >
                                <line
                                    fill="none"
                                    strokeMiterlimit="10"
                                    x1="2"
                                    y1="12"
                                    x2="22"
                                    y2="12"
                                />
                                <polyline
                                    fill="none"
                                    strokeMiterlimit="10"
                                    points="15,5 22,12 15,19 "
                                />
                                </svg>
                            </div>
                            </div>
                            <div className="relative text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${(status5==true) ? "bg-red-500 border-red-500 text-white" : "bg-indigo-50"} sm:w-20 sm:h-20`}>
                                <X className="w-8 h-8"/>
                            </div>
                            <h6 className="text-md font-extrabold">Hủy đơn</h6>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow key="address">
                                    <TableCell className="font-medium">Giao hàng đến:</TableCell>
                                    <TableCell className="text-left">{ order?.address }</TableCell>
                                </TableRow>
                                <TableRow key="dateorder">
                                    <TableCell className="font-medium">Ngày đặt hàng:</TableCell>
                                    <TableCell className="text-left">{ order?.createdAt }</TableCell>
                                </TableRow>
                                <TableRow key="customer">
                                    <TableCell className="font-medium">Người nhận:</TableCell>
                                    <TableCell className="text-left">{ order?.customer.name }</TableCell>
                                </TableRow>
                                <TableRow key="phone">
                                    <TableCell className="font-medium">Điện thoại:</TableCell>
                                    <TableCell className="text-left">{ order?.customer.phone }</TableCell>
                                </TableRow>
                                <TableRow key="email">
                                    <TableCell className="font-medium">Email:</TableCell>
                                    <TableCell className="text-left">{ order?.customer.email }</TableCell>
                                </TableRow>
                                <TableRow key="typepayment">
                                    <TableCell className="font-medium">Hình thức thanh toán:</TableCell>
                                    <TableCell className="text-left">{ order?.payment_type }</TableCell>
                                </TableRow>
                                <TableRow key="statuspayment">
                                    <TableCell className="font-medium">Trạng thái thanh toán:</TableCell>
                                    <TableCell className="text-left">{ order?.status_payment }</TableCell>
                                </TableRow>
                                <TableRow key="datepayment">
                                    <TableCell className="font-medium">Ngày thanh toán:</TableCell>
                                    <TableCell className="text-left">{ order?.paymentAt }</TableCell>
                                </TableRow>
                                <TableRow key="desc">
                                    <TableCell className="font-medium">Ghi chú:</TableCell>
                                    <TableCell className="text-left">{ order?.description }</TableCell>
                                </TableRow>
                                <TableRow key="invoice">
                                    <TableCell className="font-medium">Hóa đơn điện tử:</TableCell>
                                    <TableCell className="text-left">
                                        <Link
                                            href={`${URL}/storage/${order?.filename}`}
                                            className="flex border border-red-500 text-red-500 py-2 px-1 rounded-sm w-[200px] items-center justify-center"
                                            target="_blank"
                                            download
                                        >
                                            <FileDown className="w-4 h-4 mr-2"/>Tải xuống hóa đơn
                                        </Link>
                                    </TableCell>
                                </TableRow>
                                <TableRow key="total">
                                <TableCell className="font-medium">Tạm tính:</TableCell>
                                <TableCell className="text-right"><Currency value={order?.total2}/></TableCell>
                            </TableRow>
                            <TableRow key="discount">
                                <TableCell className="font-medium">Giảm giá:</TableCell>
                                <TableCell className="text-right"><Currency value={-order?.discount}/></TableCell>
                            </TableRow>
                            <TableRow key="finalTotal">
                                <TableCell className="font-medium">Số tiền khách phải thanh toán:</TableCell>
                                <TableCell className="text-right"><Currency value={order?.total}/></TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <div className="grid grid-cols-12 gap-y-4 w-full">
                        {
                            !status5 && !status4 && (
                                <>
                                    {(order?.payment_type == "VNPAY") && (order?.status_payment == "Chưa thanh toán") && (
                                        <Button variant="outline" className="col-span-12" type="button" onClick={handlePayment}>
                                            Thanh toán
                                        </Button>
                                    )}

                                    {order?.status_code == "0" && (
                                        <Button variant="destructive" className="col-span-12" type="button" onClick={handleCancelOrder}>
                                            Hủy đơn
                                        </Button>
                                    )}

                                    {order?.status_code != "0" && (
                                        <Button className="col-span-12" type="button" onClick={handleReceiveOrder}>
                                            Đã nhận hàng
                                        </Button>
                                    )}
                                </>
                            )
                        }
                        </div>
                    </CardFooter>
                </Card>
                <Card className="mt-8">
                    <CardHeader>
                        <span className="text-md font-medium flex">Chi tiết đơn hàng</span>
                        <Separator className="mt-2"/>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="w-[100px]">Hình ảnh</TableHead>
                                    <TableHead className="w-[250px]">Tên sản phẩm</TableHead>
                                    <TableHead className="">Mẫu mã</TableHead>
                                    <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                                    <TableHead className="w-[100px] text-right">Số lượng</TableHead>
                                    <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order?.children_orders.map((child: any, index:number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{ index + 1 }</TableCell>
                                        <TableCell className="text-center">
                                            <img className="w-12 h-12 object-cover" src={`${child?.product.image.path}`}/>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            {child.product.name}
                                        </TableCell>
                                        <TableCell className="text-left">
                                            {
                                                child.sku && (
                                                    child.sku.property_options.map((option: any) => (
                                                        <>
                                                            <span key={child.name}>
                                                                {option.name}
                                                            </span><br/>
                                                        </>
                                                    ))
                                                )
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(child.price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {child.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Currency value={child.quantity * child.price}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
           </div>         
        </>
    );
}