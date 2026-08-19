# OMBS Proposal 0001 — Building under uncertainty

**Status:** Proposed. Not adopted.
**Author:** Sunny Patneedi
**Filed:** 2026-08-19
**Targets:** OMBS v0.4.0
**Encoded draft:** [`v0.4.0-draft/`](../v0.4.0-draft/) — full prose + JSON + crosswalks, passing `scripts/check-parity.mjs`
**Governance class:** New dimensions / codes — steering review + 30-day public comment + 2/3 majority (GOVERNANCE.md)
**Conformance impact:** **Breaking at Core.** The Shared Practices spine goes from five to seven — broken once, in one version.

---

## 0. Read this part first

This proposal asks for **two** new Shared dimensions — `OMBS.S.DG` (Diagnose) and `OMBS.S.RV` (Revisit) — and
**two** new component families under existing dimensions. It also asks the project to notice something about
itself.

Two earlier shapes of this proposal were cut on review, and both cuts made it smaller and better sourced:

- **Two component families were removed** — a *minimal end-to-end version* under `S.DR` and a *reproducibility*
  record under `B.FN`, eight leaves in total. They were the two families for which no source could be found that
  genuinely supports the practice claim, and they shipped in an earlier revision carrying `TODO(cite)` with no
  citation at all. A fully-cited proposal was preferred to a larger one with declared gaps. The practices are
  real and may return with grounding; they are not in this proposal.
- **`S.RV` was added rather than deferred to 0.5.0**, so the Core spine is broken **once**. Two consecutive
  minors each moving the spine would make every adopter re-conform twice for one editorial decision.

GOVERNANCE.md puts a change of this class behind steering review, a 30-day public comment window, and a 2/3
majority. **There is no steering committee.** GOVERNANCE.md says OMBS is in bootstrap stewardship and intends
to seat one "within 12 months of v1.0 release." v1.0 has not shipped. So the body that would hold the vote does
not exist, and the author of this proposal is also the sole maintainer, the only person who could merge it, and
the founder of the only known adopter.

The last proposal of this class shows what that produces. Verified from the repository:

| | |
|---|---|
| Issue #6 | "RFC v0.3.0 — evidence/provenance layer + S.AI sub-dimensions (30-day comment window, closes 2026-08-26)" — opened 2026-07-27, **closed 2026-07-30** |
| PR #7 | "RFC v0.3.0 — evidence/provenance layer + S.AI sub-dimensions (**do not merge before 2026-08-26**)" — opened 2026-07-27, **merged 2026-07-28** |

The pull request named the date it must not be merged before and was merged 29 days before it. The comment
window it announced never closed. The author broke a rule the author had written into the title of the author's
own pull request, and there was no one whose job it was to notice.

That is the precedent this proposal is trying to correct, so it states the correction as a condition on itself:

1. **This branch is proposed and is not merged by the process that produced it.** The build loop that drafted
   `v0.4.0-draft/` stops at a reviewable branch. It does not push, open a PR, merge, or tag.
2. **The comment window is real or the change does not land.** If the window closes early again, the honest
   record is that OMBS v0.4.0 was adopted by its author without review — and the CHANGELOG should say so in
   those words rather than describing a process that did not happen.
3. **A single-maintainer project can still get review.** The cheapest form available now is two named outside
   readers with no interest in SayMake, on the record in the issue thread, before merge. That is weaker than a
   2/3 steering majority and it is not nothing. If even that cannot be arranged, the disclosure in point 2 is
   the fallback, not a substitute.

A standard whose own governance is decorative has a credibility problem that no amount of good descriptor text
fixes. Naming it costs less than being caught with it.

---

## 1. The gap

### 1.1 What v0.3.0 already covers

v0.3.0 describes a competent loop: the learner defines (`S.DF`), drafts (`S.DR`), tests (`S.TS`), iterates
(`S.IT`), and shares (`S.SH`), with `S.AI` holding the rest honest where a tool was involved. The Building
domain adds materials (`B.MT`), structure (`B.ST`), durability (`B.DR`), and function (`B.FN`). The evidence
layer (§8.1) says what may count as a trace and who is competent to record it.

That is a good account of a build that goes roughly to plan.

### 1.2 What it does not cover

**Nothing asks why the test failed.** `S.TS` produces evidence. `S.IT` acts on it. Between them sits a step
neither code touches: working out the cause. The gap is not theoretical — it is visible in the descriptor text.
`OMBS.S.IT.35.1` reads:

> The learner names one change made between drafts and the feedback or test result that drove it.

A learner who changed five things at once, got a working build, and can name one of the five satisfies that
descriptor completely. They have learned nothing about cause and cannot repeat the fix. The standard has no way
to tell them apart from a learner who isolated the cause first — and telling those two apart is most of what a
teacher wants to know.

**Nothing distinguishes complete-at-small-scope from incomplete-at-full-scope.** `S.DR` has one shape of draft
at every band: the rough partial. A version that is small but goes all the way through — every stage present,
none of them finished — finds a different class of problem: the stage nobody thought about, the join that does
not join, the ending there was no time to reach. Those are the cheapest problems to find early and the most
expensive to find late, and `S.DR` currently gives no code for the practice that finds them.

**Nothing asks whether testing was ordered.** `S.TS` asks whether the learner tested. It does not ask whether
they tested the thing whose failure would cost the most before building what depends on it. Two learners can
run identical tests and get very different value from them.

**Nothing asks whether a boundary was designed.** `B.ST.1` asks the learner to identify structure that exists.
Two parts that fit because their maker sanded them until they did is craft. Two parts that fit because the
meeting point was specified before either was built is design. Only the first is codeable today.

**Nothing asks whether the build can be rebuilt.** `B.FN` asks whether the thing works for its user. A costume
that cannot be mended, a dish that cannot be cooked twice, a display that cannot be rebuilt after it comes down
— each works once and then stops being available to anyone.

### 1.3 Why the naming matters, and where it must not come from

Software development named these practices precisely, and the naming transfers to sewing, woodwork, cooking,
and writing. The practice underneath transfers; the vocabulary does not. §1.6 says OMBS is a vocabulary and not
a curriculum, and a K–12 standard that asks a second-grade teacher to record a "tracer bullet" has imported the
jargon and lost the practice.

So: **no software term appears in any evidence descriptor (§8) or glossary entry (§10) of
`v0.4.0-draft/STANDARD.md`.** Not "spike", not "walking skeleton", not "tracer bullet", not "regression test",
not "minimum viable product" — and verified by scan across all 93 descriptors and every glossary entry, both
clean. That is where the commitment has to hold, because those are the strings a tool surfaces to a teacher or
a family. The descriptors are written in the words a cook or a stage manager would use, and where the practice
needed a name the glossary defines it in plain English — *minimal end-to-end version*, *smallest setting that
still shows it*, *baseline copy*, *rebuild record*, *boundary specification*, *risk-ordered testing*.

**An earlier revision of this proposal claimed the stronger thing — that no software term appears anywhere in
the file — and that was never true**, including when it was first written. Three kinds of occurrence exist, and
all three are deliberate:

1. **Inherited from v0.3.0, unchanged.** §2.1 lists "software systems" among the mediums a build may use, §6.2
   names "module boundaries, data flow" as the software instance of structure, §6.3 gives "invalid input, empty
   cases, slow networks" as software durability examples, and §8.1.1 offers "a commit message" and "version
   history" as evidence forms. Software appears there as *one medium among many*, alongside poems, circuits and
   community events. That is the medium-agnostic principle working, not jargon import — and removing it would
   make the standard worse by implying software is not a medium OMBS covers.
2. **New in 0.4.0, in epistemic-status prose.** §4.3 and §6.2 say that Boehm and Parnas are engineering papers
   about software and are not evidence about children. Naming the literature is how the citation gets bounded;
   an unnamed source would be a weaker disclosure, not a cleaner one.
3. **New in 0.4.0, in §11 bibliography titles.** Article titles are quoted as published. Altering them to avoid
   a word would be a fabrication.

What the "do not import" rule actually forbids is coining *user-facing vocabulary* from software — a teacher
being asked to record a "tracer bullet" or a "walking skeleton". Zero such terms were coined, and the eight-rung
artifact ladder that carried them is rejected in §7.4.

---

## 2. What is proposed

Two new Shared dimensions and two new component families, all four grade bands each. Sixteen new leaves;
73 → **89**. Sixteen dimensions (8 + 4 + 4). Additive only: no code is renamed, retired, or narrowed.

### 2.1 `OMBS.S.DG` — Diagnose

**Anchor.** Before changing the work, the learner locates what is causing the problem — reproducing it in the
smallest setting that still shows it, and changing one thing at a time so the result can be attributed to the
change.

Placed at §4.4, between Test and Iterate, because that is where the practice sits: `S.TS` produces the
evidence, `S.DG` locates the cause, `S.IT` acts on it.

| Code | Descriptor |
|---|---|
| `OMBS.S.DG.K2.1` | When something does not work, the learner tries it again after changing one thing, and says with prompting whether that change made a difference. |
| `OMBS.S.DG.35.1` | The learner narrows the problem to a smaller part of the work that still shows it — one paragraph, one section, one component, one step — tests that part on its own, and records which part the problem is in. |
| `OMBS.S.DG.68.1` | Before making a change, the learner states what they think is causing the problem; then changes one thing at a time while leaving the rest as it was, recording for each try what was changed and what happened, so the result can be attributed to that change rather than to several at once. |
| `OMBS.S.DG.912.1` | The learner keeps an unchanged copy of the work that still shows the problem, compares it against the changed copy to confirm that the change is what fixed it, and reports at least one cause they suspected first and ruled out, naming the evidence that ruled it out. |

Evidence forms and observer types are carried inline on every node in `standards.json`. Every descriptor here
makes a temporal claim (*before*, *then*, *first … later*), so each names at least one form that existed
**during** the work, per `OMBS.EV.SEQ`. None admits `OMBS.EF.LR` alone.

#### Why "Diagnose" and not "Isolate" or "Fault-finding"

- **Isolate** names one technique — narrowing — and not the goal. A learner can isolate a part and never ask
  what is causing anything. It also mis-describes the K–2 descriptor, where there is no narrowing yet, only
  one-change-at-a-time.
- **Fault-finding** is workshop-coded and fails medium-agnosticism (design principle 2). A poem does not have a
  fault; a scene that drags does not have a fault; both have a cause worth locating. The word would quietly
  push the dimension back toward physical and mechanical builds — exactly the drift §1.2 exists to prevent.
- **Diagnose** names the goal rather than the technique, is a word a five-year-old already knows from doctors,
  survives translation, and is neutral across mediums. `DG` collides with none of `DF`, `DR`, `TS`, `IT`, `SH`,
  `AI`, `AU`, `PU`, `EX`, `CR`, `MT`, `ST`, `FN`.

#### Epistemic status

Stated in `v0.4.0-draft/STANDARD.md` §4.4, following the pattern `S.AI.TJ` set in v0.3.0. Summary: the
constructs have empirical support, **these descriptors do not.** No cited study measures these observables, none
was conducted on making and building across mediums, and no study validates the band placements. `S.DG` is
offered as a proposed observable, and the band boundaries are the part most likely to move. This is the code
most in need of comment.

### 2.2 Four second components under existing dimensions

| Code | Practice | What distinguishes it from `.1` |
|---|---|---|
| `OMBS.S.TS.<band>.2` | Risk-ordered testing | `.1` asks whether the learner tested. `.2` asks whether they tested the assumption whose failure would cost the most **before** building what depends on it, with the ordering and its reason recorded beforehand. What is assessed is the ordering decision, not the outcome: an assumption tested first and found sound is full evidence. |
| `OMBS.B.ST.<band>.2` | The join as a designed object | `.1` **identifies** structure that already exists. `.2` **specifies a boundary in advance** — what each side must provide and what each may assume — so a part built to the specification fits. Two parts that fit because their maker adjusted them is `.1`; two parts that fit because the meeting point was written down first is `.2`. |

Full descriptor text for all eight is in `v0.4.0-draft/STANDARD.md` §8.2 and §8.4, mirrored in
`standards.json`.

### 2.3 `OMBS.S.RV` — Revisit

**Anchor.** After a piece of work has stopped — set aside, declared finished, or abandoned — the learner chooses
to return to it, does further work on it, and can say what made them stop and what brought them back.

Placed at §4.5, between Diagnose and Iterate. Every other Shared Practice lives inside one stretch of work;
Revisit is the only one that needs a gap.

| Code | Descriptor |
|---|---|
| `OMBS.S.RV.K2.1` | The learner picks up a piece of their own work that stopped at least several days earlier, does more on it, and says with prompting one reason they chose that piece. |
| `OMBS.S.RV.35.1` | The learner returns by their own choice to a piece of their own work that had been set aside, does further work on it, and names both what had stopped them and what brought them back. |
| `OMBS.S.RV.68.1` | Returning to a project they had abandoned, the learner names what stopped it, what has changed since that makes returning worth doing, and what they will do differently this time; if they work on it and then set it aside again, naming why satisfies this descriptor as fully as continuing does. |
| `OMBS.S.RV.912.1` | The learner chooses one abandoned project from among two or more candidates, states the grounds for choosing it over the others, does further work on it, and names at least one thing they can do now that they could not do when the work stopped. |

#### 2.3.1 The evidence that proves it is not `S.IT`

This is the test the dimension has to pass to earn its place, so here is a case that satisfies `S.RV` and
satisfies **no** `S.IT` descriptor at any band.

> In October a learner drew four pages of a comic about their dog and stopped. No one reviewed it, no one gave
> feedback, nothing was tested; they simply could not draw the dog running and stopped opening the file. In
> March, unprompted, they pick it up. They say: *"I stopped because I couldn't draw him running and it put me
> off. I came back because we did motion lines in the animation unit and now I can, and I want my cousin to
> read the whole thing."* The four October pages are unchanged. They draw page five.

- **Satisfies `OMBS.S.RV.35.1`**: work was set aside, the return was the learner's choice, and they named both
  what stopped them and what brought them back.
- **Satisfies no `S.IT` descriptor.** `S.IT`'s anchor is "uses test results to revise." There was no test, no
  feedback, and no revision — the earlier pages were not changed at all. `OMBS.S.IT.35.1` requires "one change
  made between drafts and the feedback or test result that drove it"; there is no feedback, no test result, and
  no change to a draft. `S.IT.K2.1` requires "after receiving feedback"; none was received.

The separation holds in the other direction too, which is what makes it a real distinction rather than a
relabelling: a learner who revises a poem three times in one sitting on peer feedback satisfies `S.IT` fully and
never touches `S.RV`, because no gap was crossed.

#### 2.3.2 Tested against the other two codes it could collapse into

- **Not `S.DG`.** Nothing failed and no cause was located. The learner did not reproduce a problem in a smaller
  setting or hold anything constant. Conversely a learner can diagnose a fault and repair it inside one
  afternoon, crossing no gap at all.
- **Not `S.AI.TJ`.** Trajectory is the standard's other longitudinal code, so this one matters. `TJ` tracks a
  moving boundary of *delegation* — what the learner hands to a tool versus keeps — and requires at least two
  substantive AI uses to be observable at all. The comic example involves no AI, so `TJ` is not applicable to
  it. Conversely, a learner whose delegation boundary shifts across a single continuous project satisfies `TJ`
  and never abandons anything, so `RV` is not applicable to that. They share only the property of needing two
  points in time; they are not measuring the same movement.

#### 2.3.3 The failure modes this dimension is written against

`S.RV` is one careless descriptor away from being a compliance code or a grit score, so all three guards are in
the normative text (§4.5) rather than in this proposal only:

- **Not compliance.** A learner *directed* back to an unfinished assignment has complied, not revisited. Every
  descriptor asks for the learner's own account of why this piece.
- **Not persistence as a virtue.** Abandonment is a legitimate outcome of making and OMBS issues no code for
  it. `OMBS.S.RV.68.1` says explicitly that working on the piece and then setting it aside again, with a stated
  reason, satisfies the descriptor **as fully as continuing does**. A code that rewarded only finishing would
  punish taste.
- **Not a record-keeping test.** The learner need not have documented the abandonment at the time. The earlier
  state of the work is useful evidence where it survives; the assessable act is the return and the account.

#### 2.3.4 Origin, and why the origin is not the argument

`OMBS.S.RV` was named as a candidate in SayMake's own mapping document, which logs a `SM.DREAM_RESURFACE` event
when a child returns to an abandoned project and commits to picking it up, and flags it as "candidate for
upstream `OMBS.S.RV` (Revisit) if OMBS adds one." That is where the name came from and it is **not** the
rationale. A product's event log is evidence that someone found the distinction worth instrumenting, not
evidence that it is developmentally real. The case above and the grounding in §6 are the argument; the origin is
disclosed because the sole adopter proposing a code that its own product already emits is exactly the conflict
§0 is about.

---

## 3. Worked examples — two per band, at least one non-physical

Required by the medium-agnostic principle: a descriptor that only a workshop can satisfy is not medium-agnostic
however it is worded. These are illustrations for reviewers, not normative text, and they stay out of
`STANDARD.md` deliberately (§1.6 — vocabulary, not curriculum).

### `OMBS.S.DG` — Diagnose

**K–2** *(tries it again after changing one thing, and says whether that change made a difference)*
- **Physical.** A paper aeroplane keeps veering left. The child re-folds one wing — only that wing — throws it
  again, and says "it went straighter." The teacher's note records that one thing was changed.
- **Non-physical (performance).** A knock-knock joke does not get a laugh. The child tries it again saying the
  punchline slower, nothing else changed, and says whether it worked better that time.

**3–5** *(narrows to a smaller part that still shows the problem)*
- **Non-physical (writing).** Three readers stop on the same page of a six-page story. Instead of rewriting the
  story, the writer reads that one page aloud to a fourth reader, watches where they stop, and writes "it's the
  bit where the dog talks" on the draft.
- **Cooking.** A pasta sauce tastes wrong. The cook tastes the tomato base on its own, before it was combined
  with anything, and records that the base was already too salty — so the problem is not the cheese.

**6–8** *(states the suspected cause first; changes one thing at a time, recording each try)*
- **Non-physical (social).** A lunchtime club keeps ending in an argument about who chooses the game. Before
  changing anything the organiser writes "I think it's that nobody knows whose turn it is." They try a written
  turn list for one week, change nothing else, and log what happened. Then they try a second thing.
- **Textiles.** A sleeve puckers. The maker writes down the suspected cause (the seam allowance), sews one test
  sleeve with only that changed, keeps both, and notes the result against each.

**9–12** *(keeps an unchanged copy; reports a cause suspected first and ruled out)*
- **Non-physical (code).** A page loads slowly. The student keeps the old version running, changes one query,
  compares the two, and reports: "I first blamed the images. I measured with images switched off and it was
  still slow, so it wasn't them."
- **Music.** An ensemble passage falls apart at bar 40. The director keeps a recording of the old run, tries the
  passage with the tempo unchanged but one entry cue moved, compares recordings, and reports that the first
  suspicion — the second violins being under-rehearsed — was ruled out when the same passage held at a slower
  tempo with the same players.

### `OMBS.S.RV` — Revisit

**K–2** *(picks up work stopped several days earlier; says one reason)*
- **Non-physical (story).** A child returns to a story they dictated last week, asks the adult to read back what
  is there, and adds an ending — "because I wanted the cat to get home."
- **Physical.** A half-built block tower left standing since Friday; on Monday the child chooses it over the new
  materials on the table and adds a roof.

**3–5** *(names what stopped them and what brought them back)*
- **Non-physical (music).** A song abandoned at one verse. Two months later: "I stopped because I couldn't
  think of a second verse. I came back because we sang a round in class and now I want it to be a round."
- **Sewing.** A cushion cover put down when the zip went wrong: "I stopped at the zip. Nan showed me how to
  tack it, so I got it back out."

**6–8** *(what changed since; what they will do differently; a reasoned re-abandonment counts)*
- **Non-physical (social/writing).** A school newsletter that ran twice and stopped: "It stopped because I was
  doing all of it. What's changed is two people said they'd write a section. This time I'm doing four pages,
  not eight." — and, equally valid: they restart it, find the two helpers do not deliver, and stop again,
  writing down that they will not run it single-handed.
- **Physical.** A go-kart abandoned when the steering jammed, restarted after a scrap bearing turns up.

**9–12** *(chooses among candidates on stated grounds; names a new capability)*
- **Non-physical (code).** Three shelved projects; the learner picks the one whose blocker was a database they
  now know how to model — "the other two are still blocked on money and on access to the site."
- **Furniture.** Two unfinished pieces; picks the chair because the joint that stopped it is one they can now
  cut, and says so.

### The two second components

| Code | Non-physical example | Second example |
|---|---|---|
| `S.TS.K2.2` | Tries saying the scary line of a play first, before learning the rest. | Tries whether the glue holds the two heaviest pieces before building the rest. |
| `S.TS.35.2` | Checks that the library actually has the book the whole report depends on, before writing. | Checks that the motor turns the wheel at all before building the chassis. |
| `S.TS.68.2` | Ranks "will anyone come?" above "will the posters look good?" and tests attendance first. | Ranks "will the shelf hold the weight?" above "will the stain match?" and loads a test shelf. |
| `S.TS.912.2` | Records that the interviewee agreeing is the costliest assumption, secures it before drafting. | Records that the venue's power supply is costliest, tests it before building the rig. |
| `B.ST.K2.2` | Says which two scenes of a play join and what has to happen at the join, before rehearsing. | Says the tab will slot into the slit, before cutting either. |
| `B.ST.35.2` | Two writers agree in writing what the first chapter must leave the character holding. | Draws the size the peg must be for the hole, before making either. |
| `B.ST.68.2` | A shared playlist spec: what each contributor's segment must start and end on, so one can be swapped. | A shelf bracket spec that lets the shelf be replaced without redrilling. |
| `B.ST.912.2` | A co-written report's section interface, handed to a partner who writes to it without seeing the rest. | A joint spec a partner mills to without seeing the mating part. |

---

## 4. The Core-conformance break

**This is the part reviewers should push hardest on.**

### 4.1 What breaks

§1.7 defines Core as, among other things, using "the five Shared Practices codes." With `S.DG` and `S.RV` it is
**seven**. An implementation that conformed at Core under v0.3.0 does not conform at Core under v0.4.0 until it
can emit both.

**The spine is broken once, and that is the reason `S.RV` is in this proposal rather than the next one.** Two
consecutive minors each adding one spine dimension would cost every adopter two migrations for what is a single
editorial judgement about what the spine is missing. One break is cheaper than two even though this break is
bigger.

### 4.2 Who it affects

- **SayMake**, pinned at `OMBS@0.2.0` in `ombs-tagger.ts` and `studio-independence.ts` (per the brief that
  commissioned this proposal — **not verified from this repository**, which has no visibility into that
  codebase). Being pinned two minors back it is unaffected until it upgrades, and it is the adopter with the
  most direct reason to want both codes: a learner who breaks a build and cannot say why currently earns no
  code, and a learner who returns to an abandoned project earns one only under a SayMake-private
  `SM.DREAM_RESURFACE` event. The cost is real and larger than for `S.DG` alone — its `OmbsPractice` union goes
  from six members to eight, and every exhaustive switch over that union becomes a compile error until both are
  handled. That is the good kind of breakage (it fails loudly at build time rather than silently at tag time),
  but it is work, and it is reported here rather than discovered later.
- **The published site** (`docs/`, `index.html`) and the badge companion, which read v0.3.0 and are unaffected
  until a release is cut.
- **Any other adopter.** None is known to the maintainer. That is a statement about the maintainer's knowledge,
  not evidence that none exists — the standard is CC BY-SA and adoption requires no registration. Reviewers who
  know of one should say so in the comment thread; the migration path below is written for a reader we cannot
  survey.

### 4.3 Migration path

Encoded in `v0.4.0-draft/STANDARD.md` §1.7 and in `standards.json` under `conformance.migrationNote`.

1. **Nothing already emitted becomes wrong.** No code is renamed or retired. Every v0.3.0 tag keeps its
   meaning. What changes is what a *Core declaration* asserts.
2. **The version is part of the declaration.** §1.7 already requires the level to be stated with its version.
   An implementation that keeps declaring `OMBS v0.3.0, Core` stays accurate and needs no work. The break lands
   only when it declares against 0.4.0.
3. **The migration is additive.** Add `OMBS.S.DG` and `OMBS.S.RV` to the emitted set. Where a practice was not
   observed, it is reported the way any unobserved practice is reported — as no evidence yet, never as a
   deficit (Appendix A.2.3). `OMBS.S.RV` will read as no-evidence-yet for any programme whose projects all
   begin and end inside one unit; that describes the programme, not the learners.
4. **The honest half-step.** An adopter who cannot emit `S.DG` or `S.RV` and will not stay on 0.3.0 declares
   *Core (partial)* and names the missing dimensions. That is honest and it is not Core. A Core that means five
   practices at one adopter and seven at another is exactly the incomparability §1.7 exists to prevent.

### 4.4 Version number

Ships as `0.3.0 → 0.4.0`, a minor bump, under the pre-1.0 caveat: §3.1 allows breaking code-ID changes during
the v0.x series, and this change breaks no code ID at all — only a conformance declaration. Post-1.0 the same
change would need a major bump and a deprecation window. Reviewers who think the conformance break alone
warrants `1.0.0` should say so; the counter-argument is that shipping 1.0 asserts stability the standard has
not earned, and that would be the more misleading claim.

---

## 5. Scope-guardrail defence

### 5.1 NGSS Practice 3 — a partial boundary, after a correction

**An earlier revision of this proposal got this wrong, and the source it cited as verification is what refutes
it.** That draft claimed the distinction was that "SEP-3 investigates a natural phenomenon to produce
scientific knowledge, inside a science content domain." Both halves of that fail against primary sources:

1. The NRC Framework chapter this proposal cites puts engineering **inside Practice 3's own discussion**:
   > "Engineers use investigation both to gain data essential for specifying design criteria or parameters and
   > to test their designs."

   (Verified verbatim at nationalacademies.org/read/13165/chapter/7, in the paragraph that opens "Planning for
   controls is an important part of the design of an investigation.") Practice 3's object is therefore not only
   a natural phenomenon and its purpose not only scientific knowledge.
2. NGSS applies Practice 3 to a learner's **own prototype, for the purpose of improving it**, in
   **3-5-ETS1-3**:
   > "Plan and carry out fair tests in which variables are controlled and failure points are considered to
   > identify aspects of a model or prototype that can be improved."

   (Verified verbatim at nextgenscience.org/pe/3-5-ets1-3-engineering-design; its foundation-box practice is
   "Planning and Carrying Out Investigations.") Controlled variables, on an artifact the learner made, to locate
   what to fix — that is `S.DG`'s object, purpose, and technique, not a neighbouring one.

So the honest position is not a clean boundary. It is a **crosswalk plus a narrower boundary**, and both now
ship:

- **`OMBS.S.DG` → `3-5-ETS1-3`, `overlaps`** is added to `ngss-eng-design` in `crosswalks.json`. This is
  `S.DG`'s closest external match in the whole landscape, and it was previously unmapped while weaker
  alignments (P21 Critical Thinking, Agency by Design *Look Closely*) had rows. That asymmetry understated in
  one place in order to overstate in another; repo canon says map at the most specific level the source
  supports.
- **The `ngss-sep-3` boundary is rewritten** as `relation: partial-boundary`, carrying an explicit
  `acknowledgedOverlap` block naming 3-5-ETS1-3 and pointing at the crosswalk, so no tool can read the row as
  claiming there is no relationship.

**What survives as a real boundary**, stated at its actual width:

| | Bounded | Why |
|---|---|---|
| Content assessment | Yes | An NGSS performance expectation bundles a practice with a disciplinary core idea and is satisfied only by demonstrating both. `S.DG` never asks what the learner knows about any domain. |
| Practice 3's science half | Yes | Investigating a natural phenomenon to build explanatory knowledge is outside `S.DG` entirely. OMBS makes no claim on it and is not a substitute for it. |
| Medium and range | Yes | 3-5-ETS1-3 is one performance expectation at one band. `S.DG` spans four bands and any medium: a learner diagnosing why a paragraph loses readers, why a sauce came out flat, or why a scene drags satisfies `S.DG` and no performance expectation at all. |
| Controlled-variable testing of a learner's prototype | **No — conceded** | This is shared territory, and it is crosswalked as an overlap rather than bounded. |

**`S.TS` was removed from the boundary row.** The earlier revision put `S.TS` in `distinct-from: ngss-sep-3`
while the same file kept `S.TS → 3-5-ETS1-3: overlaps` carried from v0.3.0 — and 3-5-ETS1-3's foundational
practice *is* Practice 3, so a consuming tool held a contradiction-shaped pair. The v0.3.0 `overlaps` row is
correct and stands; the boundary is now scoped to `S.DG` alone.

### 5.2 Not CASEL self-management

The risk is real: a code about not panicking when something breaks would be social-emotional learning wearing a
making-and-building hat, and §1.3 defers SEL to CASEL.

The defence is a test any reviewer can run. **`S.DG` is decided entirely by a trace on the work** — a smaller
specimen, a single changed variable, a retained baseline — and never by the learner's manner. Two cases settle
it:

- A calm, patient, cheerful learner who changes five things at once **does not satisfy `S.DG`.**
- A visibly frustrated learner who changes one thing at a time and records it **does satisfy `S.DG`.**

If the code were measuring self-management those two would come out the other way round. No descriptor contains
a word about affect, persistence, or tolerance. Recorded as a boundary in `crosswalks.json` (`casel-sel`) and
stated in §4.4 and §9.7.

### 5.3 Not the engineering process §2.4 disclaims

§2.4: "OMBS is not a model of *engineering* — engineering practice is a subset of building practice with
additional disciplinary norms (codes, ethics, professional review)."

`S.DG` requires no formal experimental design, no instrument, no measurement, no documentation standard, and
no domain knowledge. (It does ask, from 6–8 on, for a stated suspected cause. An earlier revision said "no
hypothesis in a stated form," which contradicted `OMBS.S.DG.68.1` on the page opposite; the claim is about
experimental apparatus and formality, not about whether the learner says what they think is wrong.) It requires two things a seven-year-old can do with a paper aeroplane and a novelist can
do with a chapter: make it smaller, change one thing. Engineering troubleshooting is one disciplinary
elaboration of that, the way engineering design is one elaboration of `S.DF`. The elaboration is out of scope;
the skeleton is exactly what OMBS is for.

### 5.4 Not AI literacy, not digital citizenship, not CTE

`S.DG` says nothing about AI, tools, platforms, or careers. No new scope boundary is crossed. The four new
components likewise stay inside the practices their parent dimensions already claim.

---

## 6. Citations

Every citation below was checked against a primary source before being written into the draft. What was fetched
and what it returned is recorded in the loop's build notes.

**Every shipped code now carries at least one verified citation.** That was not true two revisions ago, and the
route here is worth stating because it is the substance of the proposal's honesty claim.

An early revision said there were zero `TODO(cite)` markers. Literally true, and misleading: sixteen new codes
had no citations at all and were invisible to the checker, whose citation gate fired only at dimension level
while their parent dimensions dated from 0.1.0. The gate now fires **per code**, which is what `AGENTS.md` and
`CONTRIBUTING.md` say. When it was first run it failed all twenty new codes.

The next revision filled what could be filled and declared the rest — eight codes shipped with `TODO(cite)` as
their **only** grounding. On review that was judged the wrong trade for a public standard, and those two
families were **cut** rather than shipped ungrounded: `OMBS.S.DR.*.2` (minimal end-to-end version) and
`OMBS.B.FN.*.2` (reproducibility) are gone, eight leaves removed. The practices are real; the sources are not
there yet.

What remains: **every shipped code carries at least one citation verified against a primary source.** Eight
codes additionally carry a scoped `TODO(cite)` covering the *learner-level* claim only — never as the code's
sole grounding, always alongside a verified citation for the practice.

| Key | Reference | Verified against | Status |
|---|---|---|---|
| `chen-klahr-1999` | Chen, Zhe, and David Klahr. "All Other Things Being Equal: Acquisition and Transfer of the Control of Variables Strategy." *Child Development* 70, no. 5 (1999): 1098–1120. doi:10.1111/1467-8624.00081 | DOI resolves (302) to academic.oup.com/chidev/article/70/5/1098; Crossref metadata; publisher page — all three agree on title, authors, journal, year, volume, issue, pages | **Verified** |
| `klahr-carver-1988` | Klahr, David, and Sharon McCoy Carver. "Cognitive objectives in a LOGO debugging curriculum: Instruction, learning, and transfer." *Cognitive Psychology* 20, no. 3 (1988): 362–404. doi:10.1016/0010-0285(88)90004-7 | DOI resolves (302) to Elsevier linkinghub PII 0010028588900047; Crossref and Semantic Scholar metadata agree | **Verified** |
| `zimmerman-c-2007` | Zimmerman, Corinne. "The development of scientific thinking skills in elementary and middle school." *Developmental Review* 27, no. 2 (2007): 172–223. doi:10.1016/j.dr.2006.12.001 | DOI resolves (302) to Elsevier linkinghub PII S0273229706000797; Crossref and Semantic Scholar metadata agree | **Verified** |
| `parnas-1972` | Parnas, D. L. "On the criteria to be used in decomposing systems into modules." *Communications of the ACM* 15, no. 12 (1972): 1053–1058. doi:10.1145/361598.361623 | Crossref and Semantic Scholar agree on title, author, journal, year, volume, issue, pages | **Verified** |
| `boehm-1988` | Boehm, Barry W. "A spiral model of software development and enhancement." *Computer* 21, no. 5 (1988): 61–72. doi:10.1109/2.59 | DOI resolves (302) to ieeexplore.ieee.org/document/59; Crossref gives *Computer* 21(5):61–72, 1988, ISSN 0018-9162, IEEE. **A conflict was found and resolved:** OpenAlex reports 1986, vol 11, issue 4, pp 14–24 for this DOI — that is the earlier *ACM SIGSOFT Software Engineering Notes* printing of the same paper, conflated onto the IEEE DOI. Crossref is the registration agency for this DOI and its record matches the resolution target, so the IEEE *Computer* 1988 details are used | **Verified, conflict resolved** |
| — | NRC (2012), *A Framework for K–12 Science Education* — Practice 3 title **and its engineering sentence**, used in §5.1 | Framework chapter text at nationalacademies.org/read/13165/chapter/7; the sentence "Engineers use investigation both to gain data essential for specifying design criteria or parameters and to test their designs" quoted verbatim from Practice 3's own discussion | **Verified**; already in §11 |
| — | NGSS **3-5-ETS1-3** performance-expectation text, used in §5.1 and §9.1 | nextgenscience.org/pe/3-5-ets1-3-engineering-design — PE text and foundation-box practice ("Planning and Carrying Out Investigations") quoted verbatim | **Verified** |

**What each citation is doing, and what it is not.**

- **Chen & Klahr (1999)** is why one-change-at-a-time sits at K–2 and 3–5 rather than being held back to middle
  school: they show 7- to 10-year-olds acquire the control-of-variables strategy from direct instruction and
  transfer it beyond the training task. It does **not** validate these descriptors and was not conducted on
  making and building work.
- **Klahr & Carver (1988)** is the load-bearing citation for the medium-agnostic claim: debugging objectives,
  once made explicit, produced transfer to non-programming tasks. It does **not** show transfer to the specific
  mediums OMBS spans.
- **Zimmerman (2007)** is why the 6–8 and 9–12 descriptors ask for a stated suspected cause and a ruled-out one
  rather than assuming either arrives with age. It is a **review**, cited as a review.
- **Papert (1980)**, already in §11, is the right grounding for debugging-as-mindset and is referenced as
  rationale rather than as a source of indicators — the same treatment §1.5 already gives Constructionism.

**Two different Zimmermans.** Barry J. Zimmerman (2002), cited by `S.AI.DI`, and Corinne Zimmerman (2007),
cited by `S.DG`, are unrelated authors who would otherwise collide in a short-form citation. `STANDARD.md` §11
carries a note saying so, and the bibliography key is `zimmerman-c-2007` rather than `zimmerman-2007`.

**What Parnas and Boehm are, and are emphatically not.** They are engineering papers. They are cited as the
canonical statements of two *practices* — specifying what each side of a boundary must provide and may assume
before either side is built (Parnas), and ordering work by what it would cost to be wrong late (Boehm). They
are **not evidence about children**, they say nothing about grade bands, and no descriptor's band placement
rests on them. §11's preamble says this on the page, each bibliography entry carries a `note` saying it, and
`standards.json` carries a `citationScope` field on every node that cites them so the limit is machine-readable
rather than a matter of a reader's good faith. Reviewers who think even a scoped citation to software
literature pulls a K–12 standard the wrong way should say so: the fallback is to drop both and add
`OMBS.S.TS.*.2` and `OMBS.B.ST.*.2` to the `TODO(cite)` list, which costs nothing but honesty.

### 6.1 The four declared gaps

| Family | Status | Grounding |
|---|---|---|
| `OMBS.S.DG.*` Diagnose | **Cited, verified** | Chen & Klahr (1999), Klahr & Carver (1988), Zimmerman, C. (2007). Band placements flagged in §4.4's epistemic-status note. |
| `OMBS.S.RV.*` Revisit | **Cited, verified** + scoped `TODO(cite)` | Azevedo (2011) grounds the load-bearing claim; Barron (2006) grounds self-initiation only. `TODO(cite)` for the band placements. See §6.2. |
| `OMBS.S.TS.*.2` risk-ordered testing | **Cited, verified** + scoped `TODO(cite)` | Boehm (1988) states the practice. Nothing places risk-ordering at a grade band. |
| `OMBS.B.ST.*.2` boundary specification | **Cited, verified** + scoped `TODO(cite)` | Parnas (1972) states the practice. Nothing places boundary specification at a grade band. |
| ~~`OMBS.S.DR.*.2`~~ minimal end-to-end | **CUT** | No source found that states the practice generally or places it at a band. Not shipped rather than shipped ungrounded. |
| ~~`OMBS.B.FN.*.2`~~ reproducibility | **CUT** | Research-reproducibility literature concerns replication of published findings by researchers; borrowing it for a learner keeping enough of a recipe to mend a costume would overstate what is known. Not shipped. |

Cutting the two families also removed the proposal's one uncited empirical claim. §4.2 had asserted that
between-the-parts problems "are cheapest to find early and most expensive to find late" — the cost-of-change
curve, contested in the literature it comes from and unevidenced in OMBS's mediums. That paragraph went with the
family it justified.

### 6.2 `OMBS.S.RV` — what was searched, what was found, what was declined

The hard constraint on this amendment was that `S.RV` ships only with a verified citation genuinely supporting a
practice claim. Four leads were checked.

| Lead | Metadata | Abstract | Decision |
|---|---|---|---|
| **Azevedo (2011)**, "Lines of Practice: A Practice-Centered Theory of Interest Relationships," *Cognition and Instruction* 29(2):147–184, doi:10.1080/07370008.2011.556834 | Verified (Crossref, Semantic Scholar) | **Verified in full.** "A line of practice is a distinctive, **recurrent** pattern of long-term engagement in a person's participation"; "I show how interests have **birth, death, and changes** in a person's engagement." | **CITED — primary grounding.** This is the claim `S.RV` rests on: stopping and resuming is the normal shape of sustained practice, not a deficit, which is what makes a code for the *return* worth having. |
| **Barron (2006)**, "Interest and Self-Sustained Learning as Catalysts of Development," *Human Development* 49(4):193–224, doi:10.1159/000094368 | Verified (Crossref) | **Verified in full** from the Karger page. Five self-initiated learning processes including "the creation of new interactive activity contexts such as projects." **The abstract does not mention time, persistence, or returning to work.** | **CITED, narrowly.** Grounds self-initiation and sustained projects across settings. Explicitly *not* cited for return — the JSON `note` says so. |
| **Hidi & Renninger (2006)**, "The Four-Phase Model of Interest Development," *Educational Psychologist* 41(2):111–127, doi:10.1207/s15326985ep4102_4 | Verified (Crossref) | Verified: "a 4-phase model… triggered situational interest, maintained situational interest, emerging (less-developed) individual interest, and well-developed individual interest." | **DECLINED.** The construct I would have wanted it for — individual interest as a disposition to voluntarily *re-engage* content over time — does **not appear in the abstract**, and the publisher blocked every route to the body. Citing it for re-engagement would have been the precise stretch this proposal was warned against. Named here so the next reviewer can finish the check rather than repeat it. |
| **Ito et al., *Connected Learning* (2013)** | Not pursued | — | **DECLINED.** A programme report rather than an empirical finding; Azevedo already carries the claim from a peer-reviewed study. |

**Resnick, *Lifelong Kindergarten* (2017)** is already in §11 and its creative-learning spiral is the natural
design rationale for a return-to-earlier-work loop. It is a practitioner book, not an empirical finding, and it
is treated as rationale — it is not among `S.RV`'s machine-readable citations.

Had Azevedo not verified, the honest outcome was to ship `S.DG` alone and defer `S.RV`. It verified, and its
abstract turned out to be more directly on point than expected — "birth, death, and changes in engagement" is
abandonment and resumption named as the ordinary shape of an interest.

---

## 7. Alternatives considered and rejected

### 7.1 Five new dimensions

Diagnose, Close-the-Loop, Test-the-Risk, Design-the-Joins, and Reproduce as five first-class dimensions.

**Rejected.** It takes OMBS to nineteen dimensions, past the twelve-row ceiling the project's own rubric
guidance sets, and takes the Core spine from five practices to ten — every current adopter re-conforming
against a doubled spine. The four practices that became components are genuinely *inside* dimensions that
already exist: a minimal end-to-end version is a kind of draft, risk-ordering is a property of testing, a
boundary specification is structure, and a rebuild record is fitness for use. Making them dimensions would say
they are not, which is false.

### 7.2 Zero new dimensions — fold diagnosis into `S.IT`

Add `S.IT.<band>.2` for diagnosis and leave the dimension count alone.

**Rejected, and this is the alternative with the strongest case.** It costs nothing in conformance, breaks no
adopter, and needs no steering vote. It fails on a specific ground: `S.IT`'s anchor is "uses test results to
revise." Diagnosis happens *before* the learner knows what to revise, and a learner can satisfy `S.IT`
completely without diagnosing anything — which is precisely the failure §1.2 documents. Folding them makes the
combined code unfalsifiable: there would be no observation of "iterated but did not diagnose", because the same
code would cover both. A code that cannot fail is not an assessment.

**What would flip this.** If review finds that assessors cannot reliably separate the two in practice — that
`S.DG` and `S.IT` are scored together in the field however they are defined — then the distinction is
theoretical and belongs as a clause on `S.IT`, not a dimension. SM-2 in the commissioning brief (two
independent readers agreeing on ≥80% of `S.DG` evidence) is the observation that would settle it. That
measurement has not been made. If it comes back low, the right response is to withdraw `S.DG` and re-file it as
`S.IT.<band>.2`, not to defend it.

### 7.3 Fold diagnosis into `S.TS`

**Rejected.** `S.TS`'s anchor is "exposes the work to evidence." Diagnosis consumes that evidence; it does not
produce it. Same unfalsifiability problem as 7.2, in the other direction.

### 7.4 Import the eight-exercise curriculum and the early-artifact ladder

The source material behind this proposal carries an exercise sequence and an artifact ladder (Hello World →
First Bad Version → Spike → Prototype → Walking Skeleton → Tracer Bullet → MVP → v1).

**Rejected, and not a close call.** §1.6 is explicit that OMBS is a vocabulary, not a curriculum. The ladder is
a good teaching sequence for one medium and it is software vocabulary throughout. `S.DR.<band>.2` keeps the one
idea from it that generalises — complete at small scope — and leaves the eight rungs and all eight names out.

### 7.5 A `.2` on `S.DG` for the retained baseline

Splitting "keep a known-good state" out as its own component rather than folding it into `S.DG.912.1`.

**Rejected for now.** With one component per band, `S.DG` stays the smallest thing that could work, and the
baseline is legible as the strongest form of attributing an effect to a cause rather than a separate practice.
If comment says the two come apart, `S.DG.<band>.2` is available and additive.

---

## 8. What ships in this branch

| Path | Change |
|---|---|
| `proposals/0001-building-under-uncertainty.md` | This document |
| `v0.4.0-draft/STANDARD.md` | v0.3.0 prose + `S.DG` (§4.4) + four second components + §1.7 six-practice Core and migration note + §2.2 counts (15 dimensions, 93 leaves) + §7 progressions + §8 descriptors + §9 crosswalks and boundaries + §10 glossary + §11 bibliography |
| `v0.4.0-draft/standards.json` | Structural mirror; every new node self-describing with inline `evidence.forms` and `evidence.observer` |
| `v0.4.0-draft/crosswalks.json` | `S.DG` crosswalk rows; `ngss-sep-3` boundary; `casel-sel` boundary extended |
| `scripts/check-parity.mjs` | Layout check accepts one published directory plus one draft; all thirteen checks run against both; the citation gate now fires **per code** rather than per dimension, and the summary line states what it inspected |
| `CHANGELOG.md` | `[Unreleased]` entry |

`v0.3.0/` is byte-identical to `main`. Verified: `git diff --name-status origin/main` lists no path under
`v0.3.0/`.

### 8.1 The shared-root edit, declared

`scripts/check-parity.mjs` is the repository's discovery mechanism for which directories are standards. Its
layout check asserted *exactly one* `v<x.y.z>/` directory, and `v0.4.0-draft/` does not match that pattern at
all — so without the change the draft would have been silently unchecked, which is worse than failing. Extending
the one script was mandatory, not incidental. The checks were **not** copied into a second script.

Two design choices worth review:

- **`CORE_SPINE_BY_VERSION`.** The spine is declared by hand, per version, in the checker — not read out of
  `standards.json`. A check that derives its expectation from the file under test asserts nothing. Adding a
  dimension to the spine breaks conformance for every adopter, so it must be typed twice by someone who meant
  it. A version with no declared spine fails rather than passing vacuously.
- **README and `docs/` stay pinned to the published version.** They describe what is released. A draft that
  dragged them forward would make an unadopted proposal look shipped.
- **The citation gate fires per code, not per dimension.** It previously tested `introducedIn` only on
  dimensions, so a new component under an old dimension — `OMBS.B.ST.68.2`, under a dimension introduced in
  0.1.0 — was structurally invisible to it while the summary line printed "codes new in 0.4.0 carry citations."
  Sixteen uncited codes passed. Components now declare `introducedIn`, the gate fires on them, and a gap may be
  *declared* with a written `citationsTodo` reason rather than filled. The summary now names the count and lists
  every declared gap, so green cannot mean more than it checked. **The residual hole is stated in the script
  header:** a new component that omits `introducedIn` inherits its dimension's and escapes the gate. An
  internal-consistency checker has no baseline to catch that, the same class of limit as its inability to see a
  code deleted from both files at once.

### 8.2 Evidence that the extended checker still catches things

A green report from a checker edited in the same change is not evidence. Mutations were applied to the draft
directory, the published directory, and the repository root — one per check plus the layout hard-exit paths —
and each was required to produce a non-zero exit **and** name the check that should have caught it. The battery
was extended after review to cover the per-code citation gate and the numeric version compare. Every mutation is
caught; the current count is in the loop's build notes, which also records that the first run of the battery had
a bug in one mutation's undo step. The battery covers, among others: a second published directory; two drafts at once; a draft older
than the published version; README drifting to the draft's version; a duplicate id; a node losing its evidence
block; a missing band; a code in prose that is in no JSON; descriptor text drift; anchor-statement drift; a new
dimension with no citation; a bibliography entry losing its DOI; Core silently dropping `S.DG`; a version with
no declared spine; a boundary naming a code that does not exist; a witness granted band attainment; and a
mutation to `v0.3.0/` proving the published directory is still checked and not skipped.

---

## 9. Open questions for the comment window

1. **Is `S.DG` a dimension or a component of `S.IT`?** §7.2 is the case against this proposal. Reviewers who
   score classroom evidence should answer from experience, not from the argument.
2. **Are the band placements right?** K–2 one-change-at-a-time rests on Chen & Klahr's 7–10 range, which starts
   above the bottom of the band. Is one-change-at-a-time observable in a five-year-old, with prompting?
3. **Does `S.DR.<band>.2` survive contact with a teacher?** The `.1`/`.2` distinction is sharp on paper.
   Reviewers should try to tag real drafts with it and report where it blurred.
4. **Is `B.FN.<band>.2` a privacy problem?** It asks for a retained record. §8.1's minimization rule is meant to
   hold it down to the smallest sufficient one. Does the descriptor language actually achieve that?
5. **Is "Diagnose" the right word in translation?** Translators should say so before it is tagged.
6. **Should the conformance break force `1.0.0`?** §4.4 argues no. The counter-case is worth hearing.
7. **Is the NGSS relationship now stated at the right width?** §5.1 was rewritten after review found the earlier
   version refuted by its own cited source. It now concedes the 3-5-ETS1-3 overlap and crosswalks it. Someone
   who works with NGSS should check whether the residual boundary is still too generous to OMBS — or now too
   modest.
8. **Should `OMBS.S.TS.*.2` and `OMBS.B.ST.*.2` cite software-engineering papers at all?** Parnas (1972) and
   Boehm (1988) state those two practices canonically and are scoped in the text to the practice only. The
   alternative is four `TODO(cite)` families instead of two. §6 argues for the citations; a reviewer who thinks
   any software citation pulls a K–12 standard the wrong way should say so.
9. **Are the verification clauses affordable?** `B.ST.912.2` (a second person builds to the specification),
   `B.FN.68.2` and `B.FN.912.2` (another person follows the record) and `S.DG.912.1` (a kept baseline copy)
   presuppose a partner, spare materials, or a way of preserving a state. Every band has a low-resource,
   non-physical path in §3's worked examples, but the standard should hear from people teaching without those
   resources before this is adopted.

---

## 10. Decision requested

Accept, amend, or reject `S.DG` and the four second components for OMBS v0.4.0, through the process
GOVERNANCE.md describes — **with the window actually observed this time**, or with the CHANGELOG stating
plainly that it was not.
