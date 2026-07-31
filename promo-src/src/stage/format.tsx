import React, { createContext, useContext } from "react";
import type { Format } from "../tokens";

const FormatContext = createContext<Format | null>(null);

export const FormatProvider: React.FC<{ format: Format; children: React.ReactNode }> = ({
  format,
  children,
}) => <FormatContext.Provider value={format}>{children}</FormatContext.Provider>;

export const useFormat = () => {
  const f = useContext(FormatContext);
  if (!f) throw new Error("useFormat outside FormatProvider");
  return f;
};

/**
 * The demo's own breakpoints (docs/demo/index.html L379-396). The recreated viewport is a real
 * width, so the same queries decide the same things here — 432px CSS gets the phone treatment
 * because 432px is a phone, not because a mobile variant was authored.
 */
export const useBreak = () => {
  const { cssW } = useFormat();
  return { under700: cssW <= 700, under600: cssW <= 600, under400: cssW <= 400 };
};

/** The demo's `.wrap`: 940px measure, 1.5rem gutters (L53). */
export const wrapStyle = (cssW: number): React.CSSProperties => ({
  maxWidth: 940,
  margin: "0 auto",
  padding: "0 24px",
  width: cssW,
  boxSizing: "border-box",
});
