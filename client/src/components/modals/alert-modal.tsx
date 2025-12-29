"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";

interface AlertModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean,
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMouted, setIsMouted] = useState(false);

    return (
        <Modal
            title="Bạn có chắc chắn muốn xóa?"
            description="Khi xác nhận dữ liệu sẽ bị xóa vĩnh viễn."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    Huỷ
                </Button>
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={onConfirm}
                >
                    {loading &&
                        (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )
                    }
                    Xoá
                </Button>
            </div>
        </Modal>
    );
}