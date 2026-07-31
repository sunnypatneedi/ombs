/**
 * The pointer.
 *
 * Drawn, not imported — a system cursor screenshot would be the wrong size at both formats and
 * would drift with the OS. Ink fill on a white keyline so it stays legible on white cards, the
 * --s100 tab trough and the --s900 callout border alike.
 *
 * Everything here is a function of the frame. There is not a transition in the file.
 */

import React from "react";
import { C } from "../tokens";

export const Cursor: React.FC<{
  x: number;
  y: number;
  press: number;
  /** Ring left behind at the moment of contact, 0…1. */
  contact: number;
}> = ({ x, y, press, contact }) => {
  const squash = 1 - press * 0.16;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {contact > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: -1,
            top: -1,
            width: 2,
            height: 2,
            borderRadius: 999,
            border: `2px solid ${C.s900}`,
            opacity: (1 - contact) * 0.55,
            transform: `scale(${1 + contact * 17})`,
          }}
        />
      ) : null}

      <svg
        width={26}
        height={30}
        viewBox="0 0 26 30"
        style={{
          display: "block",
          transform: `scale(${squash})`,
          transformOrigin: "2px 2px",
          filter: `drop-shadow(0 ${2 + press}px ${3 + press * 2}px rgba(15,23,42,0.28))`,
        }}
      >
        {/* A plain arrow: tip at the hotspot (2,2), so `x`,`y` is where it actually points. */}
        <path
          d="M2 2 L2 21.2 L7.05 16.5 L10.35 23.9 L13.7 22.4 L10.5 15.2 L17.2 14.7 Z"
          fill={C.s900}
          stroke={C.white}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
