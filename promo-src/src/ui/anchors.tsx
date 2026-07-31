/**
 * Anchors — how the pointer finds a real control.
 *
 * The pointer is not driven by hand-typed coordinates. Every control that gets touched
 * registers its own element; after each render we measure those elements against the page
 * root and hand the pointer the result. So the pointer lands on the chip because the chip is
 * where it is — not because someone guessed 214px and got lucky at one aspect ratio.
 *
 * Rects are in *document* CSS pixels: the page root carries the camera translate, so measuring
 * a child against the root cancels it out. The outer format scale is divided back out, so both
 * formats speak the same units.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Rect = { cx: number; cy: number; x: number; y: number; w: number; h: number };
export type Anchors = Record<string, Rect>;

type Registry = {
  register: (id: string, el: HTMLElement | null) => void;
  anchors: Anchors;
};

const AnchorContext = createContext<Registry>({ register: () => undefined, anchors: {} });

const near = (a: number, b: number) => Math.abs(a - b) < 0.25;

const same = (a: Anchors, b: Anchors) => {
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  for (const k of ka) {
    const p = a[k];
    const q = b[k];
    if (!q) return false;
    if (!near(p.x, q.x) || !near(p.y, q.y) || !near(p.w, q.w) || !near(p.h, q.h)) return false;
  }
  return true;
};

export const AnchorProvider: React.FC<{
  scale: number;
  children: (rootRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}> = ({ scale, children }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const [anchors, setAnchors] = useState<Anchors>({});

  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (el) els.current.set(id, el);
    else els.current.delete(id);
  }, []);

  /**
   * No dependency array on purpose: the layout is a function of the frame, so it can change on
   * every render. The equality guard is what stops this from looping.
   *
   * Measuring costs a render round-trip — measure, set state, re-render with the new numbers —
   * and that round-trip is why this composition MUST be rendered one frame after another. See
   * the `concurrency: 1` note in scripts/render.mjs: a browser that renders frame 200 and then
   * jumps to frame 525 lays out the new page while still holding the old page's measurements,
   * and the pointer ends up pressing a link that is no longer under it. Holding the frame open
   * with `delayRender` until the measurements stop moving was tried and is NOT the fix — the
   * handle outlives the settle on some frames and stalls the whole render.
   */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const r0 = root.getBoundingClientRect();
    const next: Anchors = {};
    for (const [id, el] of els.current) {
      const r = el.getBoundingClientRect();
      const x = (r.left - r0.left) / scale;
      const y = (r.top - r0.top) / scale;
      const w = r.width / scale;
      const h = r.height / scale;
      next[id] = { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
    }
    setAnchors((prev) => (same(prev, next) ? prev : next));
  });

  const value = useMemo(() => ({ register, anchors }), [register, anchors]);

  return <AnchorContext.Provider value={value}>{children(rootRef)}</AnchorContext.Provider>;
};

export const useAnchors = () => useContext(AnchorContext).anchors;

/** Ref callback for a control the pointer will touch. */
export const useAnchorRef = (id: string) => {
  const { register } = useContext(AnchorContext);
  return useCallback((el: HTMLElement | null) => register(id, el), [register, id]);
};

/**
 * The raw registrar, for lists. A component that renders N controls registers them from one
 * hook call rather than calling `useAnchorRef` inside the map — the hook count has to stay
 * fixed even when the list does not.
 */
export const useRegister = () => useContext(AnchorContext).register;
