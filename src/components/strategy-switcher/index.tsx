"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useGameStore } from "@/zustand/game-store";
import {
  getOrderStrategy,
  listOrderStrategies,
  setOrderStrategy,
} from "@/utils/order-strategies";

/**
 * Dev-only affordance to compare board order strategies in-game.
 * Press `s` (next) or `Shift+S` (previous) — or click the badge — to switch the
 * peel strategy and re-deal the current level with it. Hidden in production
 * builds; the strategy choice (localStorage) still persists across reloads.
 */
const enabled = process.env.NODE_ENV !== "production";

const StrategySwitcher: React.FC = () => {
  const redeal = useGameStore((state) => state.redealCurrentLevel);
  const [current, setCurrent] = useState<string>(() =>
    enabled ? getOrderStrategy().name : ""
  );

  const cycle = useCallback(
    (dir: number) => {
      const names = listOrderStrategies().map((s) => s.name);
      const idx = names.indexOf(getOrderStrategy().name);
      const next = names[(idx + dir + names.length) % names.length];
      setOrderStrategy(next);
      setCurrent(next);
      redeal();
    },
    [redeal]
  );

  useEffect(() => {
    if (!enabled) return;
    const isTyping = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      return (
        node.tagName === "INPUT" ||
        node.tagName === "TEXTAREA" ||
        node.tagName === "SELECT" ||
        node.isContentEditable
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key === "s") {
        e.preventDefault();
        cycle(1);
      } else if (e.key === "S") {
        e.preventDefault();
        cycle(-1);
      } else if (e.key === "r" || e.key === "R") {
        // re-deal the *same* strategy — to watch a single strategy vary
        e.preventDefault();
        redeal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle, redeal]);

  if (!enabled) return null;

  const strategies = listOrderStrategies();

  return (
    <div className="group fixed bottom-3 left-3 z-50 select-none font-mono text-xs">
      {/* hover explanation — lists every strategy, current one highlighted */}
      <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-72 origin-bottom-left scale-95 rounded-lg border border-white/15 bg-black/90 p-3 text-white/80 opacity-0 shadow-xl backdrop-blur transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
          board order strategy
        </div>
        <ul className="space-y-2">
          {strategies.map((s) => {
            const active = s.name === current;
            return (
              <li key={s.name} className={active ? "text-amber-300" : "text-white/60"}>
                <span className="font-semibold">{active ? "▸ " : "  "}{s.name}</span>
                <div className="pl-3 text-[11px] leading-snug text-white/45">{s.description}</div>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 border-t border-white/10 pt-2 text-[10px] leading-relaxed text-white/35">
          s next · ⇧s prev · r re-deal (same strategy) · or click
          <br />
          note: strategies change the hidden solution, not the visible layout.
        </div>
      </div>

      <button
        type="button"
        onClick={() => cycle(1)}
        className="rounded-md border border-white/15 bg-black/70 px-3 py-2 text-white/80 backdrop-blur transition-colors hover:bg-black/80"
      >
        <span className="text-white/40">order</span>{" "}
        <span className="text-amber-300">{current}</span>{" "}
        <span className="text-white/30">· s / ⇧s</span>
      </button>
    </div>
  );
};

export default StrategySwitcher;
