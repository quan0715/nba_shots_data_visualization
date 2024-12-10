import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayerData } from "@/app/_models/player_data";
import TeamLogo from "@/components/blocks/TeamLogo";
import PlayerImage from "@/components/blocks/PlayerImage";
import React from "react";
import { Separator } from "@/components/ui/separator";

type PlayerCardProps = {
  player: PlayerData;
  onClick: () => void;
};

function PlayerSelectionEntry({ player, onClick }: PlayerCardProps) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full flex flex-row items-center justify-between pl-1 text-left text-[11px] font-normal"
      }
      style={{
        // opacity: 0.5,
        // backgroundColor: `var(--${player?.Team})`,
        borderColor: `var(--${player?.Team})`,
        borderLeft: `2px solid var(--${player?.Team})`,
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
