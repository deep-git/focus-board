"use client";

import React, { useState } from 'react'
import AuthButton from './AuthButton';
import { registerWithCreds } from '@/actions/auth';
import { Button } from './ui/button';

const RegisterForm = () => {

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        console.time("registerWithCreds"); // Start the timer

        try {
            const response = await registerWithCreds(formData);

            console.timeEnd("registerWithCreds"); // End the timer and log the duration
            console.log("RESPONSE: ", response);

            if (response?.error) {
                setError(response.error);
            } else {
                window.location.href = "/dashboard";
            }

        } catch (error) {
            console.timeEnd("registerWithCreds"); // End the timer even if there's an error
            if (error instanceof Error) {
                setError(error.message); // If it's an Error instance
            } else {
                setError('Register failed'); // Fallback for unexpected error types
            }
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
                    <Button>Sign up</Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm