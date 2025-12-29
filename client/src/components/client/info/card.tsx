"use client";

import { Expand, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

import { Product } from "@/types";
import IconButton from "../icon-button";
import useCart from "@/hooks/use-cart";

interface ProductCard {
  data: Product
}

const ProductCard: React.FC<ProductCard> = ({
  data
}) => {
  const router = useRouter();
  const cart   = useCart();

  const onAddToCart = () => {
    const convertData = {
      id: data?.id || "",
      slug: data?.slug || "",
      image: data?.image.path || "",
      name: data?.name || "",
      price: data?.price,
      quantity: 1,
      sku_id: null,
      property_options: null,
    }
    cart.addItem(convertData);
  }

  const handleClick = () => {
    router.push(`/product/${data?.slug}`);
    };
   const price = data?.many_version ? data?.skus[0].price : data?.price
  
  return ( 
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image 
          src={data.image?.path} 
          alt="" 
          fill
          onClick={handleClick}
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            {
              data?.many_version == false && (
                <IconButton
                  icon={<ShoppingCart size={20} className="text-gray-600" onClick={onAddToCart} />} 
                />
              )
            }
            <IconButton
              icon={<Heart size={20} className="text-gray-600" />} 
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500" onClick={handleClick}>{data.category?.name}</p>
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between text-blue-600 font-semibold">
       {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
      </div>
    </div>
  );
}

export default ProductCard;