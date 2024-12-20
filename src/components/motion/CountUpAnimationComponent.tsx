import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountUpComponentProps = {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

function CountUpComponent({
  end,
  duration,
  prefix,
  suffix,
  className,
}: CountUpComponentProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = duration / end; // 計算每次增加的時間間隔（毫秒）
    const startTime = performance.now();

    const increment = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const currentCount = Math.min(end, Math.floor(elapsed / stepTime));
      setCount(currentCount);

      if (currentCount < end) {
        requestAnimationFrame(increment);
      }
    };

    requestAnimationFrame(increment);
  }, [end, duration]);

  return (
    <p className={cn("text-4xl font-semibold", className)}>
      {prefix}
      {new Intl.NumberFormat("en-IN", {
        maximumSignificantDigits: 3,
      }).format(count)}
      {suffix}
    </p>
  );
}

export default CountUpComponent;
