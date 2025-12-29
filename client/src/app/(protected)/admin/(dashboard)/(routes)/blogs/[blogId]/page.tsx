"use client";

import { Brand } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BrandForm from "./components/brand-form";
import { useParams } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL_API;

const BrandPage = () => {
  const params = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);

  if (params.brandId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/brands/${params.brandId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            setBrand(data.data);
          } else {
            setBrand(null);
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
        <BrandForm initialData={brand} />
      </div>
    </div>
  );
}

export default BrandPage;