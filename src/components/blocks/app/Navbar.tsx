"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PlayerImage from "@/components/blocks/PlayerImage";
import { MenuIcon } from "lucide-react";
function Navbar() {
  return (
    <nav className={"flex flex-row justify-between border-b-2 border-gray-100"}>
      <Header />
      <ActionBar
        links={[
          // { title: "Player", href: "/" },
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
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const playerId = searchParams.get("playerId");
  const router = useRouter();
  // params.append("season", "2425");
  console.log("params", season);

  return (
    <Suspense>
      <div className={"flex flex-row justify-between items-center"}>
        <MenuIcon className={"block md:hidden"}></MenuIcon>
        <Select
          defaultValue={"24-25"}
          value={season ?? "24-25"}
          onValueChange={(value) => {
            console.log("value", value);
            const newParams = new URLSearchParams(searchParams);
            newParams.set("season", value);
            const newURL = `${pathname}?${newParams.toString()}`;
            router.push(newURL);
          }}
        >
          <SelectTrigger className="hidden md:block w-fit border-0 m-0 focus:ring-0 h-full rounded-none border-l-2 border-l-gray-100">
            <Label className={"text-wrap mx-2"}>賽季: </Label>
            <SelectValue placeholder={"賽季時間"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"24-25"}>2024-2025</SelectItem>
            <SelectItem value={"23-24"}>2023-2024</SelectItem>
            <SelectItem value={"22-23"}>2022-2023</SelectItem>
          </SelectContent>
        </Select>
        <div
          className={
            "hidden md:flex px-6 py-4 flex-row justify-center items-center h-full rounded-none border-l-2 border-l-gray-100"
          }
        >
          {playerId && <PlayerImage playerId={playerId} width={36} />}
        </div>

        {links.map((link) => (
          <Link href={link.href} key={link.title}>
            <div
              className={cn(
                "hidden md:flex px-6 py-4 border-l-2 border-l-gray-100 flex-row justify-center items-center hover:bg-gray-100",
                pathname === link.href ? "text-black" : "text-gray-500",
              )}
            >
              {link.title}
            </div>
          </Link>
        ))}
      </div>
    </Suspense>
  );
}

export default Navbar;
