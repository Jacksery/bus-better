"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import PendingBets from "./pending-bets";
import { FilterCard } from "./filter-card";
import { BusInfo } from "@/types/bus";

interface MobileSidebarProps {
  buses: BusInfo[];
}

export function MobileSidebar({ buses }: MobileSidebarProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg z-50"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed bottom-4 left-[50%] translate-x-[-50%] w-[90%] max-w-[425px] h-[85vh] rounded-xl p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Bus Better Menu</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-2" />
          <PendingBets />
          <FilterCard buses={buses} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
