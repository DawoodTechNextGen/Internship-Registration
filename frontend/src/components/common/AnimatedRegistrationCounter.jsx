import { useEffect, useRef, useState } from "react";
import { useGetRegistrationCountQuery } from "../../api/apiSlice.js";

const formatCount = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const val = num / 1000;
    // Show one decimal place for < 10K, e.g., 1.5K, 9.9K
    // Show no decimal places for >= 10K, e.g., 10K, 150K
    // Truncate (floor) to match YouTube's style
    if (val < 10) {
      const formatted = (Math.floor(val * 10) / 10).toFixed(1).replace(/\.0$/, '');
      return `${formatted}K`;
    } else {
      return `${Math.floor(val)}K`;
    }
  }
  const val = num / 1000000;
  if (val < 10) {
    const formatted = (Math.floor(val * 10) / 10).toFixed(1).replace(/\.0$/, '');
    return `${formatted}M`;
  } else {
    return `${Math.floor(val)}M`;
  }
};

const AnimatedRegistrationCounter = () => {
  const [display, setDisplay] = useState("0");
  const current = useRef("0");
  const digitRefs = useRef([]);

  const { data } = useGetRegistrationCountQuery(undefined, {
    pollingInterval: 20000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data !== undefined && data !== null) {
      console.log("Count update from RTK:", data);
      const count = Number(data.count || data);
      if (!isNaN(count)) {
        const formatted = formatCount(count);
        if (formatted !== current.current) {
          setDisplay(formatted);
        }
      } else {
        console.error("Invalid count data:", data);
        setDisplay("0");
      }
    }
  }, [data]);

  useEffect(() => {
    const digitHeight = 32;
    const totalDuration = 1500; // 1.5 seconds
    const cycleTime = 800; // ms per cycle

    for (let index = 0; index < display.length; index++) {
      const ref = digitRefs.current[index];
      if (!ref) continue;

      const char = display[index];
      if (isNaN(parseInt(char))) continue;

      const targetDigit = parseInt(char);
      const direction = Math.random() > 0.5 ? 1 : -1; // 1 for bottom to up, -1 for top to bottom
      const endTranslate = -targetDigit * digitHeight;

      // Calculate start position for settle
      const settleStartElapsed = 0.9 * totalDuration;
      let startSettle;
      if (direction === 1) {
        startSettle =
          -216 + ((settleStartElapsed % cycleTime) / cycleTime) * 216;
      } else {
        startSettle = 0 - ((settleStartElapsed % cycleTime) / cycleTime) * 216;
      }

      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        let currentTranslate;
        if (progress < 0.9) {
          // Shuffle phase
          if (direction === 1) {
            currentTranslate = -216 + ((elapsed % cycleTime) / cycleTime) * 216;
          } else {
            currentTranslate = 0 - ((elapsed % cycleTime) / cycleTime) * 216;
          }
        } else {
          // Settle phase
          const settleProgress = (progress - 0.9) / 0.1;
          currentTranslate =
            startSettle + (endTranslate - startSettle) * settleProgress;
        }

        ref.style.transform = `translateY(${currentTranslate}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }

    current.current = display;
  }, [display]);

  return (
    <div className="text-center mb-8 flex flex-col items-center justify-center">
      {/* Dynamic counter with tight spacing and baseline alignment */}
      <div className="text-2xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight flex items-center justify-center mb-2">
        {display.split("").map((char, index) => {
          const isDigit = !isNaN(parseInt(char));
          if (isDigit) {
            return (
              <div
                key={index}
                className="inline-block w-3.5 h-8 overflow-hidden relative align-baseline leading-none"
              >
                <div
                  ref={(el) => (digitRefs.current[index] = el)}
                  className="absolute top-0 left-0 w-full flex flex-col"
                  style={{ transform: `translateY(0px)` }}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="h-8 flex items-end justify-center leading-none"
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            );
          } else {
            // Render non-digits (like '.', 'k', 'M') with matching height and baseline alignment
            digitRefs.current[index] = null;
            const widthClass = char === "." ? "w-1.5" : "w-3.5";
            return (
              <div
                key={index}
                className={`inline-block ${widthClass} h-8 overflow-hidden relative align-baseline leading-none`}
              >
                <div className="h-8 flex items-end justify-center leading-none font-black text-slate-900 dark:text-white">
                  {char}
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Engaging sub-message with urgency and dynamic counts */}
      <div className="text-xs sm:text-sm md:text-base font-semibold tracking-wide text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 select-none">
        <span className="inline-block animate-bounce text-base">🔥</span>
        <span>
          {display}+ Candidates Applied. Limited Slots Left! Apply Now!
        </span>
        <span className="inline-block animate-bounce text-base">🔥</span>
      </div>
    </div>
  );
};

export default AnimatedRegistrationCounter;
