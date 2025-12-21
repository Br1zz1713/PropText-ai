import { FileText, LayoutDashboard, Settings, User } from "lucide-react";

export const navItems = [
    { name: "Generator", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/dashboard/listings", icon: FileText },
    { name: "Billing", href: "/dashboard/billing", icon: Settings },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];
