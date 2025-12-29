import { Icons } from "@/components/ui/icon";
import Link from "next/link";

export default function LogoStore() {
    return (
        <div>
            <Link href="/admin/dashboards">
                <Icons.apple className="w-8 h-8 ml-2"/>
            </Link>
        </div>
    );
}
