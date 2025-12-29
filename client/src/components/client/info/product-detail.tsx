"use client";

import { Heart, Minus, Plus, ShoppingBasket, Star } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/use-cart";
import { Coupon, Product } from "@/types";
import { RadioGroup } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductRelated from "./product-related";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoProps {
  data: Product | null,
  options: any,
  newData: any,
  coupons: any
};

const Info: React.FC<InfoProps> = ({ data, options, newData, coupons }) => {
  const cart = useCart();
  const price = data?.many_version ? data?.skus[0].price : data?.price || 0;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isTrustAdd, setIsTrustAdd] = useState(true);
  const [quantity, setQuantity] = useState(1);
 
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else if(quantity==1) {
      toast.error("Số lượng không thể ít hơn 1");
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= ((newData && Array.isArray(newData) && newData.length > 0 && newData[0].quantity !== undefined) ? (newData[0].quantity - newData[0].sold_quantity) : (data?.quantity || 1))) {
      setQuantity(newQuantity);
    } else {
      toast.error('Số lượng vượt quá giới hạn cho phép');
    }
  };
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const loadAddCart = () => {
    if (!data?.many_version) {
      setIsTrustAdd(false);
      return;
    }
  
    if (Object.keys(options).length > 0) {
      let count = 0;
      for (const [key, value] of searchParams.entries()) {
        count++;
      }
  
      if (Object.keys(options).length == count) {
        setIsTrustAdd(false);
        return;
      }
  
      setIsTrustAdd(true);
    }
  };
  
  const handleOptionSelect = (optionType: string, value: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionType]: value,
    }));
    loadAddCart();
  };
  
  useEffect(() => {
    loadAddCart();
  }, [options, searchParams, setIsTrustAdd]);
  

  useEffect(() => {
    const queryString = createQueryString(selectedOptions);
    setQuantity(1);
  
    router.push(`${pathname}?${queryString}`, {
      scroll: false,
    });
  }, [selectedOptions]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const onAddToCart = () => {
    const convertData = {
      id: data?.id || "",
      slug: data?.slug || "",
      image: data?.image.path || "",
      name: data?.name || "",
      price: (newData && Array.isArray(newData) && newData.length > 0 && newData[0].price !== undefined) ? newData[0].price : price || "",
      quantity: quantity,
      sku_id:  (data?.many_version==true) && newData[0].id || null,
      property_options:  (data?.many_version==true) && newData[0].property_options || null,
    }
    cart.addItem(convertData);
  }

  return ( 
    <div>
      <h1 className="text-3xl font-bold">{data?.name}</h1>
      
      <div className="flex pt-2 align-middle text-sm">SKU: <p className="ml-2 text-sm font-semibold">{data?.sku}</p></div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            (newData && Array.isArray(newData) && newData.length > 0 && newData[0].price !== undefined) ? newData[0].price : price
          )}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
      {data?.many_version ? (
          Object.keys(options).map((key: string, index: number) => (
            <div key={index} className="flex items-center gap-x-4">
              <h3 className="font-semibold">{key}:</h3>
              <div>
                <RadioGroup
                  value={selectedOptions[key]}
                  onChange={(value) => handleOptionSelect(key, value)}
                  className="flex"
                >
                  {options[key].map((opt: any, index: number) => (
                    <RadioGroup.Option
                      key={index}
                      value={opt.id}
                      className={({ checked }) =>
                        `${checked ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white'}
                          relative flex cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none mr-2`
                      }
                    >
                      {({ checked }) => (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                              >
                                {opt.name}
                              </RadioGroup.Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ))
        ):""}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
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
          max={(newData && Array.isArray(newData) && newData.length > 0 && newData[0].quantity !== undefined)?(newData[0].quantity-newData[0].sold_quantity):data?.quantity}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <Button
          size="icon"
          onClick={increaseQuantity}
        >
          <Plus className="w-4 h-4"/>
        </Button>
        <Button
          disabled={isTrustAdd}
          onClick={onAddToCart}
          className="flex items-center gap-x-2">
          <ShoppingBasket className="w-4 h-4" />
          Thêm vào giỏ hàng
        </Button>
        <Button className="flex items-center gap-x-2" variant="outline">
          <Heart className="w-4 h-4 text-red-400" />
          Thêm vào wishlist
        </Button>
      </div>
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="item-1">
          <AccordionTrigger><p className="flex items-center text-md"><Star className="w-4 h-4 mr-4"/>Mô tả sản phẩm</p></AccordionTrigger>
          <AccordionContent>
            <div dangerouslySetInnerHTML={{ __html: data?.description !== undefined ? data.description : '' }} className="my-8 text-justify"/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger><p className="flex items-center text-md"><Star className="w-4 h-4 mr-4"/>Thông tin khuyến mãi</p></AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-72">
              {
                coupons && coupons.map((coupon: Coupon) => {
                  const formattedDate = new Date(coupon.expiredDate);
                  const isValidDate = !isNaN(formattedDate.getTime());
                  const couponDescription = coupon.type == "1"
                    ? `Giảm thẳng ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.value)} vào đơn hàng.`
                    : `Giảm ngay ${coupon.value}% giá trị tổng đơn hàng.`;

                  const expirationMessage = isValidDate
                    ? ` Đến ngày ${formattedDate.toLocaleDateString('vi-VN')}`
                    : ` - Ngày hạn không hợp lệ`;

                  return (
                      <ApiAlert
                        key={coupon.id}
                        type={coupon.has_expired}
                        notice={coupon.expiredDate}
                        title={coupon.name + " | "+ couponDescription + ((coupon.has_expired)?expirationMessage: "")}
                        description={coupon.code}
                        percent={parseFloat(((100/coupon.quantity)*coupon.quantity_used).toFixed(1))}
                      />
                      );
                    })
                }
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" data-state="open">
          <AccordionTrigger><p className="flex items-center text-md"><Star className="w-4 h-4 mr-4"/>Gợi ý phụ kiện đi kèm</p></AccordionTrigger>
          <AccordionContent>
            <ProductRelated items={data?.related_products} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
 
export default Info;