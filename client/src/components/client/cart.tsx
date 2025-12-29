"use client";

import { Heart, LogIn, LogOut, ShoppingBag, User as UserIcon, UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { deleteCookie, getCookie } from "cookies-next";
import toast from "react-hot-toast";

const NavbarCarts = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
        const checkLogin = async () => {
            const user = await getCookie('user');
            if (user) {
                setIsLogin(true);
            }
        }
        checkLogin();
    }, []);

    const router = useRouter();
    const cart = useCart();

    if (!isMounted) {
        return null;
    }
    const handleLogout = async () => {
        try {
            deleteCookie('user');
            cart.removeAll();
            toast.success('Đăng xuất thành công!');
            router.push('/');
            window.location.reload();
        } catch (error) {
        }
    };

return ( 
    <div className="ml-auto flex items-center gap-x-2">
    <Button onClick={() => router.push('/wishlist')} variant="outline" size="sm">
        <Heart
            className="w-4 h-4"
        />
    </Button>
    <Button onClick={() => router.push('/cart')} variant="outline" size="sm">
        <ShoppingBag
            className="w-4 h-4"
        />
        <span className="ml-2 text-sm font-medium">
          {cart.items.length}
        </span>
    </Button>
    {
        isLogin ? (
            <>
                <Button onClick={() => router.push('/user/profile')} variant="outline" size="sm">
                    <UserIcon
                        className="w-4 h-4"
                    />
                </Button>
                <Button onClick={handleLogout} variant="default" size="sm">
                    <LogOut
                        className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm font-medium">
                    Đăng xuất
                    </span>
                </Button>
            </>
        ): (
            <>         
            <Button onClick={() => router.push('/user/login')} variant="default" size="sm">
                <LogIn
                    className="w-4 h-4"
                />
                <span className="ml-2 text-sm font-medium">
                Đăng nhập
                </span>
            </Button>
            <Button onClick={() => router.push('/user/register')} variant="default" size="sm">
                <UserPlus2
                    className="w-4 h-4"
                />
                <span className="ml-2 text-sm font-medium">
                Đăng ký
                </span>
            </Button>      
            </>
        )
    }  
    </div>
  );
}
 
export default NavbarCarts;