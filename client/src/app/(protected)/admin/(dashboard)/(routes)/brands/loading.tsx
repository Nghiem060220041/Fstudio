import { DataTableLoading } from "@/components/common/data-table/data-table-loading";

export default function ProductsLoading() {
  return (
    <DataTableLoading
      columnCount={6}
      isNewRowCreatable={true}
    />
  );
}