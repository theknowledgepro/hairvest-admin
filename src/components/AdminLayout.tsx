import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Users, Shield, LogOut, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';

export const AdminLayout: React.FC = () => {
    const { user, clearAuth } = useAuthStore();
    const location = useLocation();

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/auth/login';
    };

    const navLinks = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Staff Members', path: '/admin/members', icon: Users },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 flex text-white font-sans overflow-hidden">
            {/* Sidebar - Premium Glassmorphism Look */}
            <aside className="w-64 bg-neutral-900/40 backdrop-blur-3xl border-r border-neutral-800 flex flex-col transition-all duration-300 relative z-20">
                <div className="h-16 flex items-center px-6 border-b border-neutral-800/60">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Hairvest</div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3 mt-2">
                    <div className="text-xs uppercase text-neutral-500 font-semibold mb-2 px-3 tracking-wider">Dashboard</div>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive
                                    ? 'bg-blue-600/10 text-blue-400'
                                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                                    }`}
                            >
                                <link.icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-white'}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-neutral-800/60">
                    <div className="flex items-center gap-3 bg-neutral-800/30 p-2.5 rounded-xl border border-neutral-800/60 transition hover:bg-neutral-800/50">
                        <Avatar className="h-8 w-8 ring-1 ring-neutral-700">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.email || 'Admin User'}</p>
                            <p className="text-xs text-neutral-500 truncate">{user?.role || 'Administrator'}</p>
                        </div>
                        <button onClick={handleLogout} className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-400/10" aria-label="Log out">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-neutral-950 relative">
                {/* Subtle background glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

                <header className="h-16 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold tracking-tight text-white capitalize">
                            {location.pathname.split('/').pop() === 'admin' ? 'Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
                        </h1>
                    </div>
                    <div className="flex-1 max-w-md px-8 relative hidden md:block">
                        <Search className="absolute left-11 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                        <Input
                            placeholder="Search anything..."
                            className="bg-neutral-900 border-neutral-800 pl-10 text-sm h-9 w-full focus-visible:ring-blue-500 rounded-full"
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative z-0 hide-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
