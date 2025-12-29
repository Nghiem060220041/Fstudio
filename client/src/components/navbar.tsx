import { MainNav } from "@/components/main-nav";
import LogoStore from "@/components/logo-store";
import UserNav from "@/components/user-nav";
import {ModeToggle} from "@/components/select-template";
import { Separator } from "@/components/ui/separator";

const Navbar = async () => {
    
    return (
        <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10 items-center">
                    <LogoStore />
                    <MainNav className="flex"/>
                </div>
                <div className="flex items-center">
                    <ModeToggle />
                    <Separator orientation="vertical"/>
                    <UserNav />
                </div>
            </div>
        </header>
    )
}

export default Navbar;