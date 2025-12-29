"use client";

import { cn } from "@/lib/utils";
import { Order } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Currency from "../client/currency";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { CalendarIcon, FileSpreadsheet } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface RevenuesTableShellProps {
  data: Order[];
  pageCount: number;
}

export function RevenuesTableShell({
  data,
  pageCount,
}: RevenuesTableShellProps) {
    const [isPending, startTransition] = React.useTransition();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })
    React.useEffect(() => {
        if (date && date.from && date.to) {
          const queryString = createQueryString({ from: date.from.toString(), to: date.to.toString() });
      
          router.push(`${pathname}?${queryString}`, {
            scroll: false,
          });
        }
      }, [date, pathname, router]);
      
    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
          const newSearchParams = new URLSearchParams(searchParams?.toString());
    
          for (const [key, value] of Object.entries(params)) {
            if (value === null) {
              newSearchParams.delete(key);
            } else {
              newSearchParams.set(key, String(value));
            }
          }
    
          return newSearchParams.toString();
        },
        [searchParams],
    );

    const typePayment = {
        0: "COD",
        1: "VNPAY",
  }
  const handleExcel = async () => {
    const session = await getSession();
    try {
      const response = await axios.get(`${URL}/api/revenues/export?${searchParams}`,{
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });

      if (response.status === 200) {
        window.open(response.config.url, '_blank');
        toast.success("Tải xuống thành công!");
      }
    } catch (error) {
    } finally {
    }
  }

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
          <DataTableColumnHeader column={column} title="Hình thức thanh toán"  className="w-[150px]"/>
        ),
        cell: ({ row }) => {
          return (
          <div className="">
              <span className={cn("px-2 py-1 rounded-sm border border-rose-500 text-rose-500", 
              (row.original.payment_type.toString() == "VNPAY" && "border-cyan-500 text-cyan-500" || row.original.payment_type.toString() == "MOMO" && "border-fuchsia-600 text-fuchsia-600"))
            }>
              {row.original.payment_type}
            </span>
          </div>
          )
        },
        enableSorting: false,
      },
    ],
    [data, isPending],
  );

  return (
    <>
    <div>
        <span className="text-sm font-medium">Bộ lọc nâng cao: </span>  <br /> 
        <span className="text-sm font-normal">Từ ngày - đến:</span>    
        <div className="flex justify-between">
        <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd-MM-yyyy")} -{" "}
                  {format(date.to, "dd-MM-yyyy")}
                </>
              ) : (
                format(date.from, "dd-MM-yyyy")
              )
            ) : (
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            captionLayout="dropdown-buttons"
            fromYear={1970}
            toYear={2030}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
          </Popover> 
          <Button onClick={handleExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2"/> Xuất excel
          </Button>
        </div>
    </div>
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
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