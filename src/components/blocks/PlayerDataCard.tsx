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
};

function PlayerDataCard({ player }: PlayerCardProps) {
  return (
    <Card className={"w-full"}>
      <CardHeader>
        <CardTitle className={"flex flex-row justify-between items-center"}>
          {player.Player}
          <div
            className={"w-fit flex justify-center items-center p-2 rounded-md"}
            style={{
              backgroundColor: `var(--${player?.Team})`,
            }}
          >
            <TeamLogo
              width={24}
              height={24}
              teamId={Math.round(player?.team_id ?? 0).toString()}
            />
            <p className={"text-sm text-white font-semibold font-mono"}>
              {player?.Team}
            </p>
          </div>
        </CardTitle>
        <CardDescription>2024 賽季數據</CardDescription>
      </CardHeader>
      <CardContent>
        <PlayerImage
          playerId={Math.round(player?.player_id ?? 0).toString()}
          width={300}
        />
        {/*<Separator className={"w-full m-2"} />*/}
        <div
          className={
            "w-full flex flex-row justify-evenly space-x-2 items-center p-2"
          }
        >
          <div className={"w-1/2"}>
            <p className={"text-center text-sm font-semibold"}>場均得分</p>
            <p className={"text-center text-lg font-bold"}>
              {Math.round((player?.PTS / player?.G) * 100) / 100}
            </p>
          </div>
          <Separator orientation={"vertical"} className={"h-10"} />
          <div className={"w-1/2"}>
            <p className={"text-center text-sm font-semibold"}>場均助攻</p>
            <p className={"text-center text-lg font-bold"}>
              {Math.round((player?.AST / player?.G) * 100) / 100}
            </p>
          </div>
          <Separator orientation={"vertical"} className={"h-10"} />
          <div className={"w-1/2"}>
            <p className={"text-center text-sm font-semibold"}>場均籃板</p>
            <p className={"text-center text-lg font-bold"}>
              {(Math.round((player?.DRB / player?.G) * 100) +
                Math.round((player?.ORB / player?.G) * 100)) /
                100}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlayerDataCard;
