"use client";

import { Coupon } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Switch } from "../ui/switch";
import { getSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface CouponsTableShellProps {
  data: Coupon[];
  pageCount: number;
}

export function CouponsTableShell({
  data,
  pageCount,
}: CouponsTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);  
  const [coupon, setCoupon] = React.useState("");  

  const handleSwitchChange = async(isChecked: boolean, couponId: string) => {
      setIsLoading(true);
      const session = await getSession();
      try {
        const response = await axios.post(`${URL}/api/coupons/active/${couponId}`, { "active": isChecked }, {
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
        setIsLoading(false);
      }
  }

  const activeValue = {
    0: "Ẩn",
    1: "Hiển thị"
  }

  const columns = React.useMemo<ColumnDef<Coupon, unknown>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã giảm giá" className="w-[150px]"/>
            ),
        cell: ({ row }) => (
            <>
            <span className="font-semibold">#{row.original.code}</span>
              {
              (row.original.has_expired) ? (
                
                <span className={`w-[120px] text-xs px-2 py-1 ml-1 rounded-lg text-center ${ 
                  row.original.expiredDate 
                      ? (new Date(row.original.expiredDate).toString() !== 'Invalid Date'
                          ? (new Date() > new Date(row.original.expiredDate) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")
                          : "bg-gray-100 text-gray-600")
                      : "bg-gray-100 text-gray-600"
              }`}>
                  { 
                      row.original.expiredDate 
                          ? (new Date(row.original.expiredDate).toString() !== 'Invalid Date'
                              ? (new Date() > new Date(row.original.expiredDate) ? "Đã hết hạn" : "Đang diễn ra")
                              : "Ngày hết hạn không hợp lệ")
                          : "Không có ngày hết hạn"
                  }
              </span>
                ) : <span className={`w-[120px] text-xs px-2 py-1 ml-1 rounded-lg text-center bg-green-100 text-green-600`}>
                  Đang diễn ra
              </span>
              }
            </>
        )
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên chương trình"  className="w-[250px]"/>
        ),
      },
      {
        accessorKey: "expiredDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ngày hết hạn"  className="w-[100px]"/>
        ),
        cell: ({ row }) => (
          <>
            <span>{(row.original.has_expired)?row.original.expiredDate:"Không có thời hạn"}</span>
          </>
        )
       },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Số lượng còn lại"  className="w-[100px]"/>
        ),
          },
          {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Loại giảm giá"  className="w-[100px]"/>
        ),
        enableSorting: false,
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
            disabled={isLoading}
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
                  href={`/admin/coupons/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setCoupon(row.original.id.toString())
              }}
              >
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

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const response = await axios.delete(`${URL}/api/coupons/${coupon}`,{
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
        setIsLoading(false);
        setOpen(false);
    }
};


  return (
    <>
    <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={ onDelete }
        loading={isLoading} />
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
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "mã giảm giá",
        },
      ]}
      newRowLink={`/admin/coupons/new`}
    />
    </>
  );
}