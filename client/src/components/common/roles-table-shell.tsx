"use client";

import { Role } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface RolesTableShellProps {
  data: Role[];
  pageCount: number;
}

export function RolesTableShell({
  data,
  pageCount,
}: RolesTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);  
  const [role, setRole] = React.useState(""); 

  const columns = React.useMemo<ColumnDef<Role, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" className="w-[50px]"/>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên vai trò"  className="w-[550px]"/>
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
                  href={`/admin/roles/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setRole(row.original.id.toString())
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
      const response = await axios.delete(`${URL}/api/roles/${role}`,{
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
      searchableColumns={[
        {
          id: "name",
          title: "vai trò",
        },
      ]}
      newRowLink={`/admin/roles/new`}
    />
    </>
  );
}