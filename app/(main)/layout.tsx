import Sidebar from '@/components/Sidebar';
import React from 'react';
import { auth } from '@/auth'; // Ensure this is the correct path
import { redirect } from 'next/navigation';

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