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

const URL = process.env.NEXT_PUBLIC_URL_API;

interface GalleryFormProps {
    initialData: Product | null;
}

const formSchema = z.object({
    galleries: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Phải là một mảng Tệp")
    .optional()
    .nullable()
    .default(null)
});

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const GalleryForm: React.FC<GalleryFormProps> = ({ initialData }) => {
    const router = useRouter();
    const params = useParams();
    const [open, setOpen]                       = React.useState(false);    
    const [loading, setLoading]                 = React.useState(false);

    const [files, setFiles]                     = React.useState<FileWithPreview[] | null>(null);
    const { isUploading, startUpload }          = useUploadThing("productImage");
    
    const title        = "Quản lý thư viện ảnh";
    const description  = initialData && "Cập nhật thư viện ảnh";
    const toastMessage = initialData && "Cập nhật thành công";
    const action = "Cập nhật thư viện ảnh";

    const defaultValues = {
        galleries: [],
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData?.galleries && initialData?.galleries.length > 0) {
            setFiles(initialData?.galleries.map((image) => {
                const file = new File([], image.product_id.toString(), {
                    type: "image",
                });
                const fileWithPreview = Object.assign(file, {
                    preview: image.image.path,
                });
      
                return fileWithPreview;
            }),
            )
        }
      }, [initialData?.galleries]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const galleries = isArrayOfFile(data.galleries)
            ? await startUpload(data.galleries).then((res) => {
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
                galleries,
            };

            if (initialData) {
                const response = await axios.post(`${URL}/api/products/${params.productId}/add-gallery`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
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
                            name="galleries"
                            maxFiles={10}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={loading}
                        />
                        </FormControl>
                        <UncontrolledFormMessage
                            message={form.formState.errors.galleries?.message}
                        />
                    </FormItem>
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

export default GalleryForm;