"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
  
  interface RecentProps {
    product: any
  }
  
export const RecentSales: React.FC<RecentProps> = ({ product }) => {
    const productsArray = Object.values(product);
    const sortedProducts = productsArray
          .filter((prd:any) => typeof prd.totalQuantity === 'number')
          .sort((a:any, b:any) => b.totalQuantity - a.totalQuantity)
          .slice(0, 5);

    return (
      <div className="space-y-8">
          {
          sortedProducts ? (sortedProducts.map((product: any) => (
            <div className="flex items-center" key={product.product.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={`${product.product.image.path}`} alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{product.product.name}</p>
              </div>
              <div className="ml-auto font-medium">{ product.totalQuantity }</div>
            </div>
          ))) : <span>Không tìm thấy sản phẩm nào.</span>
          }
        </div>
    )
  }