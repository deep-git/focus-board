"use client";

import React, { useState } from 'react'
import AuthButton from './AuthButton';
import { registerWithCreds } from '@/actions/auth';

const RegisterForm = () => {

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const response = await registerWithCreds(formData);
            // Optionally redirect or handle successful login here

            if (response) {
                setError(response.error);
            }

        } catch (err: any) {
            setError(err.message || 'Register failed');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        id="username"
                        className="mt-1 w-full px-4 p-2 h-10 rounded-full border border-gray-700 bg-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="email"
                        className="mt-1 w-full px-4 p-2 h-10 rounded-full border border-gray-700 bg-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        className="mt-1 w-full px-4 p-2 h-10 rounded-full border border-gray-700 bg-white"
                        required
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="mt-4">
                    <AuthButton typeSubmit="register" />
                </div>
            </form>
        </div>
    )
}

export default RegisterForm