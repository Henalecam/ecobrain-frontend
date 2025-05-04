import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart,
  Award,
  TrendingUp,
  Settings,
  Leaf,
  Lightbulb,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { href: "/transactions", label: "Transações", icon: <ReceiptText className="mr-3 h-5 w-5" /> },
    { href: "/budget", label: "Orçamento", icon: <Wallet className="mr-3 h-5 w-5" /> },
    { href: "/reports", label: "Relatórios", icon: <BarChart className="mr-3 h-5 w-5" /> },
    { href: "/insights", label: "Insights", icon: <Lightbulb className="mr-3 h-5 w-5" /> },
    { href: "/goals", label: "Metas", icon: <Award className="mr-3 h-5 w-5" /> },
    { href: "/investments", label: "Investimentos", icon: <TrendingUp className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-sidebar shadow-md z-10">
      <div className="p-4 border-b border-border">
        <h1 className="font-heading font-bold text-2xl text-primary flex items-center">
          <Leaf className="mr-2 h-6 w-6" />
          EcoBrain
        </h1>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg mb-1 font-medium transition-colors",
                location === item.href 
                  ? "text-primary bg-sidebar-accent dark:bg-sidebar-accent" 
                  : "text-muted-foreground hover:text-primary hover:bg-sidebar-accent dark:hover:bg-sidebar-accent"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName || ''}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || user?.username}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors" 
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
