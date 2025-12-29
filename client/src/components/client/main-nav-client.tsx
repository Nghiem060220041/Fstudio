"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useSWRImmutable from "swr/immutable";

const URL = process.env.NEXT_PUBLIC_URL_API;

export function MainNavClient({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const { data: categories } = useSWRImmutable<Category | null>([`${URL}/api/categories/public-store/get-listmenu`],
          (url: string) =>
          axios
              .get(url)
              .then((res) => res.data.data)
      );

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {
                    categories && (categories.map((category: Category) => (
                        <NavigationMenuItem key={category.slug}>
                            <Link href={`/category/${category.slug}`}
                                className={cn("text-sm font-medium transition-colors hover:text-primary",
                                        pathname.startsWith(`/category/${category.slug}`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                                )} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <TooltipProvider>
                                        <p className="h-auto capitalize">{category.name}</p>
                                </TooltipProvider>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )))
                }
                {/* <NavigationMenuItem key="blog">
                    <Link href="/blog"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/blog`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Blog</p>
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