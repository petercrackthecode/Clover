"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useWindowSize } from "react-use";
import {
  Home as HomeIcon,
  Aperture as ApertureIcon,
  History as HistoryIcon,
  Heart as HeartIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
export default function Navbar() {
  const { width } = useWindowSize();
  return width > 600 ? <NavbarLargeScreen /> : <NavbarMobile />;
}

function NavbarLargeScreen() {
  return (
    <div className="fixed z-50 top-0 left-0 w-full flex flew-row justify-between items-center bg-black px-5 py-3">
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
    // { title: "History", href: "/history" },
    { title: "Likes", href: "/likes" },
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

function NavbarMobile() {
  return (
    <div className="fixed z-50 left-0 bottom-0 w-full flex flex-row justify-evenly bg-black">
      <NavLinksMobile />
    </div>
  );
}

function NavLinksMobile() {
  const pathname = usePathname();
  const items: { icon: React.ReactElement; href: string }[] = [
    { icon: <HomeIcon />, href: "/" },
    { icon: <ApertureIcon />, href: "/generate" },
    // { icon: <HistoryIcon />, href: "/history" },
    { icon: <HeartIcon />, href: "/likes" },
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
                {item.icon}
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
