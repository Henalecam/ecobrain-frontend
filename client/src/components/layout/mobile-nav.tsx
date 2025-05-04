import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ReceiptText, BarChart, User, Plus } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/transactions", label: "Transações", icon: <ReceiptText className="h-5 w-5" /> },
    { href: "/reports", label: "Relatórios", icon: <BarChart className="h-5 w-5" /> },
    { href: "/profile", label: "Perfil", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-sidebar shadow-lg flex justify-around items-center px-2 py-3 z-20 border-t border-border">
      {navItems.map((item, index) => {
        if (index === 2) {
          // Add the center button after the second item
          return (
            <>
              <Link
                key="add-transaction"
                href="/transactions/new"
                className="flex flex-col items-center"
              >
                <div className="bg-primary text-primary-foreground p-3 rounded-full -mt-8 shadow-md">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 invisible">Adicionar</span>
              </Link>
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center",
                  location === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center",
              location === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
