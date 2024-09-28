import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>FocusBoard</h1>
      <Link href="/sign-in">
        <Button>Login</Button>
      </Link>

      <Link href="/sign-up">
        <Button>Register</Button>
      </Link>
    </div>
  );
}
