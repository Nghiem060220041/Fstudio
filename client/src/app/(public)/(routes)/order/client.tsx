"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Order } from "@/types";
import axios from "axios";
import { Search } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Currency from "@/components/client/currency";
import Link from "next/link";
import { useRouter } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface SearchOrderClientProps {
}

export const SearchOrderClient: React.FC<SearchOrderClientProps> = ({ }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [orderCode, setOrderCode] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            if (orderCode == "") {
                return setErrorCode("Vui lòng cung cấp mã đơn hàng.");
            } else {
                const response = await axios.get(`${URL}/api/orders/search-order/${orderCode}`);
                if (response.status === 200) {
                    const data = response.data;
                    setOrder(data.data);
                    setErrorCode(data.data.message);
                } else {
                    setOrder(null);
                }
            }
        } catch (error: any) {
            if (error.response.data.statusCode == 400) {
                if (error.response.data.message) {
                    setErrorCode(error.response.data.message)
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="sm:px-6 lg:px-8">
                <h2 className="text-xl uppercase font-semibold text-center pb-8">Tra cứu đơn đặt hàng</h2>
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-12 pt-6">
                            <div className="col-span-9 mr-2">
                            <Input
                                disabled={isLoading}
                                placeholder="Nhập mã đơn đặt hàng"
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value)}
                            />
                            <p className="text-destructive py-2 text-sm">{errorCode && errorCode}</p>
                            </div>
                            <Button disabled={isLoading} variant="default" className="col-span-3" type="button" onClick={handleSearch}>
                                <Search className="w-4 h-4 mr-2"/> Tìm kiếm
                            </Button>   
                        </div>
                        <div className="mt-8">
                            {order ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="">#</TableHead>
                                                <TableHead className="">Khách hàng</TableHead>
                                                <TableHead className="">Ngày đặt</TableHead>
                                                <TableHead className="text-right">Tổng tiền</TableHead>
                                                <TableHead className=""></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow key={order?.code}>
                                                <TableCell className="font-medium">{ order?.code }</TableCell>
                                                <TableCell className="text-left">
                                                    { order?.customer.name }
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    { order?.createdAt }
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Currency value={order?.total}/>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Link href={`/order/${order?.code}`} passHref className="text-sm font-extrabold">Xem chi tiết</Link>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </>
                            ) : 'Không tìm thấy kết quả nào.'}
                        </div>
                    </CardContent>
                </Card>
           </div>         
        </>
    );
}