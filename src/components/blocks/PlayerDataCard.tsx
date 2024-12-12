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
import DonutWithLabel from "@/components/blocks/data_visualization/DonutWithLabelPieCharts";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
            className={
              "w-fit flex justify-center items-center px-2 py-1 rounded-xl"
            }
            style={{
              color: `var(--${player?.Team})`,
              border: `1px solid var(--${player?.Team})`,
              // borderColor: `var(--${player?.Team})`,
            }}
          >
            <TeamLogo
              width={24}
              height={24}
              teamId={Math.round(player?.team_id ?? 0).toString()}
            />
            <p className={"text-sm font-semibold font-mono"}>{player?.Team}</p>
          </div>
        </CardTitle>
        <CardDescription>2025 賽季數據</CardDescription>
      </CardHeader>
      <CardContent className={"flex flex-row justify-center items-center"}>
        <div className={"w-1/3 flex flex-col justify-center items-center"}>
          <PlayerImage
            playerId={Math.round(player?.player_id ?? 0).toString()}
            width={240}
          />
          <div
            className={
              "flex-1 flex flex-row justify-evenly space-x-4 items-center p-2"
            }
          >
            <p className={"text-center text-sm font-semibold"}>
              {"#" + player.Team}
            </p>
            <p className={"w-fit text-center text-sm font-semibold"}>
              {"#" + Math.round(player.Age) + " 歲"}
            </p>
            <p className={"text-center text-sm font-semibold"}>
              {"#" + player.Pos}
            </p>
          </div>
        </div>
        <div
          className={"flex-1 w-full h-full flex-col justify-start items-start "}
        >
          <div className={"w-full flex flex-row justify-center items-center"}>
            <DonutWithLabel
              label={"罰球"}
              total={Math.round(player?.FTA)}
              value={Math.round(player?.FT)}
              radius={55}
              color={`var(--${player?.Team})`}
              className={"w-[200px]"}
            />
            <DonutWithLabel
              label={"兩分球"}
              total={Math.round(player?.Two_PA)}
              value={Math.round(player?.Two_P)}
              radius={55}
              color={`var(--${player?.Team})`}
              className={"w-[200px]"}
            />
            <DonutWithLabel
              label={"三分球"}
              total={Math.round(player?.Three_PA)}
              value={Math.round(player?.Three_P)}
              radius={55}
              color={`var(--${player?.Team})`}
              className={"w-[200px]"}
            />
          </div>
          {/*<div*/}
          {/*  className={*/}
          {/*    "flex-1 flex flex-row justify-evenly space-x-2 items-center "*/}
          {/*  }*/}
          {/*>*/}
          {/*  <div className={"flex-1"}>*/}
          {/*    <p className={"text-center text-sm font-semibold"}>場均得分</p>*/}
          {/*    <p className={"text-center text-lg font-bold"}>*/}
          {/*      {Math.round((player?.PTS / player?.G) * 100) / 100}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*  <Separator orientation={"vertical"} className={"h-10"} />*/}
          {/*  <div className={"flex-1"}>*/}
          {/*    <p className={"text-center text-sm font-semibold"}>場均助攻</p>*/}
          {/*    <p className={"text-center text-lg font-bold"}>*/}
          {/*      {Math.round((player?.AST / player?.G) * 100) / 100}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*  <Separator orientation={"vertical"} className={"h-10"} />*/}
          {/*  <div className={"flex-1"}>*/}
          {/*    <p className={"text-center text-sm font-semibold"}>場均籃板</p>*/}
          {/*    <p className={"text-center text-lg font-bold"}>*/}
          {/*      {(Math.round((player?.DRB / player?.G) * 100) +*/}
          {/*        Math.round((player?.ORB / player?.G) * 100)) /*/}
          {/*        100}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div*/}
          {/*  className={"w-full flex p-4 flex-row justify-center items-center"}*/}
          {/*>*/}
          {/*  <div*/}
          {/*    className={cn(*/}
          {/*      "flex flex-col justify-center items-center",*/}
          {/*      (Math.round(player.FT) / player?.PTS) * 100 < 1 ? "hidden" : "",*/}
          {/*    )}*/}
          {/*    style={{*/}
          {/*      width: `${(player?.FT / player?.PTS) * 100}%`,*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <p className={"text-sm font-semibold"}>{Math.round(player.FT)}</p>*/}
          {/*    <div className={"w-full h-2 rounded-full bg-chart-1"} />*/}
          {/*    <p className={"text-[10px] font-semibold"}>罰球</p>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className={cn(*/}
          {/*      "flex flex-col justify-center items-center",*/}
          {/*      ((Math.round(player.Two_P) * 2) / player?.PTS) * 100 < 1*/}
          {/*        ? "hidden"*/}
          {/*        : "",*/}
          {/*    )}*/}
          {/*    style={{*/}
          {/*      width: `${((Math.round(player.Two_P) * 2) / player?.PTS) * 100}%`,*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <p className={"text-sm font-semibold"}>*/}
          {/*      {Math.round(player.Two_P) * 2}*/}
          {/*    </p>*/}
          {/*    <div className={"w-full h-2 rounded-full bg-chart-2"} />*/}
          {/*    <p className={"text-[10px] font-semibold"}>二分</p>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className={cn(*/}
          {/*      "flex flex-col justify-center items-center",*/}
          {/*      ((Math.round(player.Three_P) * 3) / player?.PTS) * 100 < 1*/}
          {/*        ? "hidden"*/}
          {/*        : "",*/}
          {/*    )}*/}
          {/*    style={{*/}
          {/*      width: `${((Math.round(player.Three_P) * 3) / player?.PTS) * 100}%`,*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <p className={"text-sm font-semibold"}>*/}
          {/*      {Math.round(player.Three_P) * 3}*/}
          {/*    </p>*/}
          {/*    <div className={"w-full h-2 rounded-full bg-chart-3"} />*/}
          {/*    <p className={"text-[10px] font-semibold"}>三分</p>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlayerDataCard;
