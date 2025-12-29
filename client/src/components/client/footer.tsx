import config from '@/config/site'
import { FacebookIcon, GithubIcon, InstagramIcon } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const data = [
    {
        label: 'Sản Phẩm',
        links: [
            {
                label: 'Iphone',
                url: '/category/iphone',
            },
            {
                label: 'Ipad',
                url: '/category/ipad',
            },
            {
                label: 'Mac',
                url: '/category/mac',
            },
            {
                label: 'Apple Watch',
                url: '/category/apple-watch',
            },
            {
                label: 'Phụ kiện',
                url: '/category/phu-kien',
            },
        ],
    },
    {
        label: 'Chính sách',
        links: [
            {
                label: 'Chính sách bảo mật',
                url: '/chinh-sach-bao-mat',
            },
            {
                label: 'Chính sách bảo hành',
                url: '/chinh-sach-bao-hanh',
            },
            {
                label: 'Chính sách giao nhận hàng',
                url: '/chinh-sach-giao-nhan-hang',
            },
        ],
    },   
   {
      label: 'Về chúng tôi',
      links: [
         {
            label: 'Giới thiệu',
            url: '/about',
          },
          {
            label: 'Blog',
            url: '/blog',
         },
         {
            label: 'FAQ',
            url: '/faq',
          },
          {
            label: 'Hướng dẫn mua hàng',
            url: '/help',
         },
      ],
   },
]

export default function Footer() {
   return (
      <footer className="w-full">
         <Separator className="my-12" />
         <div className="flex justify-between px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            <Trademark />
            <Links />
         </div>
         <Separator className="mt-8 mb-6" />
         <Socials />
      </footer>
   )
}

function Links() {
   return (
      <div className="text-start justify-evenly grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
         {data.map(({ label, links }) => (
            <div key={label}>
               <h2 className="mb-3 text-sm font-semibold uppercase">{label}</h2>
               <ul className="block space-y-1">
                  {links.map(({ label, url }) => (
                     <li key={label}>
                        <Link
                           href={url}
                           className="text-sm transition duration-300 text-muted-foreground hover:text-foreground hover:border-cyan-500 border-transparent border-b-2"
                        >
                           {label}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
         ))}
      </div>
   )
}

function Trademark() {
   return (
      <div className="mb-6 hidden md:mb-0 md:block">
         <span className="flex flex-col">
            <h2 className="whitespace-nowrap text-sm font-semibold uppercase">
               {config.name}
            </h2>
            <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
               © {new Date().getFullYear()} {config.name}™ . All Rights
               Reserved.
            </span>
         </span>
      </div>
   )
}

function Socials() {
   return (
      <div className="mb-6 flex justify-center space-x-6 text-muted-foreground">
         <a
            href="#"
            target="_blank"
            rel="noreferrer"
         >
            <InstagramIcon className="h-4" />
            <span className="sr-only">Instagram</span>
         </a>
         <a
            href="#"
            target="_blank"
            rel="noreferrer"
         >
            <FacebookIcon className="h-4" />
            <span className="sr-only">Facebook</span>
         </a>
         <a
            href="#"
            target="_blank"
            rel="noreferrer"
         >
            <GithubIcon className="h-4" />
            <span className="sr-only">GitHub</span>
         </a>
      </div>
   )
}