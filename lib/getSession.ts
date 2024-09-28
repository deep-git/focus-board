import { getServerSession, Session } from 'next-auth';
import authOptions from '../app/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

// Convert NextRequest to NextApiRequest
const convertRequest = (req: NextRequest): NextApiRequest => {
    return {
        headers: req.headers as any,
        method: req.method || 'GET',
        body: req.body || null,
        query: req.nextUrl.searchParams as any,
        cookies: req.cookies as any,
    } as NextApiRequest;
};

// Function to retrieve the session
export const getSession = async (req: NextRequest): Promise<Session | null> => {
    const apiReq = convertRequest(req);

    // Create a mock response object for compatibility
    const apiRes: NextApiResponse = {
        status: () => apiRes,
        json: () => apiRes,
    } as any;

    return await getServerSession(apiReq, apiRes, authOptions);
};