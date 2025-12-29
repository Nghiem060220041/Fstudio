"use server";

import { revalidatePath } from "next/cache";
import { type StoredFile } from "@/types/types";
import { type z } from "zod";
import { getCategoriesSchema } from "@/data/validations/category";
import { Category } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";

const URL = process.env.NEXT_PUBLIC_URL_API;

// export async function filterProductsAction(query: string) {
//   if (query.length === 0) return null;

//   const filteredProducts = await db
//     .select({
//       id: products.id,
//       name: products.name,
//       category: products.category,
//     })
//     .from(products)
//     .where(like(products.name, `%${query}%`))
//     .orderBy(desc(products.createdAt))
//     .limit(10);

//   const productsByCategory = Object.values(products.category.enumValues).map(
//     (category) => ({
//       category,
//       products: filteredProducts.filter(
//         (product) => product.category === category,
//       ),
//     }),
//   );

//   return productsByCategory;
// }

export async function getCategoriesAction(
  input: z.infer<typeof getCategoriesSchema>,
) {
    const session = await getSession();
    const [column, order] =
    (input.sort?.split(".") as [
      keyof Category | undefined,
      "asc" | "desc" | undefined,
        ]) ?? [];
    
    const response = await axios.get(`${URL}/api/categories`, {
        params: {
            sort_key: column,
            order_by: order,
            per_page: input.limit,
            page: input.page,
            keywords: input.keywords
        },
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        }
    });
    const items = response.data.data;
    const total = response.data.total;

    return {
        items,
        total,
    };
}

// export async function checkProductAction(input: { name: string; id?: number }) {
//   const productWithSameName = await db.query.products.findFirst({
//     where: input.id
//       ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
//       : eq(products.name, input.name),
//   });

//   if (productWithSameName) {
//     throw new Error("Product name already taken.");
//   }
// }

// export async function addProductAction(
//   input: z.infer<typeof productSchema> & {
//     storeId: number;
//     images: StoredFile[] | null;
//   },
// ) {
//   const productWithSameName = await db.query.products.findFirst({
//     columns: {
//       id: true,
//     },
//     where: eq(products.name, input.name),
//   });

//   if (productWithSameName) {
//     throw new Error("Product name already taken.");
//   }

//   await db.insert(products).values({
//     ...input,
//     storeId: input.storeId,
//     images: input.images,
//   });

//   revalidatePath(`/dashboard/stores/${input.storeId}/products.`);
// }

// export async function updateProductAction(
//   input: z.infer<typeof productSchema> & {
//     storeId: number;
//     id: number;
//     images: StoredFile[] | null;
//   },
// ) {
//   const product = await db.query.products.findFirst({
//     where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
//   });

//   if (!product) {
//     throw new Error("Product not found.");
//   }

//   await db.update(products).set(input).where(eq(products.id, input.id));

//   revalidatePath(`/dashboard/stores/${input.storeId}/products/${input.id}`);
// }

// export async function deleteProductAction(
//   input: z.infer<typeof getProductSchema>,
// ) {
//   const product = await db.query.products.findFirst({
//     columns: {
//       id: true,
//     },
//     where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
//   });

//   if (!product) {
//     throw new Error("Product not found.");
//   }

//   await db.delete(products).where(eq(products.id, input.id));

//   revalidatePath(`/dashboard/stores/${input.storeId}/products`);
// }

// export async function getNextProductIdAction(
//   input: z.infer<typeof getProductSchema>,
// ) {
//   const product = await db.query.products.findFirst({
//     columns: {
//       id: true,
//     },
//     where: and(eq(products.storeId, input.storeId), gt(products.id, input.id)),
//     orderBy: asc(products.id),
//   });

//   if (!product) {
//     throw new Error("Product not found.");
//   }

//   return product.id;
// }

// export async function getPreviousProductIdAction(
//   input: z.infer<typeof getProductSchema>,
// ) {
//   const product = await db.query.products.findFirst({
//     columns: {
//       id: true,
//     },
//     where: and(eq(products.storeId, input.storeId), lt(products.id, input.id)),
//     orderBy: desc(products.id),
//   });

//   if (!product) {
//     throw new Error("Product not found.");
//   }

//   return product.id;
// }