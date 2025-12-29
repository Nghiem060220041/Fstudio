"use client";

import { Product } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import GalleryForm from "./form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const ProductPage = ({
  params
}: {
  params: { productId: string }
}) => {
  const [product, setProduct] = useState<Product | null>(null);

  if (params.productId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
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
    }, [params]);
  }

  return ( 
    <div className="flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <GalleryForm initialData={product} />
      </div>
    </div>
  );
}

export default ProductPage;