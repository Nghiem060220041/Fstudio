"use client";

import { Property } from "@/types";
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

interface PropertiesTableShellProps {
  data: Property[];
  pageCount: number;
}

export function PropertiesTableShell({
  data,
  pageCount,
}: PropertiesTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [propertyId, setPropertyId] = React.useState("");

  const handleSwitchChange = async(isChecked: boolean, propertyId: string) => {
      setIsLoading(true);
      const session = await getSession();
      try {
        const response = await axios.post(`${URL}/api/properties/active/${propertyId}`, { "active": isChecked }, {
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

  const columns = React.useMemo<ColumnDef<Property, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" className="w-[10px]"/>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên thuộc tính"  className="w-[650px]"/>
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
                  href={`/admin/properties/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link
                  href={`/admin/properties/${row.original.id}/options`}
                >
                  Quản lý thuộc tính
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem  onClick={() => {
                setOpen(true)
                setPropertyId(row.original.id.toString())
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
      const response = await axios.delete(`${URL}/api/properties/${propertyId}`,{
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
          title: "thuộc tính",
        },
      ]}
      newRowLink={`/admin/properties/new`}
    />
        </>
  );
}