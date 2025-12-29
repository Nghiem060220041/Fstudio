"use client";

import { useEffect, useState } from "react";
import { RoleForm } from "./components/role-form";
import { getSession } from "next-auth/react";
import { Role } from "@/types";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL_API;

const SizePage = ({
    params
}: {
    params: { roleId: string }
}) => {
  const [role, setRole] = useState<Role | null>(null);
  const [hasRole, setHasRole] = useState(true);

  if (params.roleId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/roles/${params.roleId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });

          if (response.status === 403) {
            setHasRole(false);
        }
  
          if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('permissions', data.permission.toString());
            setRole(data.role);
            setHasRole(true);
          } else {
            setRole(null);
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
        <RoleForm initialData={role} />
      </div>
    </div>
  );
}

export default SizePage;