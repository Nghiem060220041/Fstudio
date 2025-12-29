"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Product } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import ReactSelect from "react-select";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface RelatedFormProps {
    initialData: any;
    product: any;
}

const formSchema = z.object({
    related_products: z.any(),
});

const RelatedForm: React.FC<RelatedFormProps> = ({ initialData, product }) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading]               = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<{ label: string; value: string; }[]>([]);
    
    const toastMessage = initialData && "Cập nhật thành công";
    const action = "Cập nhật";

    const defaultValues = {
        related_products: [
            {
                label: '',
                value: ''
            }
        ],
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const options = initialData && initialData.map((product: Product) => ({
        label: <div className="flex items-center"><img src={product.image.path}className="w-8 h-8 mr-2 object-cover" />{ product.name }</div>,
        value: product.id,
    }));    

    useEffect(() => {
        if (product && product?.related_products.length > 0) {
            const newProperties = product?.related_products.map((i: any) => ({
                  label: <div key={i.data.name} className="flex items-center"><img src={i.data.image.path}className="w-8 h-8 mr-2 object-cover" />{ i.data.name }</div>,
                  value: i.data.id,
            }));
            form.setValue("related_products", newProperties);
        }
    }, [product]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const options = selectedOption.map((opt) => ({
                value: opt.value
            }))
            const datas = {
                options,
            };

            if (initialData) {
                const response = await axios.post(`${URL}/api/products/${params.productId}/add-product-related`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="related_products"
                        render={({ field }) => (
                            <FormItem className="w-full flex flex-col gap-1.5">
                                <FormLabel>Sản phẩm liên quan</FormLabel>
                                <ReactSelect
                                    value={field.value}
                                    placeholder="Chọn sản phẩm liên quan"
                                    loadingMessage={() => 'Đang tìm kiếm lựa chọn của bạn.'}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    noOptionsMessage={() => selectedOption.length === 4 ? 'Bạn đã chọn tối đa 4 sản phẩm gợi ý đi kèm.' :'Không tìm thấy lựa chọn phù hợp nào.'}
                                    onChange={(selectedOptions) => {
                                        if (selectedOptions && Array.isArray(selectedOptions)) {
                                            const selectedValues = selectedOptions.map(option => ({
                                                label: option.label,
                                                value: option.value
                                            }));
                                            field.onChange(selectedValues);
                                            setSelectedOption(selectedValues);
                                        }
                                    }}
                                    options={selectedOption.length === 4 ? [] : options}
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
                            </FormItem>
                        )}
                    />
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

export default RelatedForm;