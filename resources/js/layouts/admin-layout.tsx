import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  BarChart3,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const adminNav = [
  { title: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { title: 'Pharmacies', href: '/admin/pharmacies', icon: Building2 },
  { title: 'Commandes', href: '/admin/orders', icon: FileText },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export default function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const currentPath = (usePage().url || '').replace(/\?.*$/, '');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-slate-50/80 md:flex-row">
        {/* Sidebar — dark modern (override inner sidebar bg via child selector) */}
        <div className="shrink-0 [&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-slate-900 [&_[data-sidebar=sidebar]]:to-slate-900/95 [&_[data-sidebar=sidebar]]:text-white [&_[data-sidebar=sidebar]]:shadow-xl">
          <Sidebar
          className={cn(
            'border-0 text-white md:w-[260px]'
          )}
        >
          <SidebarHeader className="border-white/10 px-4 py-5">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-tight text-white">
                  PharmaConnect
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                  Administration
                </span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-1">
                <SidebarMenu className="gap-0.5">
                  {adminNav.map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? currentPath === '/admin'
                        : currentPath.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            'rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                            isActive
                              ? 'bg-primary text-white shadow-md shadow-primary/25'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="size-[18px] shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-white/10 px-3 py-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-red-500/20 hover:text-white"
              onClick={() => router.post('/logout')}
            >
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </SidebarFooter>
        </Sidebar>
        </div>

        {/* Main content — pleine largeur disponible */}
        <main className="min-w-0 flex-1 overflow-auto max-w-none">
          <div className="w-full max-w-none p-4 md:p-6 lg:p-8">
            {title && (
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {title}
              </h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
