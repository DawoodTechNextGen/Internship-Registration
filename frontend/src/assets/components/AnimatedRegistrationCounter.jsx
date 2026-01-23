import axios from "axios";
import { useEffect, useRef, useState } from "react";

const AnimatedRegistrationCounter = () => {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await axios.get(
          "https://internship.dawoodtechnextgen.org/api/count-register",
        );
        
        animateWithShuffle(data);
      } catch (err) {
        console.error("Count fetch error:", err);
      }
    };

    // first time fetch
    fetchCount();

    // poll every 10 seconds
    const interval = setInterval(fetchCount, 20000);

    return () => clearInterval(interval);
  }, []);

  const animateWithShuffle = (target) => {
    const shuffleTime = 900;
    const shuffleStart = performance.now();

    const shuffle = (time) => {
      const progress = (time - shuffleStart) / shuffleTime;

      if (progress < 1) {
        const smallChange = Math.floor(Math.random() * 8) - 4;
        const value = Math.max(0, current.current + smallChange);

        setDisplay(value);
        requestAnimationFrame(shuffle);
      } else {
        rollUp(target);
      }
    };

    requestAnimationFrame(shuffle);
  };

  const rollUp = (target) => {
    const start = current.current;
    const duration = 1400;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const value = Math.floor(start + (target - start) * easeOut);

      current.current = value;
      setDisplay(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="text-center mb-8">
      {/* <p className="text-sm text-slate-600 dark:text-slate-400">🔥 Already</p> */}

      <div className="text-2xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
        🔥 Already {display.toLocaleString()} Candidates Registered
      </div>

      {/* <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Candidates Registered
      </p> */}
    </div>
  );
};

export default AnimatedRegistrationCounter;
