"use client";

import { Product } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RelatedForm from "./form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const ProductPage = ({
  params
}: {
  params: { productId: string }
}) => {
  const [products, setProducts] = useState<Product | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  if (params.productId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/products/${params.productId}/add-product-related`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            setProducts(data.data);
          } else {
            setProducts(null);
          }
        } catch (error) {
        }
      };
      const fetchRole2 = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/products/${params.productId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            setProduct(data.data);
          } else {
            setProduct(null);
          }
        } catch (error) {
        }
      };
  
      fetchRole();
      fetchRole2();
    }, [params]);
  }

  return ( 
    <div className="flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <RelatedForm initialData={products} product={product}/>
      </div>
    </div>
  );
}

export default ProductPage;