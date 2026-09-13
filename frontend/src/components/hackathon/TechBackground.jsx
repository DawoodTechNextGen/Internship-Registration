import React from "react";

const TechBackground = () => (
  <>
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #2875E8 1px, transparent 1px), linear-gradient(to bottom, #2875E8 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    ></div>
    <div className="pointer-events-none absolute top-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
    <div className="pointer-events-none absolute top-40 right-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl"></div>
    <div className="pointer-events-none absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
  </>
);

export default TechBackground;
