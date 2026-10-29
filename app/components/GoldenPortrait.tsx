"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useRef } from "react";

const VARS = ["--mx", "--my", "--rx", "--ry", "--tx", "--ty"];

export default function GoldenPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height; // 0..1

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    // the outline behind the photo drifts the opposite way (depth)
    el.style.setProperty("--tx", String((0.5 - px) * 22));
    el.style.setProperty("--ty", String((0.5 - py) * 22));
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    VARS.forEach((name) => el.style.removeProperty(name));
  }

  return (
    <div
      className="portrait"
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="portrait-ring" aria-hidden="true" />

      <div className="portrait-card">
        <Image
          src="/images/profile.png"
          alt="Nutthanun Pengpala"
          fill
          priority
          sizes="(max-width: 900px) 80vw, 420px"
          className="portrait-image"
        />
        <div className="portrait-light" aria-hidden="true" />
      </div>
    </div>
  );
}