import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className='flex'>
        <AppSidebar />
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
