import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card'
import { Blog } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { ImageSkeleton } from './icons'

export const BlogGrid = ({
   blogs,
}: {
   blogs: Blog[]
}) => {
   return (
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3">
         {blogs.map((blog) => (
            <Blogs blog={blog} key={blog.id} />
         ))}
      </div>
   )
}

export const BlogSkeletonGrid = () => {
   return (
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3">
         {[...Array(3)].map(() => (
            <BlogSkeleton key={Math.random()} />
         ))}
      </div>
   )
}

export const Blogs = ({ blog }: { blog: Blog }) => {

   return (
      <Link className="" href={`/blog/${blog.slug}`}>
         <Card className="h-full">
            <CardHeader className="py-2 flex items-center">
               <div className="relative h-60 w-full">
                  <Image
                     className="rounded-t-lg"
                     src={"/"}
                     alt={blog?.name}
                     fill
                     sizes="(min-width: 1000px) 30vw, 50vw"
                     style={{ objectFit: 'cover' }}
                  />
               </div>
            </CardHeader>
            <CardContent className="grid gap-1 py-4">
               <h2 className="mt-2 font-semibold">{blog.name}</h2>
            </CardContent>
            <CardFooter>
            </CardFooter>
         </Card>
      </Link>
   )
}

export function BlogSkeleton() {
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