"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { FileDialog } from "@/components/ui/file-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    UncontrolledFormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isArrayOfFile } from "@/lib/utils";
import { Zoom } from "@/lib/zoom-image";
import { Brand } from "@/types";
import { FileWithPreview } from "@/types/types";
import { getSession } from "next-auth/react";
import Image from "next/image";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface BrandFormProps {
    initialData: Brand | null;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên là bắt buộc.",
    }),
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
    description: z.any(),
});

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    const [errorName, setErrorName] = useState("");
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
    const { isUploading, startUpload } = useUploadThing("productImage");
    
    const title        = "Quản lý thương hiệu";
    const description  = initialData ? "Cập nhật thương hiệu" : "Thêm mới thương hiệu";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";
    
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

    const defaultValues = {
        name: '',
        images: [],
        description: '',
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("description", initialData?.description);
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
                const response = await axios.put(`${URL}/api/brands/${params.brandId}`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/brands');
                    toast.success(toastMessage);
                }else if(response.status===422){
                }
            } else {
                const response = await axios.post(`${URL}/api/brands`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/brands');
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
            const response = await axios.delete(`${URL}/api/brands/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/brands');
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
                        <p>Xóa thương hiệu</p>
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
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên thương hiệu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            {...field}
                                        />
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
                    <div className="flex items-center justify-end">
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/brands')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit">
                            {loading && <Icons.spinner className="h-4 w-4 mr-2 animate-spin" /> }
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default BrandForm;