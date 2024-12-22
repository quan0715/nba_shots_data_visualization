"use client";
import { PlayerSeasonData } from "@/app/_models/player_data";
import TeamLogo from "@/components/blocks/TeamLogo";
import React from "react";
import Link from "next/link";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";

type PlayerCardProps = {
  index: number;
  player: PlayerSeasonData;
};

function PlayerSelectionEntry({ player, index }: PlayerCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { season, setTargetPlayer } = usePlayerSearch();

  return (
    <Link
      href={`/?season=${season}&player_id=${player.player_id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setTargetPlayer(player);
      }}
      className={
        "w-full flex flex-row items-center justify-between pl-1 text-left text-[11px] font-normal"
      }
      style={{
        // opacity: 0.5,
        borderRadius: "3px",
        backgroundColor: isHovered
          ? `color-mix(in srgb, var(--${player?.Team}) 20%, white)`
          : ``,
        borderColor: `var(--${player?.Team})`,
        borderLeft: `3px solid var(--${player?.Team})`,
      }}
    >
      {index + 1 + " "}.{player.Player}
      <TeamLogo width={20} height={20} teamId={player.team_id} />
    </Link>
  );
}

export default PlayerSelectionEntry;
