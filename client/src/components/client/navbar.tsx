import { ModeToggle } from "@/components/select-template";
import Link from "next/link";
import { MainNavClient } from "./main-nav-client";
import { CommandMenu } from "./search";
import NavbarCarts from "./cart";

const NavbarClient = async () => {
    
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10 items-center">
                    <Link href="/"><img src="/favicon.png"/></Link>
                    <MainNavClient className="flex"/>
                </div>
                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <div className="flex-none">
                    <CommandMenu />
                    </div>
                    <ModeToggle />
                    {/* {authenticated ? <UserNav /> : <LoginDialog />} */}
                    <NavbarCarts />
                </div>
            </div>
        </header>
    )
}

export default NavbarClient;