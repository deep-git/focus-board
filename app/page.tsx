import UserComment from "@/components/UserComment";
import { userComments } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container w-full bg-white">
      <div className="max-w-screen-2xl text-black">
        <nav className="flex justify-between items-center mt-7">
          <Link href="/" className="flex justify-between items-center gap-3">
            <Image src="/logo-mobile.svg" alt="logo" width={35} height={35} className="w-7 h-7" />
            <h2 className="hidden sm:flex text-2xl font-semibold">Focusboard</h2>
          </Link>

          <div className="flex gap-3 sm:gap-7 justify-center items-center">
            <Link href="/sign-in" className="text-[15px] text-black hover:text-purple-1 font-semibold">Login</Link>
            <Link href="/sign-up" className="bg-purple-1 text-[15px] text-white rounded-full px-5 py-2 hover:bg-purple-1/90">Sign up</Link>
          </div>
        </nav>

        <section className="flex flex-col justify-center items-center mt-16">
          <h1 className="text-4xl text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl md:max-w-[800px] lg:max-w-[1100px]">Efficient Task Management Strategies.</h1>
          <p className="text-[16px] text-light-gray_text font-semibold mt-3 text-center lg:text-[18px] xl:text-[20px] md:mt-5 lg:mt-7">Boosting Productivity and Achieving Goals</p>

          <div className="flex gap-5 mt-10 lg:gap-10">
            <Link href="#learn_more" className="bg-purple-1 text-white px-4 py-2 rounded-full hover:bg-purple-1/90 sm:px-6 sm:py-3 transition duration-75">Learn More</Link>
            <Link href="/sign-up" className="border-purple-1 text-purple-1 border-[1px] px-4 py-2 rounded-full hover:bg-purple-1 hover:text-white sm:px-6 sm:py-3 transition duration-75">Get Started</Link>
          </div>

          <div className="grid grid-cols-1 mt-10 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-3 w-full bg-background_accent  py-7 rounded-2xl max-h-[450px] xl:col-span-1">
              <Image src="/mobile_create_task_image.png" alt="create task" width={200} height={200} className="w-full max-w-[400px] ml-auto mr-auto max-h-[400px] lg:hidden" />

              <Image src="/mobile_create_task_image.png" alt="create task" width={400} height={400} className="w-full max-w-[400px] ml-auto mr-auto max-h-[400px] hidden lg:flex" />

              <span className="text-2xl font-semibold px-4 md:px-7">Create Task</span>
              <p className="text-[15px] text-light-gray_text px-4 md:px-7">You can create new tasks easily through a simple interface. Add a title, description, sub tasks, and status according to your needs</p>
            </div>

            <div className="bg-background_accent rounded-2xl overflow-hidden pt-7 max-h-[450px] xl:col-span-2">
              <Image src="/header_mobile.png" alt="app" width={200} height={200} className="w-full max-w-[400px] ml-auto max-h-[400px] xl:hidden" />

              <Image src="/header_desktop.png" alt="app" width={500} height={500} className="hidden xl:flex w-full h-full ml-auto pt-5 mt-auto" />
            </div>

            <div className="w-full bg-background_accent rounded-2xl px-4 py-7 sm:col-span-2 sm:px-7 md:flex md:justify-center md:items-center md:gap-10 xl:py-10 xl:col-span-3">
              <div className="flex flex-col justify-between items-center h-28 md:gap-5 md:h-full lg:w-[700px] xl:w-[90%]">
                <p className="text-2xl tracking-wide lg:text-center">About Focusboard</p>
                <Link href="#learn_more" className="bg-purple-1 text-white rounded-full px-4 py-2 hover:bg-purple-1/90 transition duration-75 lg:px-7 lg:py-4 lg:text-lg">Learn More</Link>
              </div>

              <div className="mt-10 md:mt-0">
                <p className="text-[18px] md:text-[20px] lg:text-[32px] xl:text-[40px]">
                  Effective solutions to manage your tasks more efficiently and effectively. With powerful features and an intuitive interface, we make sure that you can organize, track, and complete your tasks with ease.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="learn_more" className="flex flex-col-reverse sm:flex-row mt-32 gap-10 items-center md:px-20 xl:px-32">
          <div className="flex flex-col gap-5">
            <button className="border-purple-1 w-max border-[1px] text-purple-1 rounded-full px-4 py-2 text-sm">Featured</button>
            <h3 className="text-2xl md:text-3xl lg:text-4xl">Allow users to enter a title for each task, providing a concise description of what needs to be done.</h3>
            <p className="text-[14px] text-light-gray_text lg:text-[20px]">Provide a space for users to add detailed information or instructions related to the task.</p>
          </div>
          <div className="bg-background_accent px-4 pt-10 rounded-2xl overflow-hidden w-[100%] max-w-[400px] sm:w-[700px] md:w-[900px] lg:w-[900px]">
            <Image src="/mobile_task_title.png" alt="task content" width={200} height={200} className="flex w-full lg:hidden" />

            <Image src="/desktop_task_title.png" alt="task content" width={300} height={300} className="hidden w-full lg:flex" />
          </div>
        </section>

        <section className="flex flex-col mt-32 gap-10 sm:flex-row items-center md:px-20 xl:px-32">
          <div className="flex bg-background_accent pt-14 py-10 rounded-2xl overflow-hidden w-[100%] max-w-[400px] sm:w-[700px] md:w-[900px] lg:w-[900px]">
            <Image src="/mobile_subtasks.png" alt="task content" width={200} height={200} className="flex w-full lg:hidden" />

            <Image src="/desktop_subtasks.png" alt="task content" width={300} height={300} className="hidden w-full lg:flex" />
          </div>

          <div className="flex flex-col gap-5">
            <button className="border-purple-1 w-max border-[1px] text-purple-1 rounded-full px-4 py-2 text-sm">Featured</button>
            <h3 className="text-2xl md:text-3xl lg:text-4xl">Enable users to keep track of sub-tasks and related goals for overall task completion</h3>
            <p className="text-[14px] text-light-gray_text lg:text-[20px]">Add and toggle the completion of various sub-tasks all with a single click.</p>
          </div>
        </section>

        <section className="flex flex-col-reverse mt-32 gap-10 sm:flex-row items-center md:px-20 xl:px-32">
          <div className="flex flex-col gap-5">
            <button className="border-purple-1 w-max border-[1px] text-purple-1 rounded-full px-4 py-2 text-sm">Featured</button>
            <h3 className="text-2xl md:text-3xl lg:text-4xl">Enable users to manage tasks easy with selecting columns and drag-n-drop integration</h3>
            <p className="text-[14px] text-light-gray_text lg:text-[20px]">Select tasks to add to specific columns or easy drag-n-drop tasks into any created columns.</p>
          </div>
          <div className="flex bg-background_accent pl-2 pt-7 rounded-2xl overflow-hidden w-[100%] max-w-[400px] sm:w-[700px] md:w-[900px] lg:w-[900px]">
            <Image src="/mobile_drag.png" alt="task content" width={200} height={200} className="flex w-full lg:hidden" />

            <Image src="/desktop_drag.png" alt="task content" width={300} height={300} className="hidden w-full lg:flex" />
          </div>
        </section>

        <section className="flex flex-col mt-32 gap-10">
          <h3 className="text-2xl text-center">What they say after using Focusboard</h3>

          <div className="flex flex-col gap-7 sm:hidden">
            {userComments.slice(0, 3).map((comment, index) => (
              <UserComment key={index} comment={comment} />
            ))}
          </div>

          <div className="hidden flex-col gap-7 sm:grid grid-cols-2 lg:grid-cols-3 md:px-20 xl:px-32">
            {userComments.map((comment, index) => (
              <UserComment key={index} comment={comment} />
            ))}
          </div>
        </section>

        <footer className="flex flex-col mt-32 mb-5 bg-dark-board_background rounded-2xl justify-center items-center p-7 gap-5 lg:px-14 lg:gap-10">
          <div className="flex flex-col justify-between items-center h-32 md:flex-row md:w-full">
            <h3 className="text-2xl text-white text-center md:text-3xl lg:text-5xl lg:w-[500px] lg:text-start">Ready to boost your productivity?</h3>
            <Link href="/sign-up" className="w-max border-[1px] text-white bg-purple-1 rounded-full px-4 py-2 sm:px-7 sm:py-4 text-sm sm:text-lg hover:bg-purple-1/90">Get Started</Link>
          </div>

          <hr className="w-full bg-light-gray_text h-[2px]" />

          <div className="flex flex-col gap-5 sm:flex-row w-full sm:justify-between sm:gap-0">
            <div className="flex flex-col justify-center items-center gap-3 sm:items-start">
              <h4 className="text-xl text-light-gray_text">Focusboard</h4>
              <p className="text-[16px] text-light-gray_text text-center sm:w-[200px] sm:text-start">Boosting Productivity and Achieving Goals</p>
            </div>

            <div className="flex flex-col justify-center items-center gap-3 sm:justify-start sm:items-start">
              <h4 className="text-xl text-white">Home</h4>
              <Link href="#learn_more" className="text-[16px] text-light-gray_text">Learn More</Link>
            </div>
          </div>

          <p className="text-[14px] text-light-gray_text text-center mt-10 lg:mt-14">All rights reserved by FocusBoard</p>
        </footer>
      </div>
    </div>
  );
}
