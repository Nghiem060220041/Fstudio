"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Currency from "@/components/client/currency";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import CartItem from "./cart-item";
import { UncontrolledFormMessage } from "@/components/ui/form";
import CartItemCheckout from "./cart-item.checkout";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface SummaryCLientProps {
  discount: any | null,
  message: string | null
}

const SummaryCheckout: React.FC<SummaryCLientProps> = ({ discount, message }) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const router = useRouter();
  const pathname = usePathname();
  const removeAll = useCart((state) => state.removeAll);
  const cart = useCart();

  useEffect(() => {

  }, [searchParams, removeAll]);

  let totalDiscount = 0;

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price*item.quantity)
  }, 0);

  const totalItem = items.reduce((total, item) => {
    return total + Number(item.quantity)
  }, 0);

  if (discount) {
    if (discount.type == 0) {
      totalDiscount = ((totalPrice * discount.value) / 100)>discount.value_max ? discount.value_max : (totalPrice * discount.value) / 100;
    } else {
      totalDiscount = discount.value;
    }
  }

  const totalPrice2 = (totalPrice - totalDiscount < 0) ? 0 : totalPrice - totalDiscount ;

  const onCheckout = async () => {
    router.push('/cart/checkout');
  }

  return ( 
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium">
        Chi tiết đơn hàng
      </h2>
      {
        pathname.includes('checkout') && (
          <>
            {cart && (
              cart.items.length === 0 ? <p className="">Không có sản phẩm nào trong giỏ hàng.</p> : (
                <ul>
                    { cart.items.map((item, index) => (
                      <CartItemCheckout key={index} data={item} />
                    ))}
                </ul>
              )
              )}
              <p className="py-2 text-sm font-medium text-destructive">{ message && message }</p>
          </>
        )
      }
      <div className="mt-6 space-y-4">
          {cart.items.length > 0 && (
            <div className="flex items-center justify-between pt-2">
                <div className="text-base font-medium">Số lượng sản phẩm</div>
                  {totalItem}
            </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-medium">Tạm tính</div>
         <Currency value={totalPrice}/>
        </div>
        {
          discount ? (
            <div className="flex items-center justify-between pt-2">
              <div className="text-base font-medium">Giảm giá</div>
            <Currency value={-totalDiscount}/>
          </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <div className="text-base font-medium">Giảm giá</div>
            <Currency value={0}/>
        </div>
          )
        }
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-medium">Tổng tiền cần thanh toán</div>
         <Currency value={totalPrice2}/>
        </div>
      </div>
      {
        !pathname.includes('checkout') && (
          <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
            Thanh toán
          </Button>
        )
      }
    </div>
  );
}
 
export default SummaryCheckout;