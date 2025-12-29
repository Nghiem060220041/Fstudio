"use client"

import ProductCard from "@/components/client/info/card";
import NoResults from "@/components/client/info/no-results";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Brand, Product, Property } from "@/types";
import axios from "axios";
import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ, FilterIcon, X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import Filter from "./components/filters";
  
interface ProductClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ }) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const { data: options } = useSWRImmutable<Property[] | null>([`${URL}/api/products/new-product/get-option`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    const { data: brands } = useSWRImmutable<Brand | null>([`${URL}/api/products/new-product/get-brand`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    const { data: products } = useSWR<Product[] | null>(
        () => `${URL}/api/products/public-store/${params.slug}/categories?${new URLSearchParams(searchParams).toString()}`,
        (url: string) =>
          axios
            .get(url)
            .then((res) => res.data.data)
    );

    const onClick = (valueKey: string, id: string) => {
        const current = qs.parse(searchParams.toString());
    
        const query = {
          ...current,
          [valueKey]: id
        };
    
        if (current[valueKey] === id) {
          query[valueKey] = null;
        }
    
        const url = qs.stringifyUrl({
          url: window.location.href,
          query,
        }, { skipNull: true });
    
        router.push(url);
    }
    
    const clearFilter = (valueKey: string) => {
        const currentSearchParams = new URLSearchParams(searchParams.toString());
        currentSearchParams.delete(valueKey);
      
        const newSearchParams = currentSearchParams.toString();
      
        const url = `${window.location.pathname}?${newSearchParams}`;
      
        router.push(url);
      };

    return (
        <>
            <h2 className="text-3xl font-bold">Danh sách sản phẩm tìm thấy</h2>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h3 className="text-md">Có {products && products.length} sản phẩm được tìm thấy.</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                        <FilterIcon className="w-4 h-4"/>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Sắp xếp theo</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('sort')}>
                            Xóa bộ lọc
                        <DropdownMenuShortcut><X className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClick('sort', 'name.asc')}>
                            Tên từ A-Z
                        <DropdownMenuShortcut><ArrowDownAZ className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClick('sort', 'name.desc')}>
                            Tên từ Z-A
                        <DropdownMenuShortcut><ArrowUpAZ className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClick('sort', 'price.asc')}>
                            Giá tiền từ thấp đến cao
                        <DropdownMenuShortcut><ArrowDown01 className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClick('sort', 'price.desc')}>
                            Giá tiền từ cao đến thấp
                        <DropdownMenuShortcut><ArrowUp01 className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator className="mb-8"/>
            <div className="pb-24">
                <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                    <div className="hidden lg:block">
                        {brands && (
                            <Filter
                                valueKey="brand_id"
                                name="Thương hiệu"
                                data={brands}
                            />
                        )}
                        {options && (
                            options.map((option:Property) => (
                                <Filter
                                    valueKey={option.name} 
                                    name={option.name} 
                                    data={option.property_options}
                                />
                            ))
                        )}
                    </div>
                    <div className="mt-6 lg:col-span-4 lg:mt-0">
                    {products?.length==0 && <NoResults />}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {products && products.map((item, index) => (
                            <ProductCard key={index} data={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}