"use server";
import { PlayerSeasonData } from "@/app/_models/player_data";

export async function getPlayerInfo(
  playerId: string,
  season: string,
): Promise<PlayerSeasonData> {
  const api = `https://api.lbrt.tw/vis_final/player_stats/?player_id=${playerId}&season=${season}`;

  const res = await fetch(api, {
    cache: "force-cache",
  });
  return await res.json();
  // if (res.ok) {
  //
  // } else {
  //   console.log("Server Error");
  //   throw new Error("Server Error");
  // }
}
