import { useSession } from 'next-auth/react';

export const useUser = () => {
    const { data: session } = useSession();

    return {
        user: session?.user || null, // Return user data or null
    };
};