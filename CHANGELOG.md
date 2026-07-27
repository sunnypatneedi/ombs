# Changelog

All notable changes to OMBS are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows semver as defined in README.md.

## [Unreleased]

> **Draft for the 30-day public comment window.** New dimensions and codes require steering review, 30 days of public comment, and a 2/3 majority (GOVERNANCE.md). Nothing below is adopted until that window closes. Version strings read `0.3.0` throughout so the draft is internally consistent and machine-checkable during review; the version is not tagged.

### Added

- **Evidence and provenance layer** (§8.1) — three coded object types answering what may count as a trace of a practice, who is competent to record one, and what their record warrants. v0.2.0 stated evidence requirements without saying what satisfies them (`OMBS.S.DF.68.1` requires a revision "dated or otherwise traceable" and never says which artifacts count), which forced every adopter to invent the answer privately and produce incomparable data.
  - Six **evidence forms** (§8.1.1), defined by epistemic shape rather than medium so the medium-agnostic principle in §1.2 holds: `OMBS.EF.LA` learner-authored trace, `OMBS.EF.AR` artifact state, `OMBS.EF.SR` system record, `OMBS.EF.OB` observation record, `OMBS.EF.AC` audience response, `OMBS.EF.LR` learner retrospective account.
  - Four **observer types** (§8.1.2), each stating what it warrants and what it does not: `OMBS.OB.SF` self, `OMBS.OB.WT` witness, `OMBS.OB.AT` attester, `OMBS.OB.AD` automated derivation. The witness/attester split is load-bearing — a witness warrants authorship and presence, never band attainment.
  - Five **admissibility rules** (§8.1.3): `OMBS.EV.DISC` disclosure, `OMBS.EV.SEQ` sequence, `OMBS.EV.RESP` response, `OMBS.EV.WARR` no inflation, `OMBS.EV.CONS` conservative derivation.
  - Grounding: Mislevy, Steinberg, & Almond (2003) for the claim/evidence separation; Messick (1995) for the no-inflation rule; Parasuraman & Riley (1997) for conservative automated derivation.
- **`OMBS.S.AI` decomposed into four sub-dimensions** (§4.6.2–§4.6.5), each with an evidence descriptor for all four grade bands (§8.2). v0.2.0 bundled four separable questions into one descriptor per band; a learner can appraise sharply while never having chosen the task, or disclose honestly while delegating more each week.
  - `OMBS.S.AI.DI` **Direction** — the learner, not the tool, decides what is to be made. Components `OMBS.S.AI.DI.K2.1`, `.35.1`, `.68.1`, `.912.1`. Grounding: Zimmerman (2002); Salomon, Perkins, & Globerson (1991).
  - `OMBS.S.AI.AP` **Appraisal** — each substantive output judged against criteria the learner can state, with the keep/change/reject decision and reason recorded. Components `OMBS.S.AI.AP.K2.1`, `.35.1`, `.68.1`, `.912.1`. Grounding: Tai et al. (2018); Parasuraman & Riley (1997).
  - `OMBS.S.AI.AB` **Attribution** — parts of the artifact mapped to their origin at a granularity a reader can check. Components `OMBS.S.AI.AB.K2.1`, `.35.1`, `.68.1`, `.912.1`. Grounding: Perkins (2023); Perkins et al. (2024); Mislevy, Steinberg, & Almond (2003).
  - `OMBS.S.AI.TJ` **Trajectory** — change over the work in what the learner delegates, and whether they can say what they took over and why. Reported as not applicable where only one substantive AI use exists. Components `OMBS.S.AI.TJ.K2.1`, `.35.1`, `.68.1`, `.912.1`. Grounding: Salomon, Perkins, & Globerson (1991); Pea (2004); Wood, Bruner, & Ross (1976).
- **§3.1 Sub-dimensions** — the code format gains an optional sub-dimension segment, `OMBS.<domain>.<dimension>.<sub-dimension>.<grade-band>.<component>`. Additive: the parent dimension keeps its own band components, now documented as composite.
- **§3.2 Auxiliary code namespaces** — `OMBS.EF.*`, `OMBS.OB.*`, `OMBS.EV.*` reserved for the evidence layer; `EF`, `OB`, `EV` will never be issued as domain identifiers.
- **§4.6.1 What S.AI is not** — an explicit statement that S.AI is not AI literacy and not a compliance check, reinforcing the §1.3 scope boundary against the most likely misreading.
- **§9.6 crosswalk to the Artificial Intelligence Assessment Scale** and **§9.7 Boundaries** — a machine-readable `boundaries` block in `crosswalks.json` naming frameworks OMBS deliberately does *not* overlap (UNESCO AI Competency Framework for Students; CASEL), so scope adjacency is checkable rather than interpretive.
- **`scripts/check-parity.mjs`** — the parity CI that `CONTRIBUTING.md` has promised since v0.1.0 and that did not exist. Zero dependencies, `node scripts/check-parity.mjs`, non-zero exit naming every offending code. Asserts: one standard directory; version agreement across `standards.json`, `crosswalks.json`, `STANDARD.md`, `README.md`; well-formed unique code IDs; the self-describing-node invariant; four-band coverage on every dimension; prose↔JSON parity in both directions; crosswalk and boundary references resolving; that every §8 descriptor text is identical between the prose and the JSON; and that codes introduced in the current version carry a citation resolving to the bibliography.
- **Machine-readable `bibliography`** in `standards.json` — ten entries, each with a DOI, keyed from the codes that cite them.

### Changed

- Every component node in `standards.json` is now **self-describing**: it carries `domain`, `dimension`, `gradeBand`, and an inline `evidence` block naming admissible forms and competent observer types. A leaf is interpretable without traversal context. This applies to all 73 components, including the 57 carried forward from v0.2.0 (whose descriptor text is unchanged).
- Every dimension declares `introducedIn`; dimensions introduced in the current version must carry at least one citation, which `check-parity.mjs` enforces.
- `standards.json` gains `ombsVersion` alongside `version`, matching the key `crosswalks.json` already used. The checker asserts the two are identical, so the mirror cannot drift.
- §8 renumbered to make room for the evidence layer: §8.1 is the evidence and provenance layer; Shared Practices, Making, and Building descriptors are now §8.2, §8.3, §8.4. Dimension headings in §8 now carry the fully-qualified anchor code (`OMBS.S.DF` rather than `S.DF`) — previously most anchor codes appeared nowhere in the prose in qualified form, which the new parity check surfaced.
- §2.2 restated: the Shared spine is five unconditional practices plus one conditional (`S.AI`); the standard now has 14 dimensions, 4 sub-dimensions, and 73 leaf-level statements.
- Version bumped 0.2.0 → 0.3.0 (additive minor bump per the versioning table in README.md). Standard files moved from `v0.2.0/` to `v0.3.0/` following the move-forward pattern established at 0.2.0; `v0.2.0` remains citable via the tagged release and git history.
- Strengthened theoretical grounding in §1.5 with two new source bullets: Blikstein (2013) names the three foundational pillars of making as a learning practice (Constructionism/Papert, experiential education/Dewey, critical pedagogy/Freire) and grounds the keychain syndrome as the empirical basis for the Practice-over-outcome and Failure-positive design principles; Blikstein & Worsley (2016) maps four maker-culture failure modes to specific OMBS design choices and adds Wilensky's reframing of the concrete/abstract dichotomy as the basis for the medium-agnostic principle.
- §1.2 Design principles: *Practice over outcome* now cites the keychain syndrome from makerspace research; *Failure-positive* now incorporates Papert's "hard fun" to distinguish productive difficulty from mere frustration.
- §11 Bibliography: added Blikstein (2013), Blikstein & Worsley (2016), Papert (2002), and Wilensky (1991).
- §1.5 Theoretical grounding: added assessment-validity theory (Mislevy, Steinberg, & Almond 2003; Messick 1995) as the grounding for the evidence layer, and human–automation research (Parasuraman & Riley 1997) as the grounding for the automated-derivation observer type.
- §10 Glossary: added *admissibility rule*, *attester*, *automated derivation*, *evidence form*, *observer type*, *sub-dimension*, *warrant*, *witness*.
- §11 Bibliography: added Messick (1995), Mislevy/Steinberg/Almond (2003), Parasuraman & Riley (1997), Pea (2004), Perkins (2023), Perkins/Furze/Roe/MacVaugh (2024), Salomon/Perkins/Globerson (1991), Tai et al. (2018), Wood/Bruner/Ross (1976), Zimmerman (2002) — each with a DOI.
- Appendix A: tagging tools must now record observer type and evidence form on every tag (`OMBS.EV.DISC`) and must not report a claim above its warrant (`OMBS.EV.WARR`); family-facing reports must say in plain language which warrant a claim carries.

### Fixed

- **16 evidence descriptors in `standards.json` did not match the normative prose in `STANDARD.md` §8** and had silently diverged since v0.1.0. In every case the JSON carried an abbreviated form with the parenthetical examples or a trailing qualifying clause dropped — e.g. `OMBS.B.DR.35.1` read "under at least one non-trivial condition" in JSON versus "(rougher use, longer time, harsher environment)" in prose; `OMBS.S.TS.912.1` lost "including when the result reflects unfavorably on the learner's prior choices". An adopter implementing from the machine-readable file was therefore working from a weaker descriptor than one implementing from the prose — the interoperability failure this release exists to close, already live. The JSON has been corrected to the prose, which is normative; no descriptor was authored or altered. Affected: `OMBS.S.TS.912.1`, `OMBS.S.SH.912.1`, `OMBS.M.AU.912.1`, `OMBS.M.PU.K2.1`, `OMBS.M.PU.35.1`, `OMBS.M.PU.912.1`, `OMBS.M.EX.K2.1`, `OMBS.M.EX.35.1`, `OMBS.M.EX.912.1`, `OMBS.M.CR.35.1`, `OMBS.B.MT.35.1`, `OMBS.B.MT.912.1`, `OMBS.B.DR.35.1`, `OMBS.B.DR.68.1`, `OMBS.B.DR.912.1`, `OMBS.B.FN.68.1`. `check-parity.mjs` now compares descriptor text, not only code presence, so this class of drift cannot recur.

### Known limitations

- The evidence-form and observer-type assignments on the 57 components carried forward from v0.2.0 are the drafting team's reading of each descriptor. They have not been validated against practitioner tagging, and disagreement on any specific assignment is exactly the kind of comment the review window is for.
- `OMBS.S.AI.TJ` (Trajectory) is the least-evidenced addition: the constructs it rests on (transfer after scaffolding withdrawal) are well established, but no study cited here measures trajectory of AI delegation in K–12 makers specifically. It is proposed as an observable, not as a validated one.
- The published-site copies under `docs/` still serve v0.1.0. `check-parity.mjs` reports this as a note; syncing the site is out of scope for this change and tracked separately.

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
