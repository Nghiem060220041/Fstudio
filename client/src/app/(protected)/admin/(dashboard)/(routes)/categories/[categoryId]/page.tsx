"use client";

import { Category } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CategoryForm from "./components/category-form";
import { useParams } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL_API;

const CategoryPage = () => {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [hasRole, setHasRole] = useState(true);

  if (params.categoryId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/categories/${params.categoryId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });

          if (response.status === 403) {
            setHasRole(false);
        }
  
          if (response.status === 200) {
            const data = response.data;
            setCategory(data.data);
            setHasRole(true);
          } else {
            setCategory(null);
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
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;