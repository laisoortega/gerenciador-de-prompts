import { MobileBottomNav } from '../components/ui/MobileBottomNav';

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-bg-base overflow-hidden">
            {/* Sidebar hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 mb-[60px] md:mb-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Nav visible only on mobile */}
            <MobileBottomNav />
        </div>
    );
};
