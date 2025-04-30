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
import {
  Banana,
  Compass,
  Flag,
  Home,
  Leaf,
  MapPinned,
  Settings,
  User,
} from 'lucide-react';
import type * as React from 'react';

const menuItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'About',
    url: '/about',
    icon: User,
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
  {
    title: 'Routes',
    url: '/paths',
    icon: Compass,
  },
  {
    title: 'Reports',
    url: '#',
    icon: Flag,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props} variant='floating'>
      <SidebarHeader className='flex flex-col items-center gap-4 py-6 px-4'>
        <div className='flex aspect-square size-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground'>
          <Leaf className='size-5' />
        </div>
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
