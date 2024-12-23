"use client";
import { PlayerSeasonData } from "@/app/_models/player_data";
import { usePlayerShootingData } from "@/app/_hooks/players/usePlayerShootingData";
import { PlayerShotsData } from "@/app/_models/player_shots_data";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AxisDomain } from "d3";

type ShotData = {
  Name: string;
  X: number;
  Y: number;
  suc: number;
  dist: number;
  zone: number;
};

enum DisplayMode {
  HitRate = "HitRate",
  Zone = "Zone",
}
function PlayerShootingDataChart({ player }: { player: PlayerSeasonData }) {
  const playerId = player.player_id;
  const season = player.YEAR;
  const { playerShootingData, isDataLoading } = usePlayerShootingData(
    playerId,
    season,
  );
  // const season = player.season;
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.HitRate,
  );

  return (
    <div className="w-full h-fit p-4">
      {isDataLoading ? (
        <>Loading ...</>
      ) : (
        <div className={"w-full flex flex-col justify-center items-center"}>
          <div className="flex-1 flex flex-row items-center space-x-2 p-4">
            <RadioGroup
              defaultValue={DisplayMode.HitRate.valueOf()}
              onValueChange={(v) => setDisplayMode(v as DisplayMode)}
              className={"flex-1 flex flex-row items-center space-x-2"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DisplayMode.HitRate.valueOf()} />
                <Label>命中率</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DisplayMode.Zone.valueOf()} />
                <Label>投籃區域</Label>
              </div>
            </RadioGroup>
          </div>
          <ShootingDataChart
            player={player}
            colorMode={displayMode}
            shotsData={playerShootingData ?? []}
          />
        </div>
      )}
    </div>
  );
}

function shotDataDlo(playerShootingData: PlayerShotsData[]) {
  return playerShootingData.map((d) => {
    const x = Math.min(Math.floor(parseFloat(d.LOC_X + "") + 25), 49);
    const y = Math.min(Math.floor(parseFloat(d.LOC_Y + "")), 46);

    return {
      Name: d.PLAYER_NAME ?? "",
      X: x,
      Y: y,
      suc: d.SHOT_MADE ? 1 : 0,
      dist: Math.floor(d.SHOT_DISTANCE ?? 0),
      zone:
        d.ZONE_ABB === "L" || d.ZONE_ABB === "R"
          ? 1
          : d.ZONE_ABB === "C"
            ? 3
            : 2,
    } satisfies ShotData;
  });
}

function ShootingDataChart({
  player,
  shotsData,
  colorMode,
}: {
  player: PlayerSeasonData;
  shotsData: PlayerShotsData[];
  colorMode: DisplayMode;
}) {
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const courtSize = {
    width: 600,
    height: 564,
  };
  const ratio = 0.9;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = courtSize.width * ratio - margin.left - margin.right,
    height = courtSize.height * ratio - margin.top - margin.bottom;

  const shotsDataList = shotDataDlo(shotsData);

  // 顏色模式 1: 命中率 (漸層)
  const sucRateColor = d3.scaleSequential(
    d3.interpolateRgbBasis(["#e74c3c", "#2e86c1"]),
  );
  // 顏色模式 2: 區域 (離散)
  const zoneColor = d3
    .scaleOrdinal<number, string>()
    .domain([1, 2, 3])
    .range(["#9b59b6", "#52be80", "#f39c12"]);

  const drawHeatmap = (myData: any[]) => {
    const container = heatmapContainerRef.current;
    if (!container) return;

    // 先清空容器裡的所有內容
    d3.select(container).selectAll("*").remove();

    // 建立放置 legend 的 <div>
    d3.select(container)
      .append("div")
      .attr("class", "legend")
      .style("margin-bottom", "4px");

    // 在 container 底下新建一個 SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "heatmap")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // 計算資料
    const showArr = Array.from({ length: 50 }, () => new Array(47).fill(0));
    const sucArr = Array.from({ length: 50 }, () => new Array(47).fill(0));
    const zoneArr = Array.from({ length: 50 }, () => new Array(47).fill(0));
    const showData: any[] = [];

    let maxVal = 0;

    myData.forEach((d) => {
      showArr[d.X][d.Y]++;
      zoneArr[d.X][d.Y] = d.zone; // 這邊略去「zone conflict」檢查
      if (d.suc === 1) {
        sucArr[d.X][d.Y]++;
      }
      if (showArr[d.X][d.Y] > maxVal) {
        maxVal = showArr[d.X][d.Y];
      }
    });

    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 47; j++) {
        if (showArr[i][j] === 0) continue;
        showData.push({
          X: i,
          Y: j,
          val: showArr[i][j],
          suc: sucArr[i][j],
          zone: zoneArr[i][j],
        });
      }
    }

    // X/Y 軸的 domain
    const xDomain = [...Array(50).keys()];
    const yDomain = [...Array(47).keys()];

    const Xaxis = d3
      .scaleBand<number>()
      .range([0, width])
      .domain(xDomain)
      .padding(0.1);
    const Yaxis = d3
      .scaleBand<number>()
      .range([0, height])
      .domain(yDomain)
      .padding(0.1);

    const areaU = Xaxis.bandwidth() * Yaxis.bandwidth(); // 長寬對應的「最大方形面積」
    const areaL = areaU / 3;

    // 動態計算方塊大小：val 越大，方形越大
    const Length = (v: number) =>
      Math.sqrt(d3.scaleLinear().range([areaL, areaU]).domain([1, maxVal])(v));

    svg
      .selectAll("rect.block")
      .data(showData)
      .enter()
      .append("rect")
      .attr("class", "heatmap_block")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", (d) => Xaxis(d.X)! + Xaxis.bandwidth() / 2 - Length(d.val) / 2)
      .attr("y", (d) => Yaxis(d.Y)! + Yaxis.bandwidth() / 2 - Length(d.val) / 2)
      .attr("width", (d) => Length(d.val))
      .attr("height", (d) => Length(d.val))
      .style("fill", (d) => {
        if (colorMode === DisplayMode.HitRate) {
          return sucRateColor(d.suc / d.val);
        } else {
          return zoneColor(d.zone);
        }
      })
      .append("title")
      .text((d) => {
        return `shot: ${d.val}\nhit: ${d.suc}\nhit rate: ${(
          (100 * d.suc) /
          d.val
        ).toFixed(1)}%`;
      })
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>Shot:</strong> ${d.val}<br/>
          <strong>Hit:</strong> ${d.suc}<br/>
          <strong>Hit Rate:</strong> ${((100 * d.suc) / d.val).toFixed(1)}%`,
          )
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  };

  const drawLegend = () => {
    // clear legend
    d3.select("#HeatmapLegend").selectAll("*").remove();

    const container = document.getElementById("HeatmapLegend");

    if (!container) return;

    // 建立放置 legend 的 <div>
    const leg = d3
      .select(container)
      .append("div")
      .attr("class", "legend")
      .style("margin-bottom", "0px");

    // 在 container 底下新建一個 SVG
    d3.select(container)
      .append("svg")
      .attr("width", 200)
      .attr("height", 0)
      .attr("class", "heatmap")
      .append("g")
      .attr("transform", `translate(0, 0)`);

    // 生成對應的 legend
    if (colorMode === DisplayMode.HitRate) {
      sucRateColor.domain([0, 1]);
      const sucRateLegend = Legend(sucRateColor, {
        title: "命中率",
        tickFormat: (d: AxisDomain) =>
          ((d.valueOf() as number) * 100).toFixed(0) + "%",
      });
      if (sucRateLegend) leg.node()?.appendChild(sucRateLegend);
    } else if (colorMode === DisplayMode.Zone) {
      const zoneLegend = Legend(zoneColor, {
        title: "區域",
        tickSize: 0,
        tickFormat: (d: AxisDomain) => zoneConvert(d.valueOf() as number),
      });
      if (zoneLegend) leg.node()?.appendChild(zoneLegend);
    }
  };

  useEffect(() => {
    drawHeatmap(shotsDataList);
    drawLegend();
  }, [shotsData, colorMode, drawHeatmap, shotsDataList]);

  return (
    <div className="w-full rounded-xl p-4 flex flex-row justify-center items-center">
      <div className={"w-full flex flex-col justify-start items-center"}>
        <div id={"HeatmapLegend"} />
        <div
          className="bg-[url('/court.png')] bg-cover mb-8 bg-opacity-50 w-fit"
          id="Heatmap"
          ref={heatmapContainerRef}
        />
      </div>
      <div className={"w-full flex flex-col justify-start items-center"}>
        <PlayerShotsWithDistLineChart
          shotsDataList={shotsDataList}
          player={player}
        />
        <PlayerShotsFieldGoalWithDistLineChart
          shotsDataList={shotsDataList}
          player={player}
        />
      </div>
    </div>
  );
}

function PlayerShotsFieldGoalWithDistLineChart({
  shotsDataList,
  player,
}: {
  player: PlayerSeasonData;
  shotsDataList: ShotData[];
}) {
  const shotArr = Array(47).fill(0);
  const sucArr = Array(47).fill(0);

  shotsDataList.forEach((d) => {
    shotArr[d.dist]++;
    if (d.suc === 1) sucArr[d.dist]++;
  });

  const showData = shotArr
    .map((val, i) => ({
      distance: i,
      shot: val,
      goal: sucArr[i],
      fieldGoal: val === 0 ? 0 : (sucArr[i] / val) * 100,
    }))
    .filter((d) => d.shot >= 0 && d.distance <= 30);
  console.log(showData);
  const chartConfig = {
    distance: {
      label: "distance",
      color: `var(--${player?.Team})`,
    },
    shot: {
      label: "shot",
      color: `var(--${player?.Team})`,
    },
    fieldGoal: {
      label: "命中率",
      color: `var(--${player?.Team})`,
    },
  } satisfies ChartConfig;

  return (
    <div className={"p-2 w-full"}>
      <Label>距離與命中率</Label>
      <ChartContainer config={chartConfig} className={"w-full"}>
        <LineChart
          accessibilityLayer
          data={showData}
          margin={{
            bottom: 12,
            left: 8,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="distance"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            dataKey="fieldGoal"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}%`}
          />
          <Line
            dataKey="fieldGoal"
            type="natural"
            stroke={`var(--${player?.Team})`}
            strokeWidth={2}
            dot={false}
          />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator="line"
                labelKey="distance"
                // labelFormatter={(v) => `${v} ft`}
                hideLabel={false}
                hideIndicator={false}
              />
            }
          />
          <ReferenceLine
            x={23}
            stroke="#454545"
            label={"三分線"}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
function PlayerShotsWithDistLineChart({
  shotsDataList,
  player,
}: {
  player: PlayerSeasonData;
  shotsDataList: ShotData[];
}) {
  const showArr = Array(47).fill(0);
  let maxVal = 0;
  let totalShot = 0;

  shotsDataList.forEach((d) => {
    showArr[d.dist]++;
    totalShot++;
    if (showArr[d.dist] > maxVal) {
      maxVal = showArr[d.dist];
    }
  });
  const showData = showArr
    .map((val, i) => ({
      distance: i,
      frequency: (val / totalShot) * 100,
      shot: val,
    }))
    .filter((d) => d.shot >= 0 && d.distance <= 30);
  const chartConfig = {
    distance: {
      label: "distance ",
      color: `var(--${player?.Team})`,
    },
    shot: {
      label: "shot",
      color: `var(--${player?.Team})`,
    },
    frequency: {
      label: "投射頻率",
      color: `var(--${player?.Team})`,
    },
  } satisfies ChartConfig;

  return (
    <div className={"p-2 w-full"}>
      <Label>距離與投射頻率</Label>
      <ChartContainer config={chartConfig} className={"w-full"}>
        <LineChart
          accessibilityLayer
          data={showData}
          margin={{
            bottom: 12,
            left: 8,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="distance"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            dataKey="frequency"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}%`}
          />
          <Line
            dataKey="frequency"
            type="natural"
            stroke={`var(--${player?.Team})`}
            strokeWidth={2}
            dot={false}
          />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator="line"
                labelKey="distance"
                // labelFormatter={(v) => `${v} ft`}
                hideLabel={false}
                hideIndicator={false}
              />
            }
          />
          <ReferenceLine
            x={23}
            stroke="#454545"
            label={"三分線"}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

// function PlayerShotsWithD

function Legend(
  color: any,
  {
    title,
    tickSize = 10,
    width = 480,
    height = 70 + tickSize,
    marginTop = 24,
    marginRight = 0,
    marginBottom = 30 + tickSize,
    marginLeft = 5,
    ticks = width / 64,
    tickFormat,
    tickValues,
  }: {
    title: string;
    tickSize?: number;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    ticks?: number;
    tickFormat: (d: AxisDomain) => string;
    tickValues?: any;
  },
) {
  function ramp(colorFn: any, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) return canvas;
    for (let i = 0; i < n; ++i) {
      context.fillStyle = colorFn(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  let tickAdjust = (g: any) =>
    g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x: any;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);
    x = color
      .copy()
      .rangeRound(
        d3.quantize(d3.interpolate(marginLeft, width - marginRight), n),
      );

    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr(
        "xlink:href",
        ramp(
          color.copy().domain(d3.quantize(d3.interpolate(0, 1), n)),
        ).toDataURL(),
      );
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(
      color
        .copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      {
        range() {
          return [marginLeft, width - marginRight];
        },
      },
    );

    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3
          .range(n)
          .map((i) => d3.quantile(color.domain(), i / (n - 1)));
      }
      // if (typeof tickFormat !== "function") {
      //   tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      // }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds = color.thresholds
      ? color.thresholds() // scaleQuantize
      : color.quantiles
        ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat =
      tickFormat === undefined
        ? (d: any) => d
        : typeof tickFormat === "string"
          ? d3.format(tickFormat)
          : tickFormat;

    x = d3
      .scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([marginLeft, width - marginRight]);

    svg
      .append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
      .attr("x", (_d: any, i: number) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (_d: any, i: number) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", (d: any) => d);

    tickValues = d3.range(thresholds.length);
    // tickFormat = (i) => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3
      .scaleBand()
      .domain(color.domain())
      .rangeRound([marginLeft, width - marginRight]);
    svg
      .append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
      .attr("x", x)
      .attr("y", marginTop)
      .attr("width", Math.max(0, x.bandwidth() - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", color);

    tickAdjust = () => {};
  }

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat((domainValue) => tickFormat(domainValue))
        .tickSize(tickSize)
        .tickValues(tickValues),
    )
    .call(tickAdjust)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("class", "title")
        .text(title),
    );

  return svg.node();
}

/** 區域ID對應文字 */
function zoneConvert(zid: number): string {
  switch (zid) {
    case 1:
      return "corner";
    case 2:
      return "side center";
    case 3:
      return "center";
    default:
      return "";
  }
}

export default PlayerShootingDataChart;
