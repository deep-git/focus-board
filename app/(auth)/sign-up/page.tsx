import { redirect } from 'next/navigation';
import LoginGithub from '@/components/LoginGithub';
import RegisterForm from '@/components/RegisterForm';
import { auth } from '@/auth';

const SignUp = async () => {

    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full flex mt-20 justify-center">
            <section className="flex flex-col w-[400px]">
                <h1 className="text-3xl w-full text-center font-bold mb-6">Sign In</h1>
                <RegisterForm />
                <LoginGithub />
            </section>
        </div>
    )
};

export default SignUp;
