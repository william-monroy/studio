'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  LineChart,
  Users,
  HelpCircle,
} from "lucide-react";

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/questions", label: "Preguntas", icon: HelpCircle },
    { href: "/admin/players", label: "Jugadores", icon: Users },
    { href: "/admin/analytics", label: "Analíticas", icon: LineChart },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map(link => {
                const isActive = link.href === pathname;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActive && "bg-accent text-primary"
                        )}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    );
}
