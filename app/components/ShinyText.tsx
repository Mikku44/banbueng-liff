import { useEffect, useRef } from "react";

type Props = {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: "left" | "right";
  yoyo?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#cdcdcd",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const duration = `${speed}s`;
  const d = `${delay}s`;

  if (disabled) {
    return <span className={className} style={{ color }}>{text}</span>;
  }

  return (
    <span
      ref={ref}
      className={`inline-block ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""} ${className}`}
      style={
        {
          color,
          backgroundImage: `linear-gradient(${direction === "left" ? 110 : 70}deg, transparent ${45 - spread / 3}%, ${shineColor} 50%, transparent ${55 + spread / 3}%)`,
          backgroundSize: "250% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `shiny-slide ${duration} ${d} ${yoyo ? "alternate" : "normal"} infinite linear`,
        } as any
      }
    >
      {text}
      <style>{`@keyframes shiny-slide { 0% { background-position: ${direction==="left" ? "150%" : "-50%"} 0; } 100% { background-position: ${direction==="left" ? "-50%" : "150%"} 0; } }`}</style>
    </span>
  );
}
