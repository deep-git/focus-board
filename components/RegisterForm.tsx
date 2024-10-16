"use client";

import React, { useState } from 'react'
import { registerWithCreds } from '@/actions/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
        <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-black">
                        Username
                    </label>
                    <Input
                        type="text"
                        placeholder="Username"
                        name="username"
                        id="username"
                        className="mt-1 w-full px-4 p-2 rounded-lg border text-black border-light-gray_text/70 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-1 bg-background_accent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">
                        Email
                    </label>
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="email"
                        className="mt-1 w-full px-4 p-2 rounded-lg border text-black border-light-gray_text/70 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-1 bg-background_accent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">
                        Password
                    </label>
                    <Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        className="mt-1 w-full px-4 p-2 rounded-lg border text-black border-light-gray_text/70 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-1 bg-background_accent"
                        required
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="mt-10 w-full">
                    <Button className="w-full bg-purple-1 text-[16px] text-white hover:bg-purple-1/90">Sign up</Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm