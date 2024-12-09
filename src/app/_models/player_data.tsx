export type PlayerData = {
  Player: string;
  Age: number;
  Team: string;
  Pos: string;
  G: number; // 出賽場數
  GS: number; // 先發場數
  MP: number; // 平均出場時間
  FG: number; // 進球
  FGA: number; // 出手
  FG_P: number; // 進球率
  Three_P: string; // 三分球
  Three_PA: number; // 三分球出手
  Three_P_P: number; // 三分球命中率
  Two_P: number; // 兩分球
  Two_PA: number; // 兩分球出手
  Two_P_P: number; // 兩分球命中率
  EFG_P: number; // 有效進球率
  FT: number; // 罰球
  FTA: number; // 罰球出手
  FT_P: number; // 罰球命中率
  ORB: number; // 進攻籃板
  DRB: number; // 防守籃板
  TRB: number; // 總籃板
  AST: number; // 助攻
  STL: number; // 抄截
  BLK: number; // 阻攻
  TOV: number; // 失誤
  PF: number; // 犯規
  PTS: number; // 得分
  // PER: number; // Player Efficiency Rating
  Trp_Dbl: number; // 三雙
  Awards: string; // 獎項
  player_id: number; // 球員編號
  player_full_name: string; // 球員全名
  first_name: string; // 名
  last_name: string; // 姓
  is_active: boolean; // 是否在職
  team_id: number; // 隊伍編號
  team_full_name: string; // 隊伍全名
  abbreviation: string;
  nickname: string;
  city: string;
  state: string;
  year_founded: string;
};
