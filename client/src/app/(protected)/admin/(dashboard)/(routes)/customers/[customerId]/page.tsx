"use client";

import { Customer } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomerForm from "./components/customer-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const CustomerPage = ({
  params
}: {
  params: { customerId: string }
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [hasRole, setHasRole] = useState(true);

  if (params.customerId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/customers/${params.customerId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });

          if (response.status === 403) {
            setHasRole(false);
        }
  
          if (response.status === 200) {
            const data = response.data;
            setCustomer(data.data);
            setHasRole(true);
          } else {
            setCustomer(null);
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
        <CustomerForm initialData={customer} />
      </div>
    </div>
  );
}

export default CustomerPage;