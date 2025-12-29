"use client"

import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { useEffect, useState } from "react";

interface CartClientProps {
}

export const CartClient: React.FC<CartClientProps> = ({ }) => {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Giỏ hàng</h1>
                <p className="text-sm">Dưới đây là chi tiết giỏ hàng của bạn</p>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                    <div className="lg:col-span-7">
                        {cart.items.length === 0 && <p className="">Không có sản phẩm nào trong giỏ hàng.</p>}
                        <ul>
                            {cart.items.map((item, index) => (
                                <CartItem key={index} data={item} />
                            ))}
                        </ul>
                    </div>
                    <Summary discount={null} message={null}/>
                </div>
            </div>
        </>
    );
}