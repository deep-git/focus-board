"use client";

import { login } from '@/actions/auth'
import React from 'react'
import { FaGithub } from 'react-icons/fa'

const LoginGithub = () => {
    return (
        <div onClick={() => login("github")}>
            <FaGithub className="text-white" />
            <p className="text-white">Login with Github</p>
        </div>
    )
}

export default LoginGithub