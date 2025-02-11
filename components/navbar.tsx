"use client";

import React, { ReactNode } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarProps {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  leftContent,
  centerContent = null,
}) => {
  const { user, isLoaded } = useUser();

  return (
    <nav className="w-full h-14">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="w-1/3 flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base overflow-hidden">
          <div className="truncate">{leftContent}</div>
        </div>
        <div className="w-1/3 justify-center items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
          {centerContent}
        </div>
        <div className="w-1/3 flex items-center justify-end">
          <div className="flex items-center gap-2 sm:gap-4">
            {!isLoaded ? (
              <>
                <Skeleton className="h-6 w-[60px] sm:w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Credits:{" "}
                  {(user?.publicMetadata as { userCredit?: number })
                    ?.userCredit || 0}
                </p>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
