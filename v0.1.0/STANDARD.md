# Open Making and Building Standard (OMBS)

**Version:** 0.1.0 (Draft)
**Date:** 2026-04-30
**License:** CC BY-SA 4.0
**Status:** Draft for community review

---

## Table of Contents

1. [About this Standard](#1-about-this-standard)
2. [Conceptual Framework](#2-conceptual-framework)
3. [Code Format](#3-code-format)
4. [Shared Practices (S)](#4-shared-practices-s)
5. [Making Domain (M)](#5-making-domain-m)
6. [Building Domain (B)](#6-building-domain-b)
7. [Grade-Band Progressions](#7-grade-band-progressions)
8. [Evidence Descriptors](#8-evidence-descriptors)
9. [Crosswalks](#9-crosswalks)
10. [Glossary](#10-glossary)
11. [Bibliography](#11-bibliography)
12. [Appendix A — Use in AI-Powered Tools](#appendix-a--use-in-ai-powered-tools)

---

## 1. About this Standard

### 1.1 Purpose

The Open Making and Building Standard (OMBS) describes the practices learners use when they originate artifacts (making) and construct structures and systems (building). It exists to give educators, curriculum designers, assessment authors, ed-tech tools, and researchers a shared vocabulary for these practices — independent of subject area, medium, or pedagogy.

OMBS is **not** a content standard. It does not specify what learners should know about ecosystems, fractions, or the American Revolution. It specifies what good making and building look like, so that any subject's projects can be assessed for the practices they exercise.

### 1.2 Design principles

The standard is governed by five design principles, in order of precedence:

1. **Practice over outcome.** OMBS describes what learners *do*, not what they produce. A polished artifact made through copying does not satisfy the standard; a rough artifact made through genuine practice does.
2. **Medium-agnostic.** The same code applies whether the artifact is a poem, a circuit, a community event, a research argument, or a Minecraft world. Examples in evidence descriptors span multiple mediums deliberately.
3. **Process-visible.** Evidence descriptors reward learners who make their thinking observable: drafts kept, choices defended, revisions documented. A standard that can only be assessed from the final artifact is a standard that rewards luck and home support.
4. **Audience-real.** Both making and building presuppose someone the work is for. Standards that treat the teacher as the only audience produce learners who optimize for compliance. OMBS expects learners to identify and respond to a real audience appropriate to their grade band.
5. **Failure-positive.** Iteration on evidence is a primary practice (S.IT). A learner who tested, failed, and revised demonstrates more of the standard than a learner whose first attempt happened to work.

### 1.3 Scope

**In scope:**
- Cross-cutting practices of making and building, K–12.
- Grade-band progressions across K–2, 3–5, 6–8, 9–12.
- Performance evidence descriptors that classroom observers can use.
- Machine-readable codes for ingestion by curriculum, assessment, and AI tools.

**Out of scope:**
- Subject-specific content knowledge — covered by CCSS, NGSS, state academic standards, and equivalents.
- Social-emotional learning — covered by CASEL.
- Digital citizenship and information literacy — covered by ISTE Standards for Students (2024 refresh) and AASL.
- Career-specific technical skills — covered by industry frameworks.
- Early childhood pre-K practice — a future v0.2 may add a Pre-K band.

### 1.4 Audiences and uses

| Audience | Primary use |
|---|---|
| Classroom educators | Plan project-based units; observe and document practice; report to families. |
| Curriculum designers | Tag units with OMBS codes; ensure curricula address all dimensions over a year. |
| Assessment authors | Write rubrics anchored in evidence descriptors; design portfolios and performance tasks. |
| Ed-tech and AI tools | Tag content, evidence, and recommendations with codes; cite codes in user-facing reports. |
| Researchers | Cite the standard as an analytic frame for studies of making and building practice. |
| Parents and learners | Read the practice descriptors to understand what skilled making and building look like across years. |

### 1.5 Theoretical grounding

OMBS synthesizes prior work rather than inventing from scratch. Principal sources:

- **Maker-Centered Learning** (Project Zero / Agency by Design): the *Look Closely / Explore Complexity / Find Opportunity* triad informs the Making Domain's emphasis on attention and possibility.
- **NGSS Engineering Design** (K-2-ETS1, 3-5-ETS1, MS-ETS1, HS-ETS1): the structure of *defining, developing solutions, optimizing* informs the Building Domain and the Shared Practices spine.
- **ISTE Standards for Students (2024 refresh)**, particularly *Innovative Designer* and *Creative Communicator*: informs grade-band progression structure and the audience dimension.
- **CCSS ELA Writing Standards** (W.x.4, W.x.5, W.x.6): informs evidence descriptors for drafting, revising, and audience awareness.
- **P21 / Battelle for Kids 4Cs** (Creativity, Critical Thinking, Communication, Collaboration): informs the cross-cutting framing.
- **Resnick, *Lifelong Kindergarten*** (MIT, 2017): the Projects–Passion–Peers–Play frame informs the role of audience and iteration.
- **Dweck, mindset research**: informs the failure-positive design principle.
- **Maker-mindset literature** (Dougherty, *Free to Make*, 2016; Regalla, "Developing a Maker Mindset," 2016): informs the dispositional framing — that sustained engagement in making cultivates curiosity, playfulness, collaboration, resilience under frustration, and identity-as-maker. OMBS treats these as dispositions developed *through* the practices it assesses, not as separate constructs to score.

This standard is not derivative of any single source and may be used independently of all of them. Crosswalks (§9) make alignment explicit where it exists.

### 1.6 What this standard does *not* do

OMBS is not a curriculum, not a rubric, and not an assessment. It is a vocabulary. Educators and tool builders are expected to translate it into local rubrics, learning experiences, and measurement instruments suited to their context. The standard provides evidence descriptors that constrain those translations without prescribing them.

OMBS does not assign hours, units, or credits. It does not specify which practices must be taught in which grades — only what they look like *if* taught. This deliberately leaves room for varied implementation models (project-based, inquiry, traditional with embedded projects, etc.).

---

## 2. Conceptual Framework

### 2.1 Making and Building defined

**Making** is the practice of bringing into existence an artifact that did not previously exist in that form, intended for an audience, and shaped by a purpose. The defining concerns of making are *audience*, *purpose*, *expression*, and *response to critique*. Mediums include but are not limited to writing, performance, visual art, music, code, food, social experiences, and physical objects whose value lies primarily in expression rather than function.

**Building** is the practice of constructing a structure or system from components such that it functions reliably under specified conditions. The defining concerns of building are *materials*, *structure*, *durability*, and *fit-for-use*. Mediums include but are not limited to physical structures, mechanical and electronic systems, software systems, organizations and institutions, mathematical proofs, and arguments.

The two domains overlap. A short film is made (it expresses for an audience) and built (it has structure and must function as a viewing experience). A bridge is built (it must hold loads) and made (it expresses civic intent). OMBS does not require artifacts to be classified as one or the other; it requires evidence of the relevant practices, which may be drawn from either or both domains.

### 2.2 Three components of the standard

OMBS has three structural components:

1. **Five Shared Practices (S)** — a spine of practices common to both domains. Every project worth assessing exercises at least three of these. (§4)
2. **Making Domain (M)** — four dimensions specific to making. (§5)
3. **Building Domain (B)** — four dimensions specific to building. (§6)

This gives 13 codes (5 + 4 + 4). Each code has a four-band progression (K–2, 3–5, 6–8, 9–12) with one or more evidence descriptors per cell, yielding 52+ leaf-level standard statements.

### 2.3 Why two domains share a spine

Earlier drafts tried a single domain with eight dimensions. Field review surfaced a recurring problem: educators teaching primarily *making*-heavy projects (writing, theater, art) found the *building*-heavy dimensions (durability, structure) awkward to apply, and vice versa. Forcing a single rubric onto both kinds of work produced poor evidence in either direction.

Splitting into two domains with a shared practice spine solved this without losing coherence: the spine is what *every* making-or-building project shares (define, draft, test, iterate, share), and each domain adds the dimensions where it has real evidentiary purchase. Projects can claim alignment to S only, S+M, S+B, or all three.

### 2.4 What OMBS is not

OMBS is not a model of *creativity*. Creativity is broader and includes work (analysis, interpretation, performance) that does not produce a discrete artifact. OMBS is not a model of *engineering* — engineering practice is a subset of building practice with additional disciplinary norms (codes, ethics, professional review). OMBS is not a model of *art* — artistic practice is a superset of making practice with traditions and disciplinary discourses OMBS does not attempt to capture.

OMBS is the cross-domain skeleton these richer practices share.

---

## 3. Code Format

OMBS codes follow this format:

```
OMBS.<domain>.<dimension>.<grade-band>.<component>
```

Where:

- **`OMBS`** — fixed prefix identifying the standard.
- **`<domain>`** — `S` (Shared), `M` (Making), or `B` (Building).
- **`<dimension>`** — two-letter dimension code (e.g., `AU` for Audience).
- **`<grade-band>`** — `K2`, `35`, `68`, or `912`.
- **`<component>`** — numeric ordinal within the cell, starting at 1.

Examples:

- `OMBS.S.DF.35.1` — Shared Practices, Define, grades 3–5, component 1.
- `OMBS.M.AU.68.2` — Making Domain, Audience, grades 6–8, component 2.
- `OMBS.B.ST.912.1` — Building Domain, Structure, grades 9–12, component 1.

**Anchor codes** (cross-grade) drop the grade-band:

- `OMBS.S.DF` — the anchor "Define" practice across all grades.
- `OMBS.M.AU` — the anchor "Audience" dimension.

Anchor codes are used when describing a competency without committing to a grade band; they are required to have at least one progression cell per band.

### 3.1 Stability guarantees

- Codes, once published in a stable minor version (≥ v1.0), are **never reused**. If a code is deprecated, it is permanently retired; replacements receive new component numbers.
- Code IDs are stable across patch versions. Minor versions may add codes but not rename or remove. Major versions may rename or remove codes with a one-version deprecation alias.
- Pre-1.0 versions (including this v0.1.0 draft) **may break code IDs**. Implementers should treat v0.x as unstable.

---

## 4. Shared Practices (S)

The five Shared Practices form the spine that runs through both domains. A project that exercises none of these does not satisfy OMBS.

### 4.1 S.DF — Define

**Anchor:** The learner identifies what they intend to make or build, for whom, and against what success criteria, before significant work begins. They revise the definition as understanding deepens.

The Define practice is the antidote to busy work: it forces the learner to articulate intent in terms specific enough to be tested. "I want to make something cool" does not satisfy S.DF; "I want to make a poster that tells fifth-graders three reasons recycling matters, in under 10 seconds of looking" does.

### 4.2 S.DR — Draft

**Anchor:** The learner produces preliminary, low-stakes versions of the artifact — sketches, prototypes, outlines, mock-ups — that make assumptions visible before commitment to final form.

Drafting is what makes iteration possible. A learner who jumps to final form forecloses revision. The standard expects drafts to be *kept*, not erased — they are evidence of practice.

### 4.3 S.TS — Test

**Anchor:** The learner exposes the work to evidence — feedback from a real audience, performance against criteria, behavior under intended use — and treats the result as information, not judgment.

Testing means handing the work to someone or something whose response is genuinely uncertain. A learner who only "tests" by checking with a friend who agrees is not exercising S.TS; a learner who walks the prototype past the intended user and watches what happens is.

### 4.4 S.IT — Iterate

**Anchor:** The learner uses test results to revise, defending which feedback is acted on and which is set aside, with reasons.

Iteration is not "make it again." It is *informed change*. The standard expects learners to articulate which evidence drove which revision. "I changed it because Mrs. Park said to" does not satisfy S.IT; "I cut the second example because three of five testers stopped reading there" does.

### 4.5 S.SH — Share

**Anchor:** The learner makes the artifact and the process behind it accessible to an audience beyond the assessor, in a form appropriate to that audience.

Sharing is what makes the work real. A standard that lets learners hand work only to the teacher reproduces the dynamic of school as a closed economy. Audiences may be other classes, families, online communities, clients of a community partner, or future learners — but must be specified and reached.

---

## 5. Making Domain (M)

### 5.1 M.AU — Audience awareness

**Anchor:** The learner identifies a specific audience for the artifact, characterizes that audience by relevant traits (age, prior knowledge, context of encounter), and adapts the work to fit.

"Everyone" is not an audience. The standard expects learners to name an audience precisely enough that a stranger could distinguish it from an adjacent audience. Adaptation must be visible in the artifact itself — vocabulary, examples, format, length — not only described in a reflection.

### 5.2 M.PU — Purpose and intent

**Anchor:** The learner names the change they want the artifact to produce in the audience — to inform, persuade, move, entertain, instruct, provoke — and structures the artifact around that intent.

Purpose constrains form. A piece intended to instruct should look different from a piece intended to provoke. The standard rewards learners who can defend formal choices by reference to purpose ("I started with a story because I wanted them to feel it before they understood it") rather than convention ("That's how essays go").

### 5.3 M.EX — Expression and medium

**Anchor:** The learner uses the medium's specific affordances — what it can do that other mediums cannot — rather than treating the medium as a neutral container.

Audio is not text read aloud. Video is not slides with motion. The standard expects learners to make medium-specific choices and to defend them as choices. A grade-9 learner producing a podcast is expected to use silence, music, and pacing in ways a transcript cannot capture.

### 5.4 M.CR — Critique and response

**Anchor:** The learner solicits, receives, and acts on critique without collapsing into compliance or defensiveness, and gives critique to peers in terms that serve the work.

Critique is the social engine of making. The standard distinguishes three failure modes: *compliance* (changing whatever the critic said, regardless of merit), *defense* (changing nothing, citing the critic's misunderstanding), and *negotiation* (the desired practice — engaging the critique, identifying what it surfaces, choosing what to act on with reasons).

---

## 6. Building Domain (B)

### 6.1 B.MT — Materials and medium reasoning

**Anchor:** The learner selects materials or components based on the demands of the build, names tradeoffs (cost, weight, durability, availability, complexity), and revises material choices in response to test results.

A learner who uses cardboard "because it was there" is not exercising B.MT. A learner who chose cardboard, listed two alternatives, and named why cardboard was acceptable for the load and lifetime expected is.

### 6.2 B.ST — Structure and systems thinking

**Anchor:** The learner organizes components into a structure with named relationships, identifies points of stress or coupling, and uses that structure to predict behavior before testing.

Structure thinking is what separates building from assembly. The standard expects learners to articulate which parts depend on which, where the system is fragile, and what happens if a chosen part fails. This applies to physical builds (joints, load paths), software (module boundaries, data flow), and social builds (roles, decision points).

### 6.3 B.DR — Durability and robustness

**Anchor:** The learner anticipates conditions of use — including misuse, edge cases, and time — and designs for them, then tests against those conditions.

A bridge tested only by walking gently across it is not tested. The standard expects learners to imagine the worst plausible use and try it. For software: invalid input, empty cases, slow networks. For physical builds: stress beyond expected loads, weather, accidental drops. For social builds: a participant in a bad mood, a missing leader, a doubled audience.

### 6.4 B.FN — Function and fit-for-use

**Anchor:** The learner evaluates the build against its stated function in the hands of intended users, accepts the gap between intent and result as data, and decides whether the gap warrants revision.

Fit-for-use is the building-domain analogue of audience-fit in the making domain. The standard expects learners to put the build in the hands of the user it was designed for and observe — not ask. A learner who insists the build "works" while the user struggles to operate it has not exercised B.FN.

---

## 7. Grade-Band Progressions

Progressions describe how the same anchor competency looks at different grade bands. The progressions are *developmental sketches*, not gates; learners may exceed or lag the band-typical descriptors and still be making progress.

### 7.1 Reading the progression tables

Each table cell names what evidence looks like in that band. Cells include 1–3 evidence descriptors with concrete observable behaviors. For full evidence descriptor language, see §8.

### 7.2 Shared Practices (S) progression summary

| Code | K–2 | 3–5 | 6–8 | 9–12 |
|---|---|---|---|---|
| **S.DF Define** | Names what the artifact is and one person it's for, with prompting. | Writes a one-sentence intent that names artifact, audience, and one success criterion. | Drafts intent independently with two or more success criteria; revises intent at least once. | Frames intent in tension with constraints; defends scope choices against feasible alternatives. |
| **S.DR Draft** | Produces a sketch or rough version before final, when prompted. | Produces ≥2 distinct drafts; can point to what changed. | Produces drafts at multiple grain sizes (rough → refined); annotates choice points. | Drafts with explicit fork points (alternatives carried forward to test, not just the favored one). |
| **S.TS Test** | Shows work to a person and notices a reaction. | Tests against the success criterion from S.DF; records what happened. | Tests against ≥2 criteria with a real audience or use scenario; distinguishes signal from noise. | Designs tests that could falsify the work; reports negative results faithfully. |
| **S.IT Iterate** | Tries again after feedback, with help. | Names one change made and what feedback drove it. | Defends which feedback was acted on and which was set aside, with reasons. | Iterates across structural alternatives (not just polish); documents what was abandoned and why. |
| **S.SH Share** | Presents to the class or family with support. | Adapts the artifact for an audience beyond the teacher. | Reaches an audience the learner identified; documents the audience's response. | Publishes to a sustained public audience with attention to access, rights, and follow-on use. |

### 7.3 Making Domain (M) progression summary

| Code | K–2 | 3–5 | 6–8 | 9–12 |
|---|---|---|---|---|
| **M.AU Audience** | Names a specific person or small group as the audience. | Names audience traits (age or interest) that shape choices. | Distinguishes intended audience from adjacent audiences; can describe what each would prefer. | Designs for a defined audience while accounting for foreseeable secondary audiences. |
| **M.PU Purpose** | Names what the artifact is for in one phrase ("to make them laugh"). | Names purpose and one form choice that serves it. | Defends multiple form choices by reference to purpose. | Holds purpose stable while exploring multiple possible forms; selects with explicit tradeoff analysis. |
| **M.EX Expression** | Tries a medium and notices what it can do. | Uses one medium-specific affordance intentionally (color, sound, motion). | Uses medium-specific affordances in service of purpose, not for novelty. | Combines affordances across mediums or sub-mediums; defends combinations. |
| **M.CR Critique** | Receives feedback without distress; tries one suggestion. | Asks for feedback on a specific question; acts on at least one piece. | Distinguishes compliance, defense, and negotiation in own response to critique. | Gives critique that names what is working and what is not, in terms the maker can act on. |

### 7.4 Building Domain (B) progression summary

| Code | K–2 | 3–5 | 6–8 | 9–12 |
|---|---|---|---|---|
| **B.MT Materials** | Picks from offered materials and explains a choice. | Compares two materials on one trait (strength, color, cost). | Selects materials by 2+ tradeoffs; revises after test. | Documents material choices with quantitative or comparative evidence; considers lifecycle. |
| **B.ST Structure** | Names two parts and how they connect. | Diagrams the build with parts and connections labeled. | Identifies a stress point or fragile coupling and addresses it. | Predicts system behavior from structure before test; explains observed deviation post-test. |
| **B.DR Durability** | Tries the build more than once and notices when it breaks. | Tests under one non-trivial condition (rougher use, longer time). | Tests against a misuse case the learner imagined. | Designs and reports failure tests; specifies operating envelope. |
| **B.FN Function** | Gives the build to a user and watches what happens. | Records whether the user could use the build as intended; names one gap. | Iterates on observed-not-asked use evidence; distinguishes user error from design error. | Defines fit-for-use criteria pre-test; reports against them; recommends next-revision changes. |

---

## 8. Evidence Descriptors

This section provides the canonical evidence descriptors for each progression cell. Tools and rubrics that claim alignment with OMBS must use language compatible with these descriptors.

Format: `<CODE> — <descriptor>`

> **Note on observability.** Each descriptor is written so that an observer (teacher, peer, AI tagger) can determine satisfaction from observable artifacts and behaviors, not from the learner's reported intent alone. "The learner intended X" is not evidence; "the artifact shows X" or "the learner did X observable action" is.

### 8.1 Shared Practices

#### S.DF — Define

- `OMBS.S.DF.K2.1` — With prompting, the learner states what they will make or build and names at least one person who will see or use it.
- `OMBS.S.DF.35.1` — The learner records, before substantial work begins, a written or spoken statement naming (a) the artifact, (b) the intended audience or user, and (c) at least one criterion for success.
- `OMBS.S.DF.68.1` — The learner produces a written intent statement with two or more success criteria, and revises that statement at least once during the project, with the revision dated or otherwise traceable.
- `OMBS.S.DF.912.1` — The learner frames the intent in tension with stated constraints (time, budget, materials, audience access) and defends scope choices in writing or in conversation against at least one feasible alternative scope considered and rejected.

#### S.DR — Draft

- `OMBS.S.DR.K2.1` — The learner produces a sketch, model, or rough version before producing the final artifact, when prompted.
- `OMBS.S.DR.35.1` — The learner produces at least two distinct drafts and can point to specific differences between them.
- `OMBS.S.DR.68.1` — The learner produces drafts at multiple grain sizes (e.g., outline before paragraph, rough cardboard before final material) and annotates points where decisions were made.
- `OMBS.S.DR.912.1` — The learner produces drafts that include explicit alternatives carried forward into testing, not only the path eventually chosen, and documents which alternatives were eliminated and on what evidence.

#### S.TS — Test

- `OMBS.S.TS.K2.1` — The learner shows the work to at least one person other than the teacher and reports what that person did or said.
- `OMBS.S.TS.35.1` — The learner tests the artifact against the success criterion stated in S.DF and records what happened in writing, sketch, or recording.
- `OMBS.S.TS.68.1` — The learner designs tests that exercise at least two of the success criteria, conducts them with a real audience or in a realistic use scenario, and distinguishes findings driven by the test from confounds.
- `OMBS.S.TS.912.1` — The learner designs at least one test capable of falsifying a key assumption of the work, conducts it, and reports negative results faithfully — including when the result reflects unfavorably on the learner's prior choices.

#### S.IT — Iterate

- `OMBS.S.IT.K2.1` — After receiving feedback, the learner tries the work again with at least one observable change.
- `OMBS.S.IT.35.1` — The learner names one change made between drafts and the feedback or test result that drove it.
- `OMBS.S.IT.68.1` — The learner explains, in writing or conversation, which feedback was acted on, which was set aside, and the reason for each decision.
- `OMBS.S.IT.912.1` — The learner iterates across structurally distinct alternatives (not only polish or refinement of one direction) and documents abandoned directions with the evidence that led to abandonment.

#### S.SH — Share

- `OMBS.S.SH.K2.1` — The learner presents the artifact to an audience beyond the teacher (classmates, family, school community), with adult support as needed.
- `OMBS.S.SH.35.1` — The learner adapts the artifact or its presentation for an audience beyond the teacher and explains one adaptation made.
- `OMBS.S.SH.68.1` — The learner reaches an audience they identified in S.DF and documents the audience's response in a form appropriate to the audience.
- `OMBS.S.SH.912.1` — The learner publishes the artifact to a sustained public or community audience with attention to access (who can find it, who can use it), rights (attribution, licensing), and provision for follow-on use or remixing.

### 8.2 Making Domain

#### M.AU — Audience awareness

- `OMBS.M.AU.K2.1` — The learner names a specific person, group, or class as the intended audience for the artifact.
- `OMBS.M.AU.35.1` — The learner names at least one audience trait (age, prior knowledge, interest) and points to a choice in the artifact shaped by that trait.
- `OMBS.M.AU.68.1` — The learner distinguishes the intended audience from at least one adjacent audience and articulates what each would prefer differently.
- `OMBS.M.AU.68.2` — The learner adapts vocabulary, examples, format, or length in ways visible in the artifact (not only described in reflection) to fit the named audience.
- `OMBS.M.AU.912.1` — The learner designs for a defined primary audience while accounting for foreseeable secondary audiences (e.g., archival readers, parents, future learners), and notes choices that serve or fail to serve secondaries.

#### M.PU — Purpose and intent

- `OMBS.M.PU.K2.1` — The learner names in one phrase what the artifact is for ("to teach," "to make them laugh," "to help them remember").
- `OMBS.M.PU.35.1` — The learner names purpose and points to at least one form choice (opening, sequence, ending) shaped by that purpose.
- `OMBS.M.PU.68.1` — The learner defends two or more form choices by reference to purpose and can describe how a different purpose would have produced different choices.
- `OMBS.M.PU.912.1` — The learner holds purpose stable while exploring multiple possible forms, selects among them with explicit tradeoff analysis, and can articulate why the chosen form serves the purpose better than alternatives considered.

#### M.EX — Expression and medium

- `OMBS.M.EX.K2.1` — The learner tries a medium and notices, with prompting, something the medium can do (e.g., "music can make it sad").
- `OMBS.M.EX.35.1` — The learner uses at least one medium-specific affordance (color, sound, motion, layout, pacing) intentionally and can name why.
- `OMBS.M.EX.68.1` — The learner uses medium-specific affordances in service of stated purpose and audience, not for novelty alone.
- `OMBS.M.EX.912.1` — The learner combines affordances across mediums or sub-mediums (e.g., type and image, sound and silence, code and prose) and defends the combination as serving purpose better than either alone.

#### M.CR — Critique and response

- `OMBS.M.CR.K2.1` — The learner receives feedback without distress and tries at least one suggestion.
- `OMBS.M.CR.35.1` — The learner asks for feedback on a specific aspect of the work (a specific question, not "what do you think") and acts on at least one piece received.
- `OMBS.M.CR.68.1` — The learner distinguishes compliance, defense, and negotiation in their own responses to critique and can name a recent instance of each.
- `OMBS.M.CR.912.1` — The learner gives critique to peers that names what is working and what is not, in terms the maker can act on, distinct from praise or correction.

### 8.3 Building Domain

#### B.MT — Materials and medium reasoning

- `OMBS.B.MT.K2.1` — The learner picks from offered materials and explains, when asked, why the choice was made.
- `OMBS.B.MT.35.1` — The learner compares at least two materials on one trait (strength, color, cost, weight, availability) before selecting.
- `OMBS.B.MT.68.1` — The learner selects materials by at least two tradeoffs and revises material choice in response to test results.
- `OMBS.B.MT.912.1` — The learner documents material choices with quantitative or comparative evidence and considers lifecycle factors (sourcing, durability, end-of-life) appropriate to the project.

#### B.ST — Structure and systems thinking

- `OMBS.B.ST.K2.1` — The learner names at least two parts of the build and how they connect.
- `OMBS.B.ST.35.1` — The learner produces a diagram of the build with parts and connections labeled.
- `OMBS.B.ST.68.1` — The learner identifies at least one stress point, fragile coupling, or single point of failure in the structure and addresses it in the design.
- `OMBS.B.ST.912.1` — The learner predicts system behavior from structure before test and explains any observed deviation in terms of the structure post-test.

#### B.DR — Durability and robustness

- `OMBS.B.DR.K2.1` — The learner uses the build more than once and notices when something breaks or fails.
- `OMBS.B.DR.35.1` — The learner tests the build under at least one non-trivial condition (rougher use, longer time, harsher environment).
- `OMBS.B.DR.68.1` — The learner tests against at least one misuse case the learner imagined (not only the intended use) and reports the result.
- `OMBS.B.DR.912.1` — The learner designs and reports failure tests, specifies the operating envelope within which the build is intended to function, and notes the boundary conditions.

#### B.FN — Function and fit-for-use

- `OMBS.B.FN.K2.1` — The learner gives the build to a user and watches what happens.
- `OMBS.B.FN.35.1` — The learner records whether the user could use the build as intended and names at least one gap between intent and use.
- `OMBS.B.FN.68.1` — The learner iterates on observed-not-asked evidence (what the user *did*, not what the user *said*) and distinguishes user error from design error.
- `OMBS.B.FN.912.1` — The learner defines fit-for-use criteria before testing, reports against them after, and recommends specific next-revision changes with reasons.

---

## 9. Crosswalks

Crosswalks map OMBS codes to selected external frameworks. They are advisory: alignment is rarely 1:1, and crosswalks indicate "OMBS code substantially overlaps with target code," not "is identical to." The full machine-readable mapping is in [crosswalks.json](crosswalks.json).

### 9.1 NGSS Engineering Design (selected)

| OMBS | NGSS | Note |
|---|---|---|
| S.DF | K-2-ETS1-1, 3-5-ETS1-1, MS-ETS1-1, HS-ETS1-1 | Defining problems and criteria |
| S.DR + S.IT | 3-5-ETS1-2, MS-ETS1-3 | Generating and comparing solutions |
| S.TS + B.DR | 3-5-ETS1-3, MS-ETS1-4, HS-ETS1-3 | Optimizing through testing |
| B.ST | MS-ETS1-2, HS-ETS1-2 | Systems thinking and decomposition |
| B.MT | (no direct match — crosscutting concept "Structure and Function") | NGSS treats material choice as embedded in disciplinary cores |

### 9.2 ISTE Standards for Students (2024 refresh)

| OMBS | ISTE | Note |
|---|---|---|
| M.AU + M.PU | 1.6 Creative Communicator (a, b) | Choosing tools and platforms for purpose and audience |
| M.EX | 1.6 Creative Communicator (c, d) | Original or remixed creations |
| S.DF + S.DR + S.TS + S.IT | 1.4 Innovative Designer (a, b, c, d) | Design process |
| B.ST + B.DR | 1.5 Computational Thinker (a, b, c) | Decomposition and iteration in computational artifacts |
| S.SH | 1.7 Global Collaborator (b, c) | Sharing and communicating with audiences |

### 9.3 P21 / Battelle for Kids 4Cs

| OMBS | P21 | Note |
|---|---|---|
| M.PU + M.EX + S.DR | Creativity and Innovation | Generating and developing original work |
| S.DF + S.TS + B.ST | Critical Thinking | Reasoning, system analysis, evaluation |
| M.AU + S.SH | Communication | Articulating to varied audiences |
| M.CR + S.IT | Collaboration | Working productively with others on shared work |

### 9.4 Agency by Design — Maker-Centered Learning

| OMBS | Agency by Design | Note |
|---|---|---|
| B.ST | Look Closely | Slow, careful observation of parts and relationships |
| B.MT + B.DR | Explore Complexity | Investigating systems, materials, dependencies |
| M.AU + M.PU + S.DF | Find Opportunity | Identifying spaces for design intervention |

### 9.5 CCSS ELA Writing (selected)

| OMBS | CCSS ELA | Note |
|---|---|---|
| M.AU + M.PU | W.x.4 — Producing writing appropriate to task, purpose, audience | Direct overlap |
| S.DR + S.IT | W.x.5 — Planning, revising, editing | Direct overlap |
| S.SH | W.x.6 — Use of technology to produce and publish | Substantial overlap (OMBS broader) |

---

## 10. Glossary

**Affordance.** A feature of a medium that the medium can do in ways other mediums cannot or do less well. Sound has the affordance of pacing through silence; text has the affordance of reread-ability.

**Anchor competency.** A code without a grade-band suffix (e.g., `OMBS.M.AU`), describing the durable competency across all bands.

**Artifact.** The thing the learner makes or builds. May be physical, digital, performative, written, social, or hybrid.

**Audience.** The person or people the artifact is for. Must be specific enough to distinguish from adjacent audiences. "Everyone" and "the teacher" do not satisfy an audience for OMBS purposes (except in K–2 where "the class" is acceptable).

**Building.** Practice of constructing structures or systems from components such that they function reliably under specified conditions. Defining concerns: materials, structure, durability, fit-for-use.

**Compliance (in critique).** Acting on critique without engagement, simply because the critic said so. A failure mode of M.CR.

**Construct validity.** The degree to which a measurement of a competency actually measures that competency. OMBS evidence descriptors are designed for construct validity but have not yet been empirically validated; that work is pending.

**Critique.** Targeted feedback on a work, focused on whether and how the work serves its purpose. Distinct from praise (which does not serve revision) and correction (which presupposes a single right answer).

**Defense (in critique).** Refusing to act on critique, citing the critic's misunderstanding. A failure mode of M.CR.

**Dimension.** A second-level category within a domain (e.g., `M.AU` — Audience — is a dimension of the Making Domain).

**Domain.** A first-level category within OMBS. There are three: Shared Practices (S), Making (M), Building (B).

**Draft.** A preliminary, low-stakes version of the artifact intended to make assumptions visible before commitment to final form. Drafts are kept, not erased.

**Evidence descriptor.** A specific observable behavior or artifact feature that satisfies a code. Codes are made operational through their evidence descriptors.

**Fit-for-use.** The degree to which the build serves its intended user in the intended context. Evaluated by observing use, not by asking the user.

**Grade band.** One of K–2, 3–5, 6–8, 9–12. Bands are developmental sketches, not gates.

**Iteration.** Informed change driven by evidence from testing. Distinct from polish (refining without new information) and re-doing (starting over without using the prior result).

**Making.** Practice of bringing into existence an artifact intended for an audience and shaped by a purpose. Defining concerns: audience, purpose, expression, response to critique.

**Medium.** The material or modality of the artifact (text, video, code, physical object, performance, social experience).

**Misuse case.** A scenario in which a build is used outside its intended use, deliberately or accidentally. Designing for misuse cases is part of B.DR.

**Negotiation (in critique).** Engaging critique, identifying what it surfaces about the work, and choosing what to act on with reasons. The desired practice in M.CR.

**Operating envelope.** The conditions under which a build is intended to function. Specifying the envelope is part of B.DR at the 9–12 band.

**Process-visible.** A property of evidence: the learner's choices and reasoning are observable, not only the final outcome. A core OMBS design principle.

**Purpose.** The change the learner wants the artifact to produce in the audience (inform, persuade, move, entertain, instruct, provoke).

**Shared Practice.** A practice common to both making and building (Define, Draft, Test, Iterate, Share).

**Structure.** The named relationships among the parts of a build. Distinct from a list of parts.

**Stress point.** A part of a structure where failure is more likely or more consequential. Identifying stress points is part of B.ST at the 6–8 band.

---

## 11. Bibliography

Selected works that informed this standard. This is not an exhaustive review.

- Achievement First. *Engineering Design at Scale: Implementation Notes from K–8 Programs.* (2024).
- Agency by Design / Project Zero. *Maker-Centered Learning: Empowering Young People to Shape Their Worlds.* Clapp, Ross, Ryan, Tishman. Jossey-Bass (2017).
- CASEL. *Core SEL Competencies Framework.* (2020).
- Common Core State Standards Initiative. *English Language Arts Standards — Writing.* (2010).
- Dougherty, Dale. *Free to Make: How the Maker Movement Is Changing Our Schools, Our Jobs, and Our Minds.* North Atlantic Books (2016).
- Dweck, Carol S. *Mindset: The New Psychology of Success.* Random House (2006).
- ISTE. *Standards for Students (2024 Refresh).* International Society for Technology in Education.
- National Research Council. *A Framework for K–12 Science Education: Practices, Crosscutting Concepts, and Core Ideas.* National Academies Press (2012).
- NGSS Lead States. *Next Generation Science Standards: For States, By States.* National Academies Press (2013).
- OECD. *Learning Compass 2030.* OECD Publishing (2019).
- Papert, Seymour. *Mindstorms: Children, Computers, and Powerful Ideas.* Basic Books (1980).
- Partnership for 21st Century Learning / Battelle for Kids. *Framework for 21st Century Learning Definitions.* (2019).
- Regalla, Lisa. "Developing a Maker Mindset." In K. Peppler, E. R. Halverson, & Y. B. Kafai (Eds.), *Makeology: Makerspaces as Learning Environments* (Vol. 1). Routledge (2016).
- Resnick, Mitchel. *Lifelong Kindergarten: Cultivating Creativity through Projects, Passion, Peers, and Play.* MIT Press (2017).
- UNESCO. *AI Competency Framework for Students.* (2024).

---

## Appendix A — Use in AI-Powered Tools

OMBS is designed to be ingested by AI-powered curriculum, assessment, and learner-support tools. This appendix is non-normative but recommended.

### A.1 Tagging evidence

Tools that tag evidence (student work, observation notes, project artifacts) with OMBS codes should:

1. Tag at the evidence-descriptor level (e.g., `OMBS.S.DR.35.1`), not only the dimension level (`OMBS.S.DR`).
2. Record a confidence value if the tag is generated automatically.
3. Record the source of the tag (human educator, learner, automated tagger, with model identifier and version if automated).
4. Preserve the artifact or excerpt that supports the tag, subject to applicable privacy and retention requirements.

### A.2 Recommendations and next steps

Tools that recommend next activities or next steps using OMBS codes should:

1. Cite the codes used in the recommendation in language the learner or family can read.
2. Distinguish "demonstrated at this band" from "demonstrated at an earlier band — ready to move up" from "no evidence yet."
3. Avoid recommending solely from absent codes — absence is often a function of unobserved opportunity, not lack of competence.

### A.3 Reporting to families

Tools that report progress to families using OMBS codes should:

1. Translate codes into plain language; do not show raw codes as the primary surface.
2. Frame progress as developmental, not as scored. OMBS bands are sketches, not gates.
3. Show *evidence* (the artifact or excerpt) alongside the claim that a code was demonstrated.

### A.4 Privacy and child data

When OMBS-tagged evidence includes student work, tools must comply with applicable child privacy law (in the U.S.: COPPA for under-13, FERPA for educational records; equivalents elsewhere). OMBS itself is metadata and not subject to these regimes, but evidence linked to OMBS codes typically is.

### A.5 Versioning in tools

Tools should record the OMBS version they were aligned to (e.g., `OMBS@0.1.0`). When OMBS bumps minor or major versions, tools should provide a visible upgrade path rather than silently migrating tagged evidence.

---

*End of OMBS v0.1.0*
