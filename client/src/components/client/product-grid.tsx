import { Badge } from '@/components/ui/badge'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { ImageSkeleton } from './icons'

export const ProductGrid = ({
   products,
}: {
   products: Product[]
}) => {
   return (
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
         {products.map((product) => (
            <Products product={product} key={product.id} />
         ))}
      </div>
   )
}

export const ProductSkeletonGrid = () => {
   return (
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
         {[...Array(10)].map(() => (
            <ProductSkeleton key={Math.random()} />
         ))}
      </div>
   )
}

export const Products = ({ product }: { product: Product }) => {
   function Price() {
      const price = product?.many_version ? product?.skus[0].price : product?.price
      if (product?.percent_discount > 0) {
         const percentage = (product?.percent_discount / price) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-4" variant="destructive">
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">{price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</h2>
   }

   return (
      <Link className="" href={`/product/${product.slug}`}>
         <Card className="h-full">
            <CardHeader className="py-2 flex items-center">
               <div className="relative h-60 w-full">
                  <Image
                     className="rounded-t-lg"
                     src={product?.image.path}
                     alt={product?.name}
                     fill
                     sizes="(min-width: 1000px) 30vw, 50vw"
                     style={{ objectFit: 'cover' }}
                  />
               </div>
            </CardHeader>
            <CardContent className="grid gap-1 py-4">
               <div className='flex'>
                  <Badge variant="outline" className="w-auto text-xs font-semibold text-neutral-500">
                     {"#" + product?.brand.name}
                  </Badge>
                  <Badge variant="outline" className="w-auto text-xs ml-1 font-semibold text-neutral-500">
                     {"#" + product?.category.name}
                  </Badge>
               </div>
               <h2 className="mt-2 font-semibold">{product.name}</h2>
            </CardContent>
            <CardFooter>
               {/* {product?.isAvailable ? ( */}
               <div className='text-blue-600 font-semibold'>
                  <Price />
               </div>
               {/* ) : (
                  <Badge variant="secondary">Hết hàng</Badge>
               )} */}
            </CardFooter>
         </Card>
      </Link>
   )
}

export function ProductSkeleton() {
   return (
      <Link href="#">
         <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="relative h-full w-full">
               <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
                  <ImageSkeleton />
               </div>
            </div>
            <div className="p-5">
               <div className="w-full">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
               </div>
            </div>
         </div>
      </Link>
   )
}