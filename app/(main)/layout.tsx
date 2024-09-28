import Sidebar from '@/components/Sidebar';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <Sidebar /> {/* Pass the session to Sidebar */}
            <div className="flex flex-col flex-1">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;