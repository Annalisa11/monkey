import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { Banana, ChartLine, LayoutGrid, MapPinned } from 'lucide-react';
import type * as React from 'react';

const menuItems = [
  {
    title: 'Summary',
    url: '/',
    icon: LayoutGrid,
  },
  {
    title: 'Stats',
    url: '/stats',
    icon: ChartLine,
  },
  {
    title: 'Monkeys',
    url: '/monkeys',
    icon: Banana,
  },
  {
    title: 'Locations',
    url: '/locations',
    icon: MapPinned,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props} variant='floating'>
      <SidebarHeader className='flex flex-col items-center gap-4 py-6 px-4'>
        <SidebarTrigger className='flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors' />
      </SidebarHeader>
      <SidebarContent className='p-4'>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title} className='flex justify-center'>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  to={item.url}
                  className='rounded-lg hover:bg-sidebar-accent transition-colors [&.active]:font-bold [&.active]:bg-sidebar-accent/50'
                >
                  <item.icon className='size-5 text-sidebar-primary' />
                  <span className='font-medium'>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
