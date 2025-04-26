import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '../ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className='flex w-full'>
        <AppSidebar />
        <main className='flex-1 p-4 '>{children}</main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
