import { PropsWithChildren } from "react";
import PendingBets from "./pending-bets";
import { Separator } from "@/components/ui/separator";

export function Sidebar({ children }: PropsWithChildren) {
  return (
    <div className="sticky top-[72px] hidden md:flex flex-col gap-4">
      <Separator className="md:hidden my-4" />
      <PendingBets />
      {children}
    </div>
  );
}
