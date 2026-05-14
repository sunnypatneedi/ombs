# Changelog

All notable changes to OMBS are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows semver as defined in README.md.

## [Unreleased]

### Changed

- Strengthened theoretical grounding in §1.5 with two new source bullets: Blikstein (2013) names the three foundational pillars of making as a learning practice (Constructionism/Papert, experiential education/Dewey, critical pedagogy/Freire) and grounds the keychain syndrome as the empirical basis for the Practice-over-outcome and Failure-positive design principles; Blikstein & Worsley (2016) maps four maker-culture failure modes to specific OMBS design choices and adds Wilensky's reframing of the concrete/abstract dichotomy as the basis for the medium-agnostic principle.
- §1.2 Design principles: *Practice over outcome* now cites the keychain syndrome from makerspace research; *Failure-positive* now incorporates Papert's "hard fun" to distinguish productive difficulty from mere frustration.
- §11 Bibliography: added Blikstein (2013), Blikstein & Worsley (2016), Papert (2002), and Wilensky (1991).

## [0.2.0] — 2026-05-11

Standard files now live in `v0.2.0/`. The `v0.1.0/` directory has been moved (not duplicated) — `v0.1.0` remains citable via the tagged release / git history.

### Added

- New Shared dimension `OMBS.S.AI` — **AI-Independence**. Where AI tools were used in producing the artifact, the learner can show what they kept, what they changed, and what they rejected, with reasons; intention, voice, and the judgment behind tradeoffs remain the learner's. Operationalizes the AI stance previously stated only in §1.2 and Appendix A into an observable, scorable dimension. Adds §4.6 anchor, a row in the §7.2 Shared progression table, and progression cells `OMBS.S.AI.K2.1`, `OMBS.S.AI.35.1`, `OMBS.S.AI.68.1`, `OMBS.S.AI.912.1` in §8.1 and `standards.json`. Reported as not applicable when no AI tools were used. Distinct from AI literacy (which remains out of scope per §1.6); this dimension assesses whether the learner remained the source of choice in a build, not the learner's understanding of AI as a subject.
- Reference to the maker-mindset literature (Dougherty 2016; Regalla 2016) in §1.5 Theoretical grounding and §11 Bibliography.
- Additional maker-education references in §1.5 Theoretical grounding and §11 Bibliography: Halverson & Sheridan 2014; Sheridan et al. 2014; Peppler, Halverson, & Kafai (eds.) *Makeology* Vol. 2 (2016); Vossoughi, Hooper, & Escudé 2016; Martinez & Stager 2019; Honey & Kanter (eds.) 2013.

### Changed

- Version bumped from 0.1.0 → 0.2.0 (additive minor bump per the versioning table). Standard files moved from `v0.1.0/` to `v0.2.0/`. Internal version references updated in `STANDARD.md`, `standards.json`, `crosswalks.json`, and `README.md`. `LICENSE.md` attribution examples retained at v0.1.0 — historical and still valid.

## [0.1.0] — 2026-04-30

### Added

- Initial draft of the standard.
- Two domains: Making (M) and Building (B), each with 4 dimensions.
- Five Shared Practices (S) spine: Define, Draft, Test, Iterate, Share.
- Grade-band progressions for K–2, 3–5, 6–8, 9–12.
- NGSS-style evidence descriptors for each progression cell.
- Machine-readable `standards.json` with full ID hierarchy.
- Crosswalks to NGSS K–12 Engineering Design, ISTE Standards for Students (2024 refresh), P21 4Cs, Agency by Design (Maker-Centered Learning), and CCSS ELA Writing standards.
- Glossary of 24 key terms.
- License: CC BY-SA 4.0.
- Governance and contribution scaffolding.

### Known limitations

- No translations yet (English only).
- Evidence descriptors authored by drafting team; not yet validated through teacher review or empirical study. Construct validity work pending.
- No alignment yet to international frameworks (Australian Curriculum, IB MYP Design, OECD Learning Compass 2030).
- Computational thinking practices are referenced but not enumerated; future minor version may add a sub-domain.
