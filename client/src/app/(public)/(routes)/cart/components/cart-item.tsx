"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

import Currency from "@/components/client/currency";
import useCart from "@/hooks/use-cart";
import { Cart } from "@/types";
import IconButton from "../../../../../components/client/icon-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface CartItemProps {
  data: Cart;
}

const CartItem: React.FC<CartItemProps> = ({
  data
}) => {
  const cart = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(data.quantity);
 
  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (data.sku_id) {
        cart.updateItem(data.id, data.sku_id, newQuantity);
      } else {
        cart.updateItem(data.id, -1, newQuantity);
      }
    } else if(quantity==1) {
      toast.error("Số lượng không thể ít hơn 1");
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (data.sku_id) {
      cart.updateItem(data.id, data.sku_id, newQuantity);
    } else {
      cart.updateItem(data.id, -1, newQuantity);
    }
  };

  const onRemove = () => {
    if (data.sku_id) {
      cart.removeItem(data.id, data.sku_id);
    } else {
      cart.removeItem(data.id, -1);
    }
  };

  const handleClick = () => {
    router.push(`/product/${data.slug}`);
  };

  return ( 
    cart && (
      <li className="flex py-6 border-b">
        <div className="relative h-16 w-16 rounded-md overflow-hidden sm:h-24 sm:w-24">
          <Image
            fill
            src={data.image}
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 top-0">
            <IconButton onClick={onRemove} icon={<X size={15} />} />
          </div>
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:pr-0">
            <div className="flex justify-between">
              <p className="text-lg font-semibold cursor-pointer" onClick={handleClick}>
                {data.name}
              </p>
            </div>
            <div className="text-sm mt-1">
            {data.sku_id && (
                  data.property_options.map((option: any, index) => (
                    <p key={index} className="pl-4">{ option.name }</p>
                  ))
                )
              }
            </div>
            <div>
              {cart.items.length>0 && (
                <div className="flex align-middle items-center gap-x-2">
                  <span className="text-sm font-medium">Số lượng:</span>
                  <Button
                    size="icon"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="w-4 h-4"/>
                  </Button>
                  <Input
                      className="w-[60px]"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        setQuantity(newQuantity);
                        if (data.sku_id) {
                          cart.updateItem(data.id, data.sku_id, newQuantity);
                        } else {
                          cart.updateItem(data.id, -1, newQuantity);
                        }
                      }}
                    />
                  <Button
                    size="icon"
                    onClick={increaseQuantity}
                  >
                    <Plus className="w-4 h-4"/>
                  </Button>
                </div>
              )}
              <Currency value={data.price}/>
            </div>
          </div>
        </div>
      </li>
    )
  );
}
 
export default CartItem;