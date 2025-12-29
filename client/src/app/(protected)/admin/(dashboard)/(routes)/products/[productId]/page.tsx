"use client";

import { Product } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProductForm from "./components/product-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const ProductPage = ({
  params
}: {
  params: { productId: string }
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [hasRole, setHasRole] = useState(true);

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

          if (response.status === 403) {
              setHasRole(false);
          }
  
          if (response.status === 200) {
            const data = response.data;
            setProduct(data.data);
            setHasRole(true);
          } else {
            setProduct(null);
          }
        } catch (error) {
        }
      };
  
      fetchRole();
    }, [params]);
  }

  if (!hasRole) {
    return <div className="container">Bạn không có quyền truy cập chức năng này!</div>
  }

  return ( 
    <div className="flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}

export default ProductPage;