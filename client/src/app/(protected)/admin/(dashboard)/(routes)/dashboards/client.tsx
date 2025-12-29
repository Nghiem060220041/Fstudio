"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { OrderChart } from "./components/order-chart";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import Currency from "@/components/client/currency";
import { PaymentChart } from "./components/type-payment";

interface DashboardClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const DashboardClient: React.FC<DashboardClientProps> = ({ }) => {
    const [data, setData] = useState([]);
    const [order, setOrder] = useState([]);
    const [product, setProduct] = useState([]);
    const [totalCurrent, setTotalCurrent] = useState(0);
    const [percentTotal, setPercentTotal] = useState(0);
    const [countOrderCurrent, setCountOrderCurrent] = useState(0);
    const [percentCountOrder, setPercentCountOrder] = useState(0);
    const [customerCurrent, setCustomerCurrent] = useState(0);
    const [percentCustomer, setPercentCustomer] = useState(0);
    const [orderRecent, setOrderRecent] = useState([]);
    const [paymentType, setPaymentType] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const session = await getSession();
            try {
                const [
                    totalRevenueResponse,
                    totalCustomerResponse,
                    totalOrderResponse,
                    overviewResponse,
                    topProductResponse,
                    orderRecentResponse,
                    orderResponse,
                    paymentTypeResponse
                ] = await Promise.all([
                    axios.get(`${URL}/api/revenues/total-revenue`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/total-customer`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/total-order`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/total-revenue-follow-month`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/top-sale-product-follow-month`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/select-order-recent`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/select-order-by-status`, { headers: { Authorization: `Bearer ${session?.accessToken}` } }),
                    axios.get(`${URL}/api/revenues/select-revenue-by-payment-type`, { headers: { Authorization: `Bearer ${session?.accessToken}` } })
                ]);
    
                handleTotalRevenue(totalRevenueResponse);
                handleTotalCustomer(totalCustomerResponse);
                handleTotalOrder(totalOrderResponse);
                handleOverview(overviewResponse);
                handleTopProduct(topProductResponse);
                handleOrderRecent(orderRecentResponse);
                handleOrder(orderResponse);
                handlePaymentType(paymentTypeResponse);
            } catch (error) {
                console.log();
            }
        };
    
        fetchData();
    }, []);

    const handleTotalRevenue = (response:any) => {
        if (response.status === 200) {
            const current  = response.data.dataCurrent;
            const previous = response.data.dataPrevious;
            const percent = ((current - previous) / previous) * 100;
            const roundedPercent = parseFloat(percent.toFixed(1));
    
            setTotalCurrent(current);
            setPercentTotal(roundedPercent);
        } else {
            setTotalCurrent(0);
            setPercentTotal(0);
        }
    };
    
    const handleTotalCustomer = (response:any) => {
        if (response.status === 200) {
            const current  = response.data.dataCurrent;
            const previous = response.data.dataPrevious;
            const percent = ((current - previous) / previous) * 100;
            const roundedPercent = parseFloat(percent.toFixed(1));
    
            setCustomerCurrent(current);
            setPercentCustomer(roundedPercent);
        } else {
            setCustomerCurrent(0);
            setPercentCustomer(0);
        }
    };
    
    const handleTotalOrder = (response:any) => {
        if (response.status === 200) {
            const current  = response.data.dataCurrent;
            const previous = response.data.dataPrevious;
            const percent = ((current - previous) / previous) * 100;
            const roundedPercent = parseFloat(percent.toFixed(1));
    
            setCountOrderCurrent(current);
            setPercentCountOrder(roundedPercent);
        } else {
            setCountOrderCurrent(0);
            setPercentCountOrder(0);
        }
    };
    
    const handleOverview = (response:any) => {
        if (response.status === 200) {
            const overviewData = response.data;
    
            setData(overviewData.data);
        } else {
            setData([]);
        }
    };
    
    const handleTopProduct = (response:any) => {
        if (response.status === 200) {
            const topProductData = response.data;
    
            setProduct(topProductData.data);
        } else {
            setProduct([]);
        }
    };
    
    const handleOrderRecent = (response:any) => {
        if (response.status === 200) {
            const orderRecentData = response.data;
    
            setOrderRecent(orderRecentData.data);
        } else {
            setOrderRecent([]);
        }
    };
    
    const handleOrder = (response:any) => {
        if (response.status === 200) {
            const orderData = response.data;
    
            setOrder(orderData.data);
        } else {
            setOrder([]);
        }
    };
    
    const handlePaymentType = (response:any) => {
        if (response.status === 200) {
            const paymentTypeData = response.data;
    
            setPaymentType(paymentTypeData.data);
        } else {
            setPaymentType([]);
        }
    };    

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Doanh thu tháng này
                </CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCurrent)}       
                </div>
                <p className="text-xs text-muted-foreground">
                    { percentTotal > 0 ? "+" + percentTotal : percentTotal }% so với tháng trước
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                   Số khách hàng
                </CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+{ customerCurrent}</div>
                <p className="text-xs text-muted-foreground">
                { percentCustomer > 0 ? "+" + percentCustomer : percentCustomer }% so với tháng trước
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số đơn hàng tháng này</CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                </svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{countOrderCurrent}
                </div>
                <p className="text-xs text-muted-foreground">
                { percentCountOrder > 0 ? "+" + percentCountOrder : percentCountOrder }% so với tháng trước
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Lượt truy cập
                </CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                    +201 kể từ giờ trước
                </p>
                </CardContent>
            </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                <CardTitle>Tổng quan doanh thu theo tháng</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Overview data={ data } />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                <CardTitle>Top 5 sản phẩm bán chạy nhất tháng</CardTitle>
                </CardHeader>
                <CardContent>
                <RecentSales product={ product }/>
                </CardContent>
            </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            <Card className="col-span-4">
                <CardHeader>
                <CardTitle>Tổng quan đơn đặt hàng</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderChart order={ order } />
                </CardContent>
            </Card>
            <Card className="col-span-8">
                <CardHeader>
                <CardTitle>Đơn đặt hàng gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">#</TableHead>
                            <TableHead className="">Khách hàng</TableHead>
                            <TableHead className="">Ngày đặt</TableHead>
                            <TableHead className="text-right">Tổng tiền</TableHead>
                        </TableRow>
                        </TableHeader> 
                        <TableBody>
                            {
                                orderRecent ? (
                                    orderRecent.map((recent: Order) => (
                                        <TableRow key={recent?.code}>
                                            <TableCell className="font-medium">{ recent?.code }</TableCell>
                                            <TableCell className="text-left">
                                                { recent?.customer.name }
                                            </TableCell>
                                            <TableCell className="">
                                                { recent?.createdAt }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Currency value={recent?.total}/>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    ) 
                                ) : "Không có đơn đặt hàng gần đây."
                            }
                        </TableBody>        
                    </Table>
                </CardContent>
            </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            <Card className="col-span-12">
                <CardHeader>
                        <CardTitle>Tổng quan doanh thu theo hình thức thanh toán</CardTitle>
                        
                </CardHeader>
                <CardContent>
                    <PaymentChart payment={ paymentType } />
                </CardContent>
            </Card>
            </div>
        </div>
    );
}