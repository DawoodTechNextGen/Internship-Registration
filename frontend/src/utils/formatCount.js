// YouTube-style compact number formatting: 950, 1.5K, 10K, 2M, etc.
const formatCount = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const val = num / 1000;
    // Show one decimal place for < 10K, e.g., 1.5K, 9.9K
    // Show no decimal places for >= 10K, e.g., 10K, 150K
    // Truncate (floor) to match YouTube's style
    if (val < 10) {
      const formatted = (Math.floor(val * 10) / 10).toFixed(1).replace(/\.0$/, "");
      return `${formatted}K`;
    } else {
      return `${Math.floor(val)}K`;
    }
  }
  const val = num / 1000000;
  if (val < 10) {
    const formatted = (Math.floor(val * 10) / 10).toFixed(1).replace(/\.0$/, "");
    return `${formatted}M`;
  } else {
    return `${Math.floor(val)}M`;
  }
};

export default formatCount;
