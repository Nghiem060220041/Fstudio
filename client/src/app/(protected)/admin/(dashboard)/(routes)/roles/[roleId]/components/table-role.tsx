import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_URL_API;

interface Roles {
  [key: string]: any[]; 
}

interface Checkbox {
  id: number;
}

export function TableRole({
  params,
  form,
}: {
  params: { roleId: number };
  form: any;
}) {
  const [roles, setRoles] = useState<Roles>({});
  const [permissions, setPermissions] = useState<number[]>([]);

  const moduleName: { [key: string]: string } = {
    user: 'Quản lý người dùng',
    role: 'Quản lý vai trò',
    product: 'Quản lý sản phẩm',
    category: 'Quản lý danh mục',
    brand: 'Quản lý thương hiệu',
    order: 'Quản lý đơn đặt hàng',
    revenue: 'Quản lý doanh thu',
    banner: 'Quản lý trình xem',
    blog: 'Quản lý bài viết',
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const session = await getSession();
        const response = await axios.get(`${URL}/api/roles/${params.roleId}`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setRoles(data.permissions);
        } else {
        }
      } catch (error) {
      }
    };

    fetchRole();
  }, [params]);

  useEffect(() => {
    localStorage.setItem('permissions', permissions.toString());
  }, [permissions]);

  const getRowStart = (checkboxId: number, checkboxesPerRow: number) => {
    return Math.floor((checkboxId - 1) / checkboxesPerRow) * checkboxesPerRow + 1;
  };
  
  const areAnyInRowChecked = (startId: number, checkboxesPerRow: number, checkedArray: number[]) => {
    for (let i = startId; i < startId + checkboxesPerRow; i++) {
      if (checkedArray.includes(i)) {
        return true;
      }
    }
    return false;
  };
  
  const handleSwitchChange = (isChecked: boolean, checkboxId: number) => {
    const checkedArray = [...permissions];
    const correspondingRowStart = getRowStart(checkboxId, 4);
  
    if (isChecked) {
      if (!checkedArray.includes(checkboxId)) {
        checkedArray.push(checkboxId);
      }
  
      if (areAnyInRowChecked(correspondingRowStart, 4, checkedArray) && !checkedArray.includes(correspondingRowStart)) {
        checkedArray.push(correspondingRowStart);
      }
    } else {
      const index = checkedArray.indexOf(checkboxId);
      if (index !== -1) {
        checkedArray.splice(index, 1);
      }
  
      if (!areAnyInRowChecked(correspondingRowStart, 4, checkedArray)) {
        const rowStartIndex = checkedArray.indexOf(correspondingRowStart);
        if (rowStartIndex !== -1) {
          checkedArray.splice(rowStartIndex, 1);
        }
      }
    }
  
    setPermissions(checkedArray);
  };  
  
  const transformedData = Object.keys(roles).map((module: string) => ({
    module,
    name: `${moduleName[module]}`,
    data: roles[module],
  }));

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Tên vai trò</TableHead>
            <TableHead className="text-center w-[200px]">Xem</TableHead>
            <TableHead className="text-center w-[200px]">Thêm</TableHead>
            <TableHead className="text-center w-[200px]">Sửa</TableHead>
            <TableHead className="text-center w-[200px]">Xóa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {transformedData.map((role: { module: string; name: string; data: Checkbox[] }) => (
          <TableRow key={role.module}>
            <TableCell className="py-4 text-sm font-medium">{role.name}</TableCell>
            {role.data.map((checkbox: Checkbox) => (
              <TableCell className="py-4 text-center" key={checkbox.id}>
                {
                  role.module == 'role'
                    ? ('')
                    :
                    (
                      <Switch
                        id={checkbox.id+""}
                        onCheckedChange={(isChecked) => handleSwitchChange(isChecked, checkbox.id)}
                        checked={
                          permissions.includes(checkbox.id) ||
                          (localStorage.getItem("permissions") || "").split(",").includes(checkbox.id.toString())
                        }
                      />
                    )
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </Card>
  );
}