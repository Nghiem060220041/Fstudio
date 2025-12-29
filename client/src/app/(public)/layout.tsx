import Footer from "@/components/client/footer";
import NavbarClient from "@/components/client/navbar";
import Loading from "./loading";

export default async function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
    }) {
    
    return (
        <>
            <Loading />
            <NavbarClient />
            {children}
            <Footer/>
        </>
    )
}