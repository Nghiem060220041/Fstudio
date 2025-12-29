"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import axios from "axios";
import { CalendarIcon, Check, ChevronsUpDown, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { DateField, DatePicker } from "@/components/ui/date-picker";
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
import { Icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, isArrayOfFile } from "@/lib/utils";
import { Zoom } from "@/lib/zoom-image";
import { District, Province, Role, User, Ward } from "@/types";
import { FileWithPreview } from "@/types/types";
import { getSession } from "next-auth/react";
import Image from "next/image";
import useSWR from "swr";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import useSWRImmutable from "swr/immutable";
import { Checkbox } from "@/components/ui/checkbox";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface UserFormProps {
    initialData: User | null;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên là bắt buộc.",
    }),
    phone: z.string().min(1, {
        message: "Điện thoại là bắt buộc.",
    }).min(10, {
        message: "Điện thoại ít nhất 10 chữ số",
    }).max(15, {
        message: "Điện thoại tối đa 15 chữ số",
    }),
    email: z.string().min(1, {
        message: "Email là bắt buộc.",
    }).email({
        message: "Phải là định dạng email."
    }).max(60, {
        message: "Email tối đa 60 ký tự",
    }),
    dob: z.date(),
    gender: z.string(),
    address: z.string(),
    roleId: z.string(),
    password: z.string().min(1, {
        message: "Mật khẩu là bắt buộc.",
    }).min(8, {
        message: "Mật khẩu tối thiểu là 8 ký tự.",
    }).max(20, {
        message: "Mật khẩu tối đa là 20 ký tự.",
    }),
    provinceId: z.string().min(1, {
        message: "Vui lòng chọn tỉnh/thành phố."
    }),
    districtId: z.string().min(1, {
        message: "Vui lòng chọn quận/huyện."
    }),
    wardId: z.string().min(1, {
        message: "Vui lòng chọn xã/phường/thị trấn."
    }),
    active: z.boolean(),
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

const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorDob, setErrorDob] = useState("");
    const [files, setFiles] = useState<FileWithPreview[] | null>(null);
    const { isUploading, startUpload } = useUploadThing("productImage");
    const [provinceIdd, setProvinceIdd ] = useState("");
    const [districtIdd, setDistrictIdd ] = useState("");
    
    const title        = "Quản lý người dùng";
    const description  = initialData ? "Cập nhật người dùng" : "Thêm mới người dùng";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const { data: provinces } = useSWRImmutable<Province[] | null>([`${URL}/api/homes/get-provinces`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );

    const { data: districts } = useSWR<District[] | null>([`${URL}/api/homes/get-districts/${provinceIdd}`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );

    const { data: wards } = useSWR<Ward[] | null>([`${URL}/api/homes/get-wards/${districtIdd}`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );

    const { data: roles } = useSWRImmutable<Role[] | null>([`${URL}/api/homes/get-roles`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    
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
        phone: '',
        email: '',
        password: '',
        gender: '',
        dob: new Date(),
        address: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        roleId: '',
        active: false,
        images: [],
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("phone", initialData?.phone);
            form.setValue("email", initialData?.email);
            form.setValue("gender", initialData?.gender);
            form.setValue("address", initialData?.address);
            form.setValue("provinceId", initialData?.provinceId);
            form.setValue("districtId", initialData?.districtId);
            form.setValue("wardId", initialData?.wardId);
            form.setValue("roleId", initialData?.roleId);
            form.setValue("active", initialData?.active);
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
                const response = await axios.put(`${URL}/api/users/${params.brandId}`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/users');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/users`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/users');
                    toast.success(toastMessage);
                }
            }
        } catch (error: any) {
            toast.error("Đã xảy ra lỗi");
            if (error.response.data.statusCode == 400) {
                if (error.response.data.data.phone) {
                    setErrorPhone(error.response.data.data.phone[0])
                }
                if (error.response.data.data.email) {
                    setErrorEmail(error.response.data.data.email[0])
                }
                if (error.response.data.data.dob) {
                    setErrorEmail(error.response.data.data.dob[0])
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/users/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/users');
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
                        <p>Xóa người dùng</p>
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
                                    <FormLabel>Tên người dùng</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên người dùng"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ngày sinh</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Chọn ngày</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown-buttons"
                                                    fromYear={1970}
                                                    toYear={2023}
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={loading || ((date) => date > new Date())}
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    <FormMessage>{errorDob && errorDob}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                    <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>{errorEmail && errorEmail}</FormMessage>
                                </FormItem>
                            )}
                        /> 
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Điện thoại</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Điện thoại"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>{errorPhone && errorPhone}</FormMessage>
                                </FormItem>
                            )}
                        /> 
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                    <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            disabled={loading}
                                            placeholder="Mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> 
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giới tính</FormLabel>
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
                                            placeholder="Chọn giới tính"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key="male" value="0">
                                               Nam
                                            </SelectItem>
                                            <SelectItem key="female" value="1">
                                                Nữ
                                            </SelectItem>
                                            <SelectItem key="other" value="2">
                                                Khác
                                            </SelectItem>
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
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quyền</FormLabel>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full flex px-3 font-normal justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                            {field.value
                                                ? roles && (roles.find(
                                                    (role) => role.id == field.value
                                                )?.name)
                                                : "Chọn vai trò"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 h-[300px]">
                                        <Command>
                                            <CommandInput placeholder="Chọn vai trò..." />
                                            <CommandEmpty>Không tìm thấy vai trò nào.</CommandEmpty>
                                            <CommandGroup>
                                                <ScrollArea className="flex max-h-[240px] flex-col" type="always">
                                                    {roles&&roles.map((role) => (
                                                        <CommandItem
                                                        value={role.id.toString()}
                                                        key={role.id}
                                                        onSelect={() => {
                                                            form.setValue("roleId", role.id.toString());
                                                        }}
                                                        >
                                                        <Check
                                                            className={cn(
                                                            "mr-2 h-4 w-4",
                                                            role.id == field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                        />
                                                        {role.name}
                                                        </CommandItem>
                                                    ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> 
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="provinceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tỉnh / Thành phố</FormLabel>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full flex px-3 font-normal justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                            {field.value
                                                ? provinces && (provinces.find(
                                                    (province) => province.id == field.value
                                                )?.name)
                                                : "Chọn tỉnh thành phố"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 h-[300px]">
                                        <Command>
                                            <CommandInput placeholder="Chọn tỉnh thành phố..." />
                                            <CommandEmpty>Không tìm thấy tỉnh thành phố nào.</CommandEmpty>
                                            <CommandGroup>
                                                <ScrollArea className="flex max-h-[240px] flex-col" type="always">
                                                    {provinces&&provinces.map((province) => (
                                                        <CommandItem
                                                        value={province.id.toString()}
                                                        key={province.id}
                                                        onSelect={() => {
                                                            form.setValue("provinceId", province.id.toString());
                                                            setProvinceIdd(province.id)
                                                        }}
                                                        >
                                                        <Check
                                                            className={cn(
                                                            "mr-2 h-4 w-4",
                                                            province.id == field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                        />
                                                        {province.name}
                                                        </CommandItem>
                                                    ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> 
                       <FormField
                            control={form.control}
                            name="districtId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quận / Huyện</FormLabel>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full flex px-3 font-normal justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                            {field.value
                                                ? districts && (districts.find(
                                                    (district) => district.id == field.value
                                                )?.name)
                                                : "Chọn quận huyện"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 h-[300px]">
                                        <Command>
                                            <CommandInput placeholder="Chọn quận huyện..." />
                                            <CommandEmpty>Không tìm thấy quận huyện nào.</CommandEmpty>
                                            <CommandGroup>
                                                <ScrollArea className="flex max-h-[240px] flex-col" type="always">
                                                    {districts&&districts.map((district) => (
                                                        <CommandItem
                                                        value={district.id.toString()}
                                                        key={district.id}
                                                        onSelect={() => {
                                                            form.setValue("districtId", district.id.toString());
                                                            setDistrictIdd(district.id)
                                                        }}
                                                        >
                                                        <Check
                                                            className={cn(
                                                            "mr-2 h-4 w-4",
                                                            district.id == field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                        />
                                                        {district.name}
                                                        </CommandItem>
                                                    ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> 
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="wardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phường / Xã</FormLabel>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full flex px-3 font-normal justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                            {field.value
                                                ? wards && (wards.find(
                                                    (ward) => ward.id == field.value
                                                )?.name)
                                                : "Chọn phường xã"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 h-[300px]">
                                        <Command>
                                            <CommandInput placeholder="Chọn phường xã..." />
                                            <CommandEmpty>Không tìm thấy phường xã nào.</CommandEmpty>
                                            <CommandGroup>
                                                <ScrollArea className="flex max-h-[240px] flex-col" type="always">
                                                    {wards&&wards.map((ward) => (
                                                        <CommandItem
                                                        value={ward.id.toString()}
                                                        key={ward.id}
                                                        onSelect={() => {
                                                            form.setValue("wardId", ward.id.toString());
                                                        }}
                                                        >
                                                        <Check
                                                            className={cn(
                                                            "mr-2 h-4 w-4",
                                                            ward.id == field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                        />
                                                        {ward.name}
                                                        </CommandItem>
                                                    ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> 
                       <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Địa chỉ"
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
                                Tài khoản người dùng sẽ bị vô hiệu hóa nếu tắt ở đây.
                                </FormDescription>
                            </div>
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
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/users')} className="ml-auto mr-2" type="button">
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

export default UserForm;