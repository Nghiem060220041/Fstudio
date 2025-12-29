import { NextResponse, type NextRequest } from "next/server";
import { type FileWithPath } from "react-dropzone";
import { type ZodIssue, type z } from "zod";

import { type Icons } from "@/lib/icons";
import { cartItemSchema, cartLineItemSchema, checkoutItemSchema } from "@/data/validations/cart";

export type ApiResponseError = {
  ok: false;
  error: string;
  issues?: ZodIssue[];
};

export type ApiResponseSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export type NextRequestContext<T> = {
  params: T;
};

export type NextRouteContext<T = undefined> = {
  params: T;
};

export type NextRouteHandler<T = void, U = NextRouteContext> = (
  request: NextRequest,
  context: U,
) => NextResponse<T> | Promise<NextResponse<T>>;

export type WithChildren<T = unknown> = T & { children: React.ReactNode };

export type LocaleLayoutParams = { params: { locale: string } };

export interface NullLayoutParams {}

export type GeneralShellParams = { header?: React.ReactNode };


export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainMenuItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type CartItem = z.infer<typeof cartItemSchema>;

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}
