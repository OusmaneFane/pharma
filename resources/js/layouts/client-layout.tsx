import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  ShoppingBag,
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

const clientNav = [
  { title: 'Tableau de bord', href: '/client', icon: LayoutDashboard },
  { title: 'Nouvelle demande', href: '/client/orders/new', icon: PlusCircle },
  { title: 'Mes commandes', href: '/client/orders', icon: FileText },
];

export default function ClientLayout({
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
        <div className="shrink-0 [&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-primary [&_[data-sidebar=sidebar]]:to-primary/90 [&_[data-sidebar=sidebar]]:text-white [&_[data-sidebar=sidebar]]:shadow-xl">
          <Sidebar className="border-0 text-white md:w-[260px]">
            <SidebarHeader className="border-white/10 px-4 py-5">
              <Link
                href="/client"
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 shadow-lg">
                  <ShoppingBag className="size-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-base font-bold tracking-tight text-white">
                    PharmaConnect
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                    Espace Client
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
                    {clientNav.map((item) => {
                      const isActive =
                        item.href === '/client'
                          ? currentPath === '/client'
                          : currentPath.startsWith(item.href);
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              'rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                              isActive
                                ? 'bg-white/20 text-white shadow-md'
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
