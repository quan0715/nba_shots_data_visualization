"use client";
import { PlayerData } from "@/app/_models/player_data";
import TeamLogo from "@/components/blocks/TeamLogo";
import React from "react";

type PlayerCardProps = {
  player: PlayerData;
  onClick: () => void;
};

function PlayerSelectionEntry({ player, onClick }: PlayerCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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
      {player.Player}
      <TeamLogo
        width={20}
        height={20}
        teamId={Math.round(player?.team_id ?? 0).toString()}
      />
    </button>
  );
}

export default PlayerSelectionEntry;
