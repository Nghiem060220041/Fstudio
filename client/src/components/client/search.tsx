'use client'

import { Button } from '@/components/ui/button'
import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Category } from '@/types'
import { DialogProps } from '@radix-ui/react-alert-dialog'
import axios from 'axios'
import { Heart, LaptopIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const URL = process.env.NEXT_PUBLIC_URL_API;

export function CommandMenu({ ...props }: DialogProps) {
   const router = useRouter()
   const [open, setOpen] = React.useState(false)
   const { setTheme } = useTheme()
   const [categories, setCategories] = React.useState([]);

   React.useEffect(() => {
       const fetchCategories = async () => {
           try {
               const response = await axios.get(`${URL}/api/categories/public-store/get-listmenu`);

               if (response.status === 200) {
                   const data = response.data;
                   setCategories(data.data);
               } else {
                   setCategories([]);
               }
           } catch (error) {
           }
       };

       fetchCategories();
   }, []);


   React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
         }
      }

      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
   }, [])

   const runCommand = React.useCallback((command: () => unknown) => {
      setOpen(false)
      command()
   }, [])

   return (
      <>
         <Button
            variant="outline"
            className={cn(
               'inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
            )}
            onClick={() => setOpen(true)}
            {...props}
         >
            <span className="inline-flex">Tìm kiếm... <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span className="text-xs">⌘</span>K</kbd> </span>
         </Button>
         <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Nhập bất kỳ..." />
            <CommandList>
               <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>

               <CommandGroup heading="Đề xuất">
                  {categories.map((navItem: Category) => (
                     <CommandItem
                        key={navItem.slug}
                        value={navItem.name}
                        onSelect={() => {
                           runCommand(() => router.push("/category/"+navItem.slug as string))
                        }}
                     >
                        <div className="mr-2 flex h-4 items-center justify-center">
                           <Heart className="h-3" />
                        </div>
                        {navItem.name}
                     </CommandItem>
                  ))}
                  <CommandItem
                        key="order"
                        value="Tra cứu đơn hàng"
                        onSelect={() => {
                           runCommand(() => router.push("/order" as string))
                        }}
                     >
                        <div className="mr-2 flex h-4 items-center justify-center">
                           <Heart className="h-3" />
                        </div>
                        Tra cứu đơn hàng
                     </CommandItem>
               </CommandGroup>
               <CommandSeparator />
               <CommandGroup heading="Giao diện">
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('light'))}
                  >
                     <SunIcon className="mr-2 h-4" />
                     Sáng
                  </CommandItem>
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('dark'))}
                  >
                     <MoonIcon className="mr-2 h-4" />
                     Tối
                  </CommandItem>
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('system'))}
                  >
                     <LaptopIcon className="mr-2 h-4" />
                     Hệ thống
                  </CommandItem>
               </CommandGroup>
            </CommandList>
         </CommandDialog>
      </>
   )
}