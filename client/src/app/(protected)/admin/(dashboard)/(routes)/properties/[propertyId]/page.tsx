"use client";

import { Property } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PropertyForm from "./components/property-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const CategoryPage = ({
  params
}: {
  params: { propertyId: string }
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [hasRole, setHasRole] = useState(true);

  if (params.propertyId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/properties/${params.propertyId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });

          if (response.status === 403) {
              setHasRole(false);
          }
  
          if (response.status === 200) {
            const data = response.data;
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

  if (!hasRole) {
    return <div className="container">Bạn không có quyền truy cập chức năng này!</div>
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