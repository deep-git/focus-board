import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from './ui/button';

const AuthButton = ({ typeSubmit }: { typeSubmit: string }) => {

    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} type="submit" className={`${pending ? "bg-gray-600" : "bg-blue-600"} rounded-md w-full px-12 py-3 text-sm font-medium text-white`}>
            {pending ? "Loading..." : typeSubmit === "register" ? (
                <p>Sign up</p>
            ) : (
                <p>Sign in</p>
            )}
        </Button>
    )
}

export default AuthButton