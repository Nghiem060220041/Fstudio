"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/types";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { DataTableFacetedFilter } from "./data-table-facted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto py-1 pl-1">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={`Tìm kiếm ${column.title}...`}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-10 w-[150px] lg:w-[250px]"
                />
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              ),
          )}
        {isFiltered && (
          <Button
            aria-label="Làm mới"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Làm mới
            <Cross2Icon className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {

        }
      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {(newRowLink != "") && (
                  <Button variant="default" size="default" onClick={()=>router.push(`${newRowLink}`)}>
                      <PlusCircledIcon className="w-4 h-4 mr-2" /> Thêm mới
                  </Button>
              )
              }
              </TooltipTrigger>
              <TooltipContent>
              <p>Thêm mới</p>
              </TooltipContent>
          </Tooltip>
      </TooltipProvider>
      </div>
    </div>
  );
}