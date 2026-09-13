import { useEffect, useRef, useState } from "react";
import { useGetHackathonCountQuery } from "../../api/apiSlice.js";
import formatCount from "../../utils/formatCount.js";

const HackathonParticipantCounter = ({ hackathonId }) => {
  const [display, setDisplay] = useState("0");
  const current = useRef("0");
  const digitRefs = useRef([]);

  const { data } = useGetHackathonCountQuery(hackathonId, {
    skip: !hackathonId,
    pollingInterval: 20000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data !== undefined && data !== null) {
      const count = Number(data.count || data);
      if (!isNaN(count)) {
        const formatted = formatCount(count);
        if (formatted !== current.current) {
          setDisplay(formatted);
        }
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
      const direction = Math.random() > 0.5 ? 1 : -1;
      const endTranslate = -targetDigit * digitHeight;

      const settleStartElapsed = 0.9 * totalDuration;
      let startSettle;
      if (direction === 1) {
        startSettle = -216 + ((settleStartElapsed % cycleTime) / cycleTime) * 216;
      } else {
        startSettle = 0 - ((settleStartElapsed % cycleTime) / cycleTime) * 216;
      }

      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        let currentTranslate;
        if (progress < 0.9) {
          if (direction === 1) {
            currentTranslate = -216 + ((elapsed % cycleTime) / cycleTime) * 216;
          } else {
            currentTranslate = 0 - ((elapsed % cycleTime) / cycleTime) * 216;
          }
        } else {
          const settleProgress = (progress - 0.9) / 0.1;
          currentTranslate = startSettle + (endTranslate - startSettle) * settleProgress;
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
    <div className="text-center flex flex-col items-center justify-center">
      <div className="text-2xl md:text-2xl font-black text-white tabular-nums tracking-tight flex items-center justify-center mb-2">
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
                    <div key={i} className="h-8 flex items-end justify-center leading-none">
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            );
          } else {
            digitRefs.current[index] = null;
            const widthClass = char === "." ? "w-1.5" : "w-3.5";
            return (
              <div
                key={index}
                className={`inline-block ${widthClass} h-8 overflow-hidden relative align-baseline leading-none`}
              >
                <div className="h-8 flex items-end justify-center leading-none font-black text-white">
                  {char}
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="text-xs sm:text-sm md:text-base font-mono font-semibold tracking-wide text-slate-400 flex items-center justify-center gap-1.5 select-none">
        <span className="inline-block animate-bounce text-base">🚀</span>
        <span>{display}+ Innovators Registered. Join the Challenge!</span>
        <span className="inline-block animate-bounce text-base">🚀</span>
      </div>
    </div>
  );
};

export default HackathonParticipantCounter;
