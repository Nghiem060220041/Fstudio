"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MinusCircleIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDialog } from "@/components/ui/file-dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    UncontrolledFormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactSelect from "react-select"
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isArrayOfFile } from "@/lib/utils";
import { Zoom } from "@/lib/zoom-image";
import { Brand, Category, Product } from "@/types";
import { FileWithPreview } from "@/types/types";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Tiptap from "@/components/Tiptap";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface ProductFormProps {
    initialData: Product | null;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên sản phẩm là bắt buộc.",
    }).max(191, {
        message: "Tối đa 191 ký tự.",
    }),
    category_id: z.string().min(1, {
        message: "Vui lòng chọn danh mục sản phẩm.",
    }),
    brand_id: z.string().min(1, {
        message: "Vui lòng chọn thương hiệu sản phẩm",
    }),
    sku: z.string().min(1, {
        message: "SKU sản phẩm là bắt buộc.",
    }).max(191, {
        message: "Tối đa 191 ký tự.",
    }),
    quantity: z.any(),
    price: z.any(),
    images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Phải là một mảng Tệp")
    .optional()
    .nullable()
    .default(null),
    active:z.boolean().default(false).optional(),
    trending:z.boolean().default(false).optional(),
    many_version:z.boolean().default(false).optional(),
    description: z.any(),
    properties: z.array(
        z.object({
            property_options: z.any(),
            price: z.any(),
            quantity: z.any()
        })
    ),
});

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen]                       = React.useState(false);    
    const [loading, setLoading]                 = React.useState(false);
    const [brands, setBrands]                   = React.useState([]);
    const [categories, setCategories]           = React.useState([]);
    const [files, setFiles]                     = React.useState<FileWithPreview[] | null>(null);
    const [isMany, setIsMany]                   = React.useState(false);
    const [selects, setSelects]                 = React.useState([]);
    const { isUploading, startUpload }          = useUploadThing("productImage");
    
    const title        = "Quản lý sản phẩm";
    const description  = initialData ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const defaultValues = {
        name: '',
        sku: '',
        quantity: '',
        brand_id: '',
        category_id: '',
        price: '',
        images: [],
        description: '',
        active: false, 
        many_version: false, 
        trending: false,
        properties: [
            {
                property_options: [],
                quantity: '',
                price: ''
            }
        ]
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "properties"
      });

    useEffect(() => {
        if (initialData?.image) {
            const imageURL = initialData?.image.path;
            const fileName = imageURL.match(/[^/]+$/)?.[0];
            if (fileName) {
              const file = new File([], fileName, {
                type: 'image',
              });
    
              const fileWithPreview = Object.assign(file, {
                preview: imageURL,
              });
    
              setFiles([fileWithPreview]);
            }
        }
      }, [initialData?.image]);

    useEffect(() => {
        const fetchSelect = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-option`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                  setSelects(data);
              } else {
                setSelects([]);
              }
            } catch (error) {
            }
        };
        const fetchBrand = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-brand`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                  setBrands(data);
              } else {
                setBrands([]);
              }
            } catch (error) {
            }
            };
        const fetchCategory = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-category`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                setCategories(data);
              } else {
                setCategories([]);
              }
            } catch (error) {
            }
          };
      
          fetchBrand();
          fetchCategory();
          fetchSelect();
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("sku", initialData?.sku);
            form.setValue("brand_id", initialData?.brand_id.toString());
            form.setValue("category_id", initialData?.category_id.toString());
            if (initialData?.many_version) {
            } else {
                form.setValue("quantity", (initialData?.quantity - initialData?.sold_quantity).toString());
            }
            form.setValue("price", (initialData?.price ? initialData?.price : 0).toString());
            form.setValue("description", initialData?.description);
            form.setValue("active", initialData?.active);
            form.setValue("many_version", initialData?.many_version);
            form.setValue("trending", initialData?.trending);
            setIsMany(initialData?.many_version);
            const newProperties = initialData?.skus.map((i: any) => {
                i.property_options = i.property_options.map((a:any) => ({
                  ...a,
                  label: a.name,
                  value: a.id,
                }));
                return i;
            });
            form.setValue("properties", newProperties);
        }
    }, [initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const images = isArrayOfFile(data.images)
            ? await startUpload(data.images).then((res) => {
                const formattedImages = res?.map((image) => ({
                  id: image.key,
                  name: image.key.split("_")[1] ?? image.key,
                  url: image.url,
                }));
                return formattedImages ?? null;
              })
                : null;
            
            const datas = {
                ...data,
                images
            };

            if (initialData) {
                const response = await axios.put(`${URL}/api/products/${params.productId}`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/products`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                } else if (response.status = 422) {
                    
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/products/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/products');
                toast.success("Xóa thành công");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={ onDelete }
                loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />
                {initialData && (
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}>
                            <Trash className="h-4 w-4" />
                        </Button> 
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Xóa sản phẩm</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên sản phẩm</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên sản phẩm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="SKU"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="brand_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thương hiệu</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn thương hiệu"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {brands.map((brand: Brand) => (
                                            <SelectItem key={brand.id} value={brand.id.toString()}>
                                            {brand.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn danh mục"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {categories.map((category: Category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="many_version"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                    <Checkbox
                                        disabled={loading}
                                        checked={field.value}
                                        onCheckedChange={(isChecked: boolean) => {
                                            field.onChange(isChecked);
                                            setIsMany(isChecked);
                                        }}
                                    />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Có nhiều phiên bản
                                        </FormLabel>
                                        <FormDescription>
                                        Khi chọn điều này, sản phẩm sẽ có thể tạo được nhiều thuộc tính.
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        isMany ? (
                            fields.map((item, i) => {
                                return (
                                    <div key={i} className="grid grid-cols-1 gap-3">
                                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <Controller
                                            name={`properties.${i}.property_options`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <AttributeSelect
                                                    label='Thuộc tính'
                                                    placeholder='Chọn thuộc tính'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    innerRef={field.ref}
                                                />
                                            )}
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`properties.${i}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Số lượng</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    disabled={loading}
                                                                    placeholder="Số lượng"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`properties.${i}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Đơn giá</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    disabled={loading}
                                                                    placeholder="Đơn giá"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="pt-8">
                                                <Button variant="destructive" size="icon" type="button" onClick={() => remove(i)}>
                                                    <MinusCircleIcon className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="grid grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                disabled={loading}
                                                placeholder="Số lượng"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đơn giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                disabled={loading}
                                                placeholder="Đơn giá"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        )
                    }
                    {
                        isMany && (
                            <Button
                                className="w-full"
                                variant="outline"
                                type="button"
                                onClick={() =>
                                    append({
                                        property_options: [],
                                        price: "",
                                        quantity: "",
                                    })
                                  }
                            >
                                Thêm thuộc tính
                            </Button>
                        )
                    }
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Tiptap description={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormItem className="w-full flex flex-col gap-1.5">
                        <FormLabel>Hình ảnh</FormLabel>
                        {files?.length ? (
                            <div className="flex items-center gap-2">
                            {files.map((file, i) => (
                                <Zoom key={i}>
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                                    width={80}
                                    height={80}
                                />
                                </Zoom>
                            ))}
                            </div>
                        ) : null}
                        <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name="images"
                            maxFiles={1}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={loading}
                        />
                        </FormControl>
                        <UncontrolledFormMessage
                            message={form.formState.errors.images?.message}
                        />
                    </FormItem>
                    <div className="grid grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Hiển thị
                                </FormLabel>
                                <FormDescription>
                                Sản phẩm sẽ hiển thị ở trang chủ.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="trending"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Nổi bật
                                </FormLabel>
                                <FormDescription>
                                Sản phẩm được đưa vào trang nổi bật.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/products')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button disabled={loading} type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default ProductForm;

type PropertyOption = {
    label: string;
    options: {
     label: string;
        id: number;
     value: string;
      properties: {
        id: number;
        label: string;
      };
    }[];
  }[];
const AttributeSelect = (props: any) => {
    const [properties, setProperties] = React.useState([]);
    useEffect(() => {
        const fetchSelect = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-option`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                setProperties(data);
            } else {
                setProperties([]);
            }
        } catch (error) {
        }
    };
    fetchSelect();
    }, []);
    const [originalOptions, setOriginalOptions] = React.useState<PropertyOption>([]);
    const [options, setOptions] = React.useState<PropertyOption>([]);
    
    useEffect(() => {
        if (properties) {
        const newAttributes = properties.map((i:any) => {
          const attributeValues = i.property_options.map((a:any) => ({
            ...a,
              label: a.name,
              value: a.id,
          }));
  
          return {
            label: i.name,
            value: i.id,
            options: attributeValues,
          };
        });
        setOriginalOptions(newAttributes);
        setOptions(newAttributes);
      }
    }, [properties]);
  
    const handleChange = (selectedOption: any) => {
      props.onChange(selectedOption);
  
      let newGroupedOptions = [];
      newGroupedOptions = originalOptions?.filter((e: any) => {
        const found = e.options.find((k: any) => {
          const res = selectedOption.find((i: any) => i.name === k.name);
          return res ? true : false;
        });
  
        return found ? false : true;
      });
  
      setOptions(newGroupedOptions);
    };
  
    return (
      <div className="w-full">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Chọn thuộc tính
        </label>
  
        <ReactSelect
          {...props}
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          options={options}
          onChange={handleChange}
          isMulti
          noOptionsMessage={() => 'Không tìm thấy lựa chọn phù hợp nào.'}
          className="py-2"
          closeMenuOnSelect={false}
          styles={{
            container: (base:any) => ({
              ...base,
              width: '100%',
            }),
            control: (base:any) => ({
              ...base,
              background: '#FFFFFF',
              border: '1px solid #e2e8f0',
              borderColor: 'none',
              borderRadius: 6,
              minHeight: 40,
              boxShadow: 'none',
            }),
            menu: (base:any) => ({
              ...base,
              background: '#fff',
              fontSize: 14,
              borderRadius: 6,
              overflow: 'hidden',
              minWidth: 360,
            }),
            menuList: (base:any) => ({
              ...base,
            }),
            valueContainer: (base:any) => ({
              ...base,
              fontSize: 14,
            }),
            option: (styles: any, { isSelected }: any) => ({
              ...styles,
              backgroundColor: isSelected ? '#848a95' : null,
              color: isSelected ? 'white' : null,
              ':hover': {
                backgroundColor: isSelected ? null : '#f1f5f9',
                color: isSelected ? null : '#000000',
              },
              ':active': {
                backgroundColor: null,
                color: null,
              },
            }),
          }}
        />
      </div>
    );
  };