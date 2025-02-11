import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 font-sans">
      <h1 className="text-4xl font-bold">Bus</h1>
      <div className="flex space-x-4">
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button variant="outline">Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
