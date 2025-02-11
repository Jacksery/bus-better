"use client";

import * as React from "react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/jacksery"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Jacksery
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/jacksery/bus-tracker"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
