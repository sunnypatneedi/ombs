# Open Making and Building Standard (OMBS) Viewer

## Overview
A web-based viewer for the Open Making and Building Standard (OMBS) v0.1.0 — a research-grounded, openly licensed K–12 standard describing what it means to make and build well across grade bands, mediums, and domains.

## Architecture
- **Runtime:** Node.js 20
- **Server:** `server.js` — a lightweight built-in `http` module server serving static files on port 5000
- **Frontend:** `index.html` — a single-page app with tabs for browsing the standard, searching codes, and viewing crosswalks
- **Data:** `v0.1.0/standards.json` and `v0.1.0/crosswalks.json` — machine-readable standard data loaded at runtime by the frontend via fetch

## Key Files
- `server.js` — HTTP server (port 5000, host 0.0.0.0)
- `index.html` — Single-page viewer (HTML/CSS/JS, no framework)
- `v0.1.0/standards.json` — Machine-readable standard data
- `v0.1.0/crosswalks.json` — Crosswalk mappings to NGSS, ISTE, P21, etc.
- `v0.1.0/STANDARD.md` — Full human-readable standard text (581 lines)

## Features
- **Overview tab:** Key stats and expandable domain cards
- **Standards Browser:** Filter by domain, expand to view all evidence descriptors by grade band
- **Search Codes:** Full-text search across all 53+ evidence descriptors with grade-band filtering
- **Crosswalks:** Mappings to NGSS Engineering Design, ISTE 2024, P21 4Cs, Agency by Design, CCSS ELA Writing
- **About:** Purpose, design principles, code format, citation info

## Workflow
- **Start application:** `node server.js` — serves on port 5000

## Standard Content Summary
- 3 domains: Shared Practices (S), Making (M), Building (B)
- 13 dimensions total (5 shared + 4 making + 4 building)
- 53+ evidence descriptors across 4 grade bands (K–2, 3–5, 6–8, 9–12)
- License: CC BY-SA 4.0
