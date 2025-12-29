"use client"

import { StoreModal } from "@/app/(protected)/admin/(dashboard)/(routes)/categories/new/page";
import { useState, useEffect } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal/>
        </>
    )
}