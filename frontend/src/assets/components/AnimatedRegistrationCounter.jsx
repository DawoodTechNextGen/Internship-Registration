import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://internship.dawoodtechnextgen.org/"); // your server URL

const AnimatedRegistrationCounter = () => {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    socket.on("registrationCount", ({ total }) => {
      animateWithShuffle(total);
    });

    return () => socket.off("registrationCount");
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
      <p className="text-sm text-slate-600 dark:text-slate-400">🔥 Already</p>

      <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
        {display.toLocaleString()}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Candidates Registered
      </p>
    </div>
  );
};

export default AnimatedRegistrationCounter;
