import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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
            {/* Mobile Menu Toggle */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-background/80 backdrop-blur-md border-border shadow-lg">
                    {isMobileMenuOpen ? <Zap className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
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
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
