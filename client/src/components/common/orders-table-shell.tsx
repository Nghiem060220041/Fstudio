"use client";

import { Order } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { Copy, FileDown, PenSquareIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";
import Currency from "../client/currency";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { cn } from "@/lib/utils";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OrdersTableShellProps {
  data: Order[];
  pageCount: number;
}

export function OrdersTableShell({
  data,
  pageCount,
}: OrdersTableShellProps) {
  const [isPending, startTransition] = React.useTransition();

  const activeValue = {
    0: "Đang đợi xác nhận",
    1: "Xác nhận đơn hàng",
    2: "Đang giao hàng",
    3: "Đã giao hàng",
    4: "Hoàn thành",
    "-1": "Hủy đơn",
  }

  const typePayment = {
    0: "COD",
    1: "VNPAY",
    2: "MOMO",
  }

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code.toString());
    toast.success("Sao chép thành công");
  };

  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã đơn đặt hàng" className="w-[150px]"/>
        ),
        cell: ({ row }) => (
          <div className="">
            <span>#{ row.original.code }</span><br/>
            <Currency value={row.original.total}/>
          </div>
        )
      },
      {
        accessorKey: "customer_id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Người đặt"  className="w-[150px]"/>
        ),
        cell: ({ row }) => (
          <div className="">
            <span>{ row.original.customer.name }</span><br/>
            <span>{ row.original.customer.phone }</span>
          </div>
        )
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ngày đặt hàng"  className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "payment_type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hình thức thanh toán/Trạng thái"  className="w-[150px]"/>
        ),
        cell: ({ row }) => {
          return (
          <div className="">
              <span className={cn("px-2 py-1 rounded-sm border border-rose-500 text-rose-500", 
              (row.original.payment_type.toString() == "VNPAY" && "border-cyan-500 text-cyan-500" || row.original.payment_type.toString() == "MOMO" && "border-fuchsia-600 text-fuchsia-600"))
            }>
              {row.original.payment_type}
            </span>
              <span className={cn("ml-2 px-2 py-1 rounded-sm border border-orange-500 text-orange-500",
                row.original.status_payment.toString() == "Đã thanh toán" && "border-lime-500 text-lime-500"
              )}>
              {row.original.status_payment}
            </span>
          </div>
          )
        },
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => (
          <div className="">
            <span className={cn("px-2 py-1 rounded-sm border border-sky-500 text-sky-500", 
              (row.original.status.toString() == "Hủy đơn" && "border-red-500 text-red-500" || row.original.payment_type.toString() == ("Đã giao hàng" || "Hoàn thành") && "border-green-500 text-green-500"))
            }>{ row.original.status }</span>
          </div>
        ),
        enableSorting: false,
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
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${row.original.id}`}>
                  <PenSquareIcon className="w-4 h-4 mr-2"/> Cập nhật đơn hàng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={()=>onCopy(row.original.code)}>
                  <Copy className="w-4 h-4 mr-2"/> Sao chép mã đơn hàng
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`${URL}/storage/${row.original.filename}`}
                  target="_blank"
                  download
                >
                  <FileDown className="w-4 h-4 mr-2"/>Tải xuống hóa đơn
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending],
  );

  return (
    <>
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
      {
          id: "status",
          title: "Trạng thái đơn hàng",
          options: Object.entries(activeValue).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
          })),
        },
        {
          id: "payment_type",
          title: "Hình thức thanh toán",
          options: Object.entries(typePayment).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "code",
          title: "đơn hàng",
        },
      ]}
      newRowLink={""}
    />
    </>
  );
}