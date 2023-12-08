"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="flex flew-row justify-between items-center w-full bg-black px-5 py-3">
      <h1 className="text-white font-black text-3xl italic">Clover</h1>
      <div className="flex flex-row gap-x-3">
        <NavLinks />
      </div>
      <div className="text-white border-[0.5px] border-white rounded-full p-1.5 h-8 w-8 flex flex-row justify-center items-center cursor-pointer">
        <p>P</p>
      </div>
    </div>
  );
}

function NavLinks() {
  const pathname = usePathname();
  const items: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
    { title: "Generate", href: "/generate" },
  ];

  return (
    <TooltipProvider>
      {items.map((item, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <Link href={item.href} passHref className="flex flex-col">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-stone-600"
              >
                {item.title}
              </Button>
              <hr
                className={classNames(
                  "w-full",
                  "h-0.5",
                  "text-violet-900",
                  pathname === item.href ? "block" : "hidden"
                )}
              />
            </Link>
          </TooltipTrigger>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}
