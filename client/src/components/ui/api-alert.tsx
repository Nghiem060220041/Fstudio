"use client";

import { Check, Copy, Ticket } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Progress } from "./progress";

interface ApiAlertProps {
    title: string;
    description: string;
    notice: any;
    type: boolean;
    percent: number;
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    notice,
    type,
    percent
}) => {
    const [check, setCheck] = useState(false);

    const onCopy = (description: string) => {
        setCheck(true);
        setTimeout(() => {
            setCheck(false);
        }, 500);
        navigator.clipboard.writeText(description);

        toast.success("Đã sao chép mã giảm giá");
    };
    return (
        <Alert className="my-2">
            <Ticket className="h-5 w-5" />
            <AlertTitle className="flex gap-x-2 align-middle leading-2">
                <div className="grid grid-cols-12 gap-x-12">
                    <span className="col-span-9">
                        {title}
                    </span>
                    <div className="col-span-3">
                        {
                            (type) ? (
                                <Badge className={`flex w-[120px] justify-center text-center rounded-full text-xs px-2 py-1 ${notice && (new Date() > new Date(notice) ? "bg-red-100 text-red-600 hover:bg-red-100/90" : "bg-green-100 text-green-600 hover:bg-green-100/90")}`}>
                                    {notice && (new Date() > new Date(notice) ? "Đã hết hạn" : "Đang diễn ra")}
                                </Badge>
                            ) : (
                                <Badge className={`flex w-[120px] justify-center text-center rounded-full text-xs px-2 py-1 bg-green-100 text-green-600 hover:bg-green-100/90`}>
                                    Đang diễn ra
                                </Badge>  
                            )
                        }
                    </div>
                </div>    
            </AlertTitle>
            <AlertDescription className="mt-4">
                <div className=" items-center justify-between flex">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {description}
                    </code>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCopy(description)}
                    >
                        {(!check && <Copy className="h-4 w-4" />) || (
                            <Check className="h-4 w-4 text-green-500" />
                            )}
                    </Button>
                </div>
                <div>
                    <span className="font-semibold text-xs mt-2">Đã sử dụng: { percent }%</span>
                    <Progress
                        value={percent}
                        className="my-2"
                        indicatorColor={percent>=80?"bg-red-500":"bg-green-300"}
                        indicatorColorBg={percent>=80?"bg-red-100":"bg-green-100"}
                    />
                </div>
            </AlertDescription>
        </Alert>
    );
};