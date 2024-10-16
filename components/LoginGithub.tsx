"use client";

import { login } from '@/actions/auth'
import React from 'react'
import { FaGithub } from 'react-icons/fa'

const LoginGithub = () => {
    return (
        <div onClick={() => login("github")} className="flex justify-center items-center w-full gap-3 border-purple-1 border-[2px] rounded-lg px-4 py-3 cursor-pointer hover:bg-background_accent transition duration-75">
            <FaGithub className="text-purple-1 w-6 h-6" />
            <p className="text-purple-1 text-[16px]">Login with Github</p>
        </div>
    )
}

export default LoginGithub