"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropertyOption } from "@/types";
import { FilterX } from "lucide-react";

interface FilterProps {
  data: PropertyOption[];
  name: string;
  valueKey: string;
};

const Filter: React.FC<FilterProps> = ({
  data,
  name,
  valueKey,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const selectedValue = searchParams.get(valueKey);
  
  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.push(url);
  }

  const clearFilter = () => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.delete(valueKey);
  
    const newSearchParams = currentSearchParams.toString();
  
    const url = `${window.location.pathname}?${newSearchParams}`;
  
    router.push(url);
  };

  return ( 
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {name}
        </h3>
        <div className="flex text-sm align-middle">
          {selectedValue && (
            <Button variant="destructive" size="icon" type="button" onClick={clearFilter}>
              <FilterX className="w-4 h-4"/>
            </Button>
          )}
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <Button
              className={cn(
                'rounded-md text-sm border bg-white text-primary hover:bg-primary/90 hover:text-white',
                selectedValue == filter.id.toString() && 'bg-black text-white'
              )}
              size="sm"
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;