"use client";

import { logout } from '@/actions/auth';
import { LogOut } from 'lucide-react';
import React from 'react'

const Logout = () => {
    return (
        <div onClick={() => logout()} className="flex justify-center items-center gap-3 bg-light-gray_text/30 dark:bg-dark-gray_text/30 text-sm px-4 py-2 rounded-md hover:bg-red-500 dark:hover:bg-red-500 hover:text-white cursor-pointer group transition duration-75">
            <p>Logout</p>
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition duration-100" />
        </div>
    )
}

export default Logout