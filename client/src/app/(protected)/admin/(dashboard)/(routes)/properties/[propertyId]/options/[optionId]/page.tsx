"use client";

import { PropertyOption } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PropertyForm from "./components/option-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const CategoryPage = ({
  params
}: {
  params: { propertyId: string, optionId: string }
}) => {
  const [property, setProperty] = useState<PropertyOption | null>(null);

  if (params.optionId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/properties/${params.propertyId}/options/${params.optionId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            console.log(`${URL}/api/properties/${params.propertyId}/options/${params.optionId}`);
            setProperty(data.data);
          } else {
            setProperty(null);
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
        <PropertyForm initialData={property} />
      </div>
    </div>
  );
}

export default CategoryPage;