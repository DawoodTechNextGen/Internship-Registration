import { useEffect, useRef, useState } from "react";
import { useGetRegistrationCountQuery } from "../../api/apiSlice.js";

const AnimatedRegistrationCounter = () => {
  const [display, setDisplay] = useState("0");
  const current = useRef(0);
  const digitRefs = useRef([]);

  const animateDigitShuffle = (target) => {
    console.log("Animating to target:", target);
    const targetStr = target.toString();
    setDisplay(targetStr); // Update display immediately to render correct number of digit containers
    const digitHeight = 32;
    const totalDuration = 1500; // 1.5 seconds
    const cycleTime = 800; // ms per cycle
    const speed = 216 / cycleTime; // px per ms

    digitRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const targetDigit = parseInt(targetStr[index]);
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
    });

    // Update the display string after animation
    setTimeout(() => {
      current.current = target;
    }, totalDuration);
  };

  const { data } = useGetRegistrationCountQuery(undefined, {
    pollingInterval: 20000,
  });

  useEffect(() => {
    if (data !== undefined && data !== null) {
      console.log("Count update from RTK:", data);
      const count = Number(data.count || data);
      if (!isNaN(count)) {
        animateDigitShuffle(count);
      } else {
        console.error("Invalid count data:", data);
        animateDigitShuffle(0);
      }
    }
  }, [data]);

  return (
    <div className="text-center mb-8">
      <div className="text-2xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
        {display.split("").map((digit, index) => (
          <div
            key={index}
            className="inline-block w-6 h-8 overflow-hidden relative align-baseline leading-none"
          >
            <div
              ref={(el) => (digitRefs.current[index] = el)}
              className="absolute top-0 left-0 flex flex-col"
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
        ))}
        <br />
        🔥 Candidates Already Registered 🔥 
      </div>
    </div>
  );
};

export default AnimatedRegistrationCounter;
