import Image from "next/image";

const baseURL = "https://cdn.nba.com";
type PlayerImageProps = {
  playerId: string;
  width?: number;
  height?: number;
} & React.ComponentProps<"img">;

function PlayerImage({
  playerId,
  width = 1040,
  height = 760,
}: PlayerImageProps) {
  return (
    <Image
      src={`${baseURL}/headshots/nba/latest/1040x760/${playerId}.png`}
      alt="NBA Shot Chart"
      width={width}
      height={height}
    />
  );
}

export default PlayerImage;
