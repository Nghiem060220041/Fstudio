import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";

  
  interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
  }
  
  export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
  }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>;
    }
  
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              aria-label="Sắp xếp tăng dần"
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUpIcon
                className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Tăng dần
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-label="Sắp xếp giảm dần"
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDownIcon
                className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Giảm dần
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }