/**
 * The masthead, recreated from docs/demo/index.html L405-426 and its CSS at L59-111.
 * It is `position: sticky; top: 0` on the real page; here it is pinned to the top of the
 * recreated viewport, which for a page that only scrolls downward is the same thing.
 *
 * The version pill reads standards.json, exactly as the demo's does (L712).
 */

import React from "react";
import { C, FONT } from "../tokens";
import { VERSION } from "../standard";
import { useBreak, useFormat } from "./format";

const NAV = ["⊞ Overview", "⊟ Standards", "⌕ Search", "# Crosswalks", "ⓘ About"];

export const Header: React.FC = () => {
  const { cssW } = useFormat();
  const { under600 } = useBreak();

  return (
    <header
      style={{
        background: C.white,
        borderBottom: `4px solid ${C.s200}`,
        padding: under600 ? "12px 16px" : "14px 24px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        width: cssW,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: under600 ? "wrap" : "nowrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.s900 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: C.s900,
              color: C.white,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 11.2,
              letterSpacing: "-0.5px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
              flexShrink: 0,
              lineHeight: 1.2,
            }}
          >
            OMBS
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: under600 ? 15.2 : 19.2,
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
              }}
            >
              Open Making &amp; Building Standard
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3.2 }}>
              <span
                style={{
                  background: C.s200,
                  color: C.s700,
                  fontSize: 10.9,
                  fontWeight: 700,
                  padding: "2.4px 8px",
                  borderRadius: 20,
                }}
              >
                v{VERSION}
              </span>
              <span style={{ fontSize: 12.5, color: C.s500, fontWeight: 500 }}>
                K–12 Cross-Domain Framework
              </span>
            </div>
          </div>
        </div>

        {/* The demo's nav is `overflow-x: auto` (L93) — on a handset it is a strip you swipe.
            A render cannot swipe it, so the phone cut would otherwise hold a hard cut through
            the middle of "About" for twenty seconds. The mask is the overflow affordance the
            scroll gesture would have supplied: same five items, same order, nothing invented,
            and the last one visibly continues past the edge instead of being guillotined. */}
        <nav
          style={{
            background: C.s100,
            padding: 6,
            borderRadius: 20,
            display: "flex",
            gap: 2,
            overflow: "hidden",
            width: under600 ? "100%" : "auto",
            boxSizing: "border-box",
            ...(under600
              ? {
                  WebkitMaskImage:
                    "linear-gradient(to right, #000 0, #000 calc(100% - 44px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, #000 0, #000 calc(100% - 44px), transparent 100%)",
                }
              : null),
          }}
        >
          {NAV.map((label) => (
            <span
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                padding: "8px 17.6px",
                borderRadius: 14,
                fontFamily: FONT.sans,
                fontSize: 13.4,
                fontWeight: 700,
                color: C.s600,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
};
