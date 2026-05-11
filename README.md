# Open Making and Building Standard (OMBS)

A research-grounded, openly licensed standard describing what it means to make and build well — across grade bands, mediums, and domains.

**Status:** Draft v0.2.0 (May 2026)
**License:** CC BY-SA 4.0
**Latest version:** [v0.2.0/STANDARD.md](v0.2.0/STANDARD.md)
**Machine-readable:** [v0.2.0/standards.json](v0.2.0/standards.json)

## Why this exists

Existing K–12 standards do an excellent job describing *content knowledge* (CCSS, NGSS) and *digital practice* (ISTE). They do less well describing the cross-cutting practices of **making** (originating something for an audience and purpose) and **building** (constructing structures and systems that hold up under use).

These practices appear in every domain — a poem, a robot, a science fair display, a Minecraft world, a community garden, a research paper. They are how learners convert understanding into artifacts the world can use. OMBS makes them assessable without flattening them into rubrics that miss what matters.

## What's in scope

- A conceptual model with two domains (Making, Building) sharing a five-practice spine
- Anchor competencies and grade-band progressions (K–2, 3–5, 6–8, 9–12)
- NGSS-style performance evidence descriptors
- Machine-readable codes for use by curriculum, assessment, and AI tools
- Crosswalks to NGSS Engineering Design, ISTE 2024, P21 4Cs, CCSS Writing, Agency by Design

## What's out of scope

- Subject-area content knowledge (use CCSS, NGSS, state standards)
- Social-emotional learning competencies (use CASEL)
- AI literacy (use UNESCO AI Literacy Framework)
- Career and technical credentials (use ASCA, industry frameworks)

## How to use

- **Educators:** see [STANDARD.md](v0.2.0/STANDARD.md) §7 (Progressions) and §8 (Evidence Descriptors).
- **Curriculum designers:** map units to OMBS codes; use [crosswalks.json](v0.2.0/crosswalks.json) to align with adopted standards.
- **AI / ed-tech tools:** ingest [standards.json](v0.2.0/standards.json); cite codes in tags and recommendations.
- **Researchers:** the standard is versioned; cite as `OMBS v0.2.0 (2026)`.

## Governance

This is a draft standard intended for community review and revision. See [GOVERNANCE.md](GOVERNANCE.md) for how decisions are made and [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose changes.

## Versioning

Semantic versioning. **Breaking changes** (rename/remove codes, change ID format) require a major version bump and a one-version deprecation window. **Additive changes** (new dimensions, new evidence descriptors) bump the minor version. **Editorial changes** (clarifications, typos, crosswalks) bump the patch version.

## Citation

> Open Making and Building Standard (OMBS), v0.2.0. 2026. CC BY-SA 4.0.
