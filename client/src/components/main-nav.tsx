"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function MainNav({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    const users = [
        {
            href: `/admin/roles`,
            label: 'Quyền',
            description: 'Quản lý quyền',
            active: pathname.startsWith(`/admin/roles`),
        },
        {
            href: `/admin/users`,
            label: 'Nhân viên',
            description: 'Quản lý nhân viên',
            active: pathname.startsWith(`/admin/users`),
        },
    ]

    const sales = [
        {
            href: `/admin/orders`,
            label: 'Đơn đặt hàng',
            description: 'Quản lý đơn đặt hàng',
            active: pathname.startsWith(`/admin/orders`),
        },
        {
            href: `/admin/coupons`,
            label: 'Phiếu giảm giá',
            description: 'Quản lý phiếu giảm giá',
            active: pathname.startsWith(`/admin/coupons`),
        },
        {
            href: `/admin/customers`,
            label: 'Khách hàng',
            description: 'Quản lý khách hàng',
            active: pathname.startsWith(`/admin/customers`),
        },
        {
            href: `/admin/revenues`,
            label: 'Doanh thu',
            description: 'Quản lý doanh thu',
            active: pathname.startsWith(`/admin/revenues`),
        },
    ]
    
    const products = [
        {
            href: `/admin/products`,
            label: 'Sản phẩm',
            description: 'Quản lý sản phẩm',
            active: pathname.startsWith(`/admin/products`),
        },
        {
            href: `/admin/properties`,
            label: 'Thuộc tính',
            description: 'Quản lý thuộc tính',
            active: pathname.startsWith(`/admin/properties`),
        },
        {
            href: `/admin/categories`,
            label: 'Danh mục',
            description: 'Quản lý danh mục',
            active: pathname.startsWith(`/admin/categories`),
        },
        {
            href: `/admin/brands`,
            label: 'Thương hiệu',
            description: 'Quản lý thương hiệu',
            active: pathname.startsWith(`/admin/brands`),
        },
    ]
    
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem key="dashboards">
                    <Link href="/admin/dashboards"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/admin/dashboards`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Bảng điều khiển</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="products">
                <NavigationMenuTrigger className="h-auto capitalize">Sản phẩm</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[400px]">
                        {products.map((component) => (
                            <ListItem
                                key={component.label}
                                title={component.label}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                        ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem key="users">
                <NavigationMenuTrigger className="h-auto capitalize">Nhân viên</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[400px] ">
                    {users.map((component) => (
                        <ListItem
                            key={component.label}
                            title={component.label}
                            href={component.href}
                        >
                            {component.description}
                        </ListItem>
                    ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem key="orders">
                <NavigationMenuTrigger className="h-auto capitalize">Bán hàng</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[400px] ">
                    {sales.map((component) => (
                        <ListItem
                            key={component.label}
                            title={component.label}
                            href={component.href}
                        >
                            {component.description}
                        </ListItem>
                    ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem key="banners">
                    <Link href="/admin/banners"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/admin/banners`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Banner</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {/* <NavigationMenuItem key="blogs">
                    <Link href="/admin/blogs"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/admin/blogs`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Blog</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem> */}
                {/* <NavigationMenuItem key="settings">
                    <Link href="/admin/settings"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/admin/settings`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Cài đặt</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem> */}
            </NavigationMenuList>
        </NavigationMenu> 
    )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";