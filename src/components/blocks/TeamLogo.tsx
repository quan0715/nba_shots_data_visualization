import Image from "next/image";

const baseURL = "https://cdn.nba.com";
type TeamLogoProps = {
  teamId: string;
  width?: number;
  height?: number;
} & React.ComponentProps<"img">;
// https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg
function PlayerImage({ teamId, width = 100, height = 100 }: TeamLogoProps) {
  return (
    <Image
      src={`${baseURL}/logos/nba/${teamId}/primary/L/logo.svg`}
      alt="NBA Shot Chart"
      width={width}
      height={height}
    />
  );
}

export default PlayerImage;
