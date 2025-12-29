"use client";

import { User } from "@/types";
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

interface UsersTableShellProps {
  data: User[];
  pageCount: number;
}

export function UsersTableShell({
  data,
  pageCount,
}: UsersTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);  
  const [loading, setLoading] = React.useState(false);
  const [userId, setUserId] = React.useState("");

  const handleSwitchChange = async(isChecked: boolean, userId: string) => {
    setLoading(true);
    const session = await getSession();
    try {
      const response = await axios.post(`${URL}/api/users/active/${userId}`, { "active": isChecked }, {
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

  const activeValue = {
    0: "Khóa",
    1: "Kích hoạt"
  }

  const columns = React.useMemo<ColumnDef<User, unknown>[]>(
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
            <DataTableColumnHeader column={column} title="Ảnh đại diện"  className="w-[100px]" />
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
          <DataTableColumnHeader column={column} title="Tên người dùng"  className="w-[150px]"/>
        ),
      },
      {
        accessorKey: "gender",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Giới tính"  className="w-[150px]"/>
        ),
      },
      {
        accessorKey: "dob",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ngày sinh"  className="w-[150px]"/>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Điện thoại"  className="w-[150px]"/>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "roleId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quyền"  className="w-[150px]"/>
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
                  href={`/admin/users/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setUserId(row.original.id.toString())
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

  const onDelete = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axios.delete(`${URL}/api/users/${userId}`,{
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
            },
          ]}
        searchableColumns={[
          {
            id: "name",
            title: "người dùng",
          },
        ]}
        newRowLink={`/admin/users/new`}
      />
    </>
  );
}