"use client";

import { Blog } from "@/types";
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

const URL = process.env.NEXT_PUBLIC_URL_API;

interface BlogsTableShellProps {
  data: Blog[];
  pageCount: number;
}

export function BlogsTableShell({
  data,
  pageCount,
}: BlogsTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);  
  const [loading, setLoading] = React.useState(false);
  const [blogId, setBlogId] = React.useState("");

  const columns = React.useMemo<ColumnDef<Blog, unknown>[]>(
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
            <DataTableColumnHeader column={column} title="Logo"  className="w-[50px]" />
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
          <DataTableColumnHeader column={column} title="Tên thương hiệu"  className="w-[150px]"/>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Mô tả"  className="w-[350px]"/>
        ),
      },
      {
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hiển thị"  className="w-[100px]"/>
        ),
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
                  href={`/admin/blogs/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setBlogId(row.original.id.toString())
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
      const response = await axios.delete(`${URL}/api/blogs/${blogId}`,{
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
        searchableColumns={[
          {
            id: "name",
            title: "thương hiệu",
          },
        ]}
        newRowLink={`/admin/blogs/new`}
      />
    </>
  );
}