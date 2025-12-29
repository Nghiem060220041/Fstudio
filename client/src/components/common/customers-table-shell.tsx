"use client";

import { Customer } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";
import { Switch } from "../ui/switch";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface CustomersTableShellProps {
  data: Customer[];
  pageCount: number;
}

export function CustomersTableShell({
  data,
  pageCount,
}: CustomersTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);  
  const [loading, setLoading] = React.useState(false);
  const [customerId, setCustomerId] = React.useState("");

  const handleSwitchChange = async(isChecked: boolean, customerId: string) => {
    setLoading(true);
    const session = await getSession();
    try {
      const response = await axios.post(`${URL}/api/customers/active/${customerId}`, { "active": isChecked }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });

      if (response.status === 200) {
        toast.success("Cập nhật thành công!");
        window.location.reload();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
}

  const columns = React.useMemo<ColumnDef<Customer, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" className="w-[10px]"/>
        ),
      },
      {
        accessorKey: "image",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hình ảnh"  className="w-[50px]" />
        ),
        cell: ({ row }) => (
          <Avatar>
            <AvatarImage src={row.original.image ? row.original.image.path : ""} className="max-w-full w-12 h-12 object-cover rounded-full"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên khách hàng"  className="w-[150px]"/>
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Số điện thoại"  className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Địa chỉ"  className="w-[350px]"/>
        ),
      },
      {
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => (
          <Switch
            id={row.original.id.toString()}
            checked={row.original.active}
            disabled={loading}
            onCheckedChange={(isChecked)=>handleSwitchChange(isChecked, row.original.id.toString())}
          />
        )
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Mở menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/customers/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setCustomerId(row.original.id.toString())
              }}>
                Xóa
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending],
    );
    
    const activeValue = {
        0: "Ẩn",
        1: "Hiển thị"
    }

  const onDelete = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axios.delete(`${URL}/api/customers/${customerId}`,{
          headers: {
              Authorization: `Bearer ${session?.accessToken}`
          },
        })
      if (response.status === 200) {
          toast.success("Xóa thành công");
      }
      window.location.reload();
    } catch (error) {
        toast.error("Đã xảy ra lỗi");
    } finally {
        setLoading(false);
        setOpen(false);
    }
};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={ onDelete }
        loading={loading} />
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        filterableColumns={[
            {
                id: "active",
                title: "Trạng thái",
                options: Object.entries(activeValue).map(([value, label]) => ({
                    label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
                    value: value,
                })),
            },]}
        searchableColumns={[
          {
            id: "name",
            title: "khách hàng",
          },
        ]}
        newRowLink={`/admin/customers/new`}
      />
    </>
  );
}