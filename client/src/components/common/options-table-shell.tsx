"use client";

import { PropertyOption } from "@/types";
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
import { useParams } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OptionsTableShellProps {
  data: PropertyOption[];
  pageCount: number;
}

export function OptionsTableShell({
  data,
  pageCount,
}: OptionsTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const params = useParams();

  const handleSwitchChange = async(isChecked: boolean, propertyId: string, optionId: string) => {
      setIsLoading(true);
      const session = await getSession();
      try {
        const response = await axios.post(`${URL}/api/properties/${propertyId}/active/${optionId}}`, { "active": isChecked }, {
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

  const columns = React.useMemo<ColumnDef<PropertyOption, unknown>[]>(
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
          <DataTableColumnHeader column={column} title="Tên thuộc tính"  className="w-[400px]"/>
        ),
    },
        {
        accessorKey: "property_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thuộc về"  className="w-[250px]"/>
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
            onCheckedChange={(isChecked)=>handleSwitchChange(isChecked, params.categoryId.toString(), row.original.id.toString())}
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
                  href={`/admin/properties/${params.propertyId.toString()}/options/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
                </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
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

  return (
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
      newRowLink={`/admin/properties/${params.propertyId.toString()}/options/new`}
    />
  );
}