"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { usePlayerInfo } from "@/app/_hooks/players/usePlayerInfo";
import { CgSpinnerAlt } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { FaArrowsRotate } from "react-icons/fa6";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlayerSearchContextProvider } from "@/app/_hooks/players/usePlayerSearch";
import PlayerList from "@/components/blocks/PlayerList";

const defaultPlayerId = "2455";
const defaultSeason = "2024";

function Navbar() {
  const links: {
    title: string;
    href: string;
  }[] = [
    // { title: "Team", href: "/team" },
    // { title: "Compare", href: "/compare" },
  ];
  const pathname = usePathname();
  const isCurrentPath = (path: string) => pathname === path;
  return (
    <nav className={"flex flex-row justify-between border-b-2 border-gray-100"}>
      <Header />
      <ActionBar>
        <YearSelectorActionUI />
        <PlayerHeader />
        {links.map((link) => (
          <Link href={link.href} key={link.title}>
            <div
              className={cn(
                "hidden md:flex px-6 py-4 border-l-2 border-l-gray-100 flex-row justify-center items-center hover:bg-gray-100",
                isCurrentPath(link.href) ? "text-black" : "text-gray-500",
              )}
            >
              {link.title}
            </div>
          </Link>
        ))}
      </ActionBar>
    </nav>
  );
}

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

function PlayerHeader() {
  const params = useSearchParams();
  const playerId = params.get("player_id") || defaultPlayerId;
  const season = params.get("season") || defaultSeason;
  const { isPlayerLoading, player } = usePlayerInfo(playerId, season);
  return (
    <div
      className={
        "px-2 h-full flex flex-row justify-center items-center border-l-2 border-l-gray-100"
      }
    >
      {isPlayerLoading ? (
        <CgSpinnerAlt className={"animate-spin "}></CgSpinnerAlt>
      ) : (
        <div
          className={"flex flex-row w-fit justify-center items-center group"}
        >
          <PlayerImage playerId={playerId} width={36} />
          <p className={"text-sm font-mono"}>{player?.Player}</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <FaArrowsRotate
                  width={36}
                  className={"group-hover:animate-spin"}
                />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{`${season} 球員列表`}</SheetTitle>
                <SheetDescription>選擇球員以查看其資料視覺化</SheetDescription>
                <PlayerSearchContextProvider season={season}>
                  <PlayerList />
                </PlayerSearchContextProvider>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}

function YearSelectorActionUI() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultSeason = "2024";
  const season = searchParams.get("season") || defaultSeason;
  const yearOption = [2024, 2023, 2022, 2021, 2020];

  const handleChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("season", value);
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <Select
      defaultValue={defaultSeason}
      value={season}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-fit border-0 m-0 focus:ring-0 h-full rounded-none border-l-2 border-l-gray-100">
        <Label className={"text-wrap mx-2"}>賽季: </Label>
        <SelectValue placeholder={"賽季時間"} />
      </SelectTrigger>
      <SelectContent>
        {yearOption.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {`${year - 1} - ${year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ActionBar({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...rest } = props;
  return (
    <Suspense>
      <div
        {...rest}
        className={cn("flex flex-row justify-between items-center", className)}
      >
        {children}
      </div>
    </Suspense>
  );
}

export default Navbar;
