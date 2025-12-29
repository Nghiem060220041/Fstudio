import * as z from "zod";

// import { products } from "~/data/db/schema";

// export const productSchema = z.object({
//   name: z.string().min(1, {
//     message: "Must be at least 1 character",
//   }),
//   description: z.string().optional(),
//   category: z
//     .enum(products.category.enumValues, {
//       required_error: "Must be a valid category",
//     })
//     .default(products.category.enumValues[0]),
//   subcategory: z.string().optional().nullable(),
//   price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
//     message: "Must be a valid price",
//   }),
//   inventory: z.number(),
//   images: z
//     .unknown()
//     .refine((val) => {
//       if (!Array.isArray(val)) return false;
//       if (val.some((file) => !(file instanceof File))) return false;
//       return true;
//     }, "Must be an array of File")
//     .optional()
//     .nullable()
//     .default(null),
// });

// export const filterProductsSchema = z.object({
//   query: z.string(),
// });

// export const getProductSchema = z.object({
//   id: z.number(),
//   storeId: z.number(),
// });

export const getCategoriesSchema = z.object({
  keywords: z.string(),
  page: z.number().default(1),
  limit: z.number().default(10),
  offset: z.number().default(0),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
});