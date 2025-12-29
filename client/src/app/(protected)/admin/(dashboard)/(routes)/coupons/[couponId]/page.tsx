"use client";

import { Coupon } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CouponForm from "./components/coupon-form";
import { useParams } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL_API;

const CouponPage = () => {
  const params = useParams();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [hasRole, setHasRole] = useState(true);

  if (params.couponId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/coupons/${params.couponId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });

          if (response.status === 403) {
            setHasRole(false);
          }
  
          if (response.status === 200) {
            const data = response.data;
            setCoupon(data.data);
            setHasRole(true);
          } else {
            setCoupon(null);
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
        <CouponForm initialData={coupon} />
      </div>
    </div>
  );
}

export default CouponPage;