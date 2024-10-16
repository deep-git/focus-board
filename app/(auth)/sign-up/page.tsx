import { redirect } from 'next/navigation';
import LoginGithub from '@/components/LoginGithub';
import RegisterForm from '@/components/RegisterForm';
import { auth } from '@/auth';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FaTasks } from 'react-icons/fa';

const SignUp = async () => {

    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col lg:flex-row-reverse w-full h-screen bg-white">
            <div className="relative flex flex-col gap-1 w-full bg-purple-1 text-white p-10 lg:bg-gradient-to-t lg:from-[rgb(79,75,165)] lg:to-purple-1">
                <h1 className="text-3xl sm:text-4xl lg:text-7xl font-semibold tracking-wide">Focusboard</h1>
                <h2 className="text-lg sm:text-xl lg:text-3xl lg:mt-2">Your task management made easy</h2>
                <FaTasks className="w-44 h-44 mt-10 text-[rgb(79,75,165)]" />
            </div>

            <div className="w-[90%] max-w-[400px] ml-auto mr-auto mt-10 lg:px-10">
                <Link href="/" className="flex w-max">
                    <ChevronLeft className="w-10 h-10 text-purple-1" />
                </Link>
                <div className="flex flex-col items-center mt-2 lg:mt-10">
                    <h2 className="text-3xl sm:text-4xl text-black mb-5">Sign Up</h2>

                    <RegisterForm />

                    <hr className="h-1 w-full mt-7 mb-7" />

                    <LoginGithub />

                    <div className="text-wrap text-center mt-5 text-black">Already have an account? <Link href="/sign-in" className="text-purple-1 font-semibold">Log in here.</Link></div>
                </div>
            </div>
        </div>
    )
};

export default SignUp;
