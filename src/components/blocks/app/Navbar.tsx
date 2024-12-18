"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
function Navbar() {
  return (
    <nav className={"flex flex-row justify-between border-b-2 border-gray-100"}>
      <Header />
      <ActionBar
        links={[
          { title: "Player", href: "/" },
          { title: "Team", href: "/team" },
          { title: "Compare", href: "/compare" },
        ]}
      />
    </nav>
  );
}

type LinkProps = {
  title: string;
  href: string;
};
function Header() {
  return (
    <header
      className={
        "py-4 px-8 border-r-2 border-gray-100 flex flex-row justify-center items-center space-x-2"
      }
    >
      <Image
        src={"/basketball.png"}
        alt="NBA Shot Chart"
        width={24}
        height={24}
      />
      <h1 className={"font-semibold text-md"}>NBA 資料視覺化</h1>
    </header>
  );
}

function ActionBar({ links }: { links: LinkProps[] }) {
  const pathname = usePathname();

  return (
    <div className={"flex flex-row justify-between items-center"}>
      {links.map((link) => (
        <Link href={link.href} key={link.title}>
          <div
            className={cn(
              "px-6 py-4 border-l-2 border-l-gray-100 flex flex-row justify-center items-center hover:bg-gray-100",
              pathname === link.href ? "text-black" : "text-gray-500",
            )}
          >
            {link.title}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Navbar;
