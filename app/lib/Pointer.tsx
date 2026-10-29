import type { PointerEvent } from "react";

// Writes the pointer position into --x / --y on the element, so CSS can
// draw a soft highlight under the cursor without re-rendering React.
export function trackPointer(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--y", `${event.clientY - rect.top}px`);
}