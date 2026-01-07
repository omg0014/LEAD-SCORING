import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Button
                variant={isActive ? "secondary" : "ghost"}
                asChild
                className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary text-primary"
                )}
            >
                <Link to={to}>
                    <Icon className="h-4 w-4" />
                    {label}
                </Link>
            </Button>
        );
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-border">
                    <h1 className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight uppercase">
                        <Zap className="h-5 w-5 text-primary" />
                        LeadScore
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/rules" icon={Settings} label="Rules Config" />
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest text-center">
                        Student Build v2.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen">
                {children}
            </main>
        </div>
    );
};

export default Layout;
