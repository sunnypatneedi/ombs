/**
 * The video's only source of factual content.
 *
 * It imports `docs/standards.json` — the same machine-readable file the live demo fetches at
 * runtime (docs/demo/index.html L707). Counts, dimension names, descriptor texts and component
 * ids are DERIVED here, never typed in. That is the mechanical half of the honesty gate: the
 * video cannot state a count or quote a descriptor that the standard does not contain, because
 * there is no literal to get wrong.
 *
 * The one thing that is authored rather than derived is GLOSS — the plain-English paraphrases.
 * Those are lifted character-for-character from docs/demo/index.html L506-543, where they are
 * already labelled on screen as "a plain-English paraphrase written for this page", not as the
 * standard. The video reproduces that label too (see stage/Explorer.tsx).
 */

import spec from "../../docs/standards.json";

type Component = {
  id: string;
  gradeBand: string;
  descriptor: string;
};

type Dimension = {
  id: string;
  anchor: string;
  name: string;
  anchorStatement: string;
  components: Component[];
};

type Domain = {
  id: string;
  name: string;
  dimensions: Dimension[];
};

const domains = spec.domains as unknown as Domain[];

export const VERSION: string = spec.version;
export const STATUS: string = spec.status;

/** Grade bands, verbatim from docs/demo/index.html L498-503. */
export const BANDS = [
  { id: "K2", label: "K–2", ages: "ages 5–7" },
  { id: "35", label: "3–5", ages: "ages 8–10" },
  { id: "68", label: "6–8", ages: "ages 11–13" },
  { id: "912", label: "9–12", ages: "ages 14–18" },
] as const;

/** The demo's own age → band derivation (docs/demo/index.html L567). */
export const bandForAge = (a: number) => (a < 8 ? 0 : a < 11 ? 1 : a < 14 ? 2 : 3);

const domain = (id: string) => {
  const d = domains.find((x) => x.id === id);
  if (!d) throw new Error(`OMBS domain ${id} missing from standards.json`);
  return d;
};

export const dimensionsOf = (domainId: string) => domain(domainId).dimensions;

/** The six Shared Practices, in the standard's own order: Define … AI-Independence. */
export const PRACTICES = dimensionsOf("S");

export const practice = (anchor: string) => {
  const d = PRACTICES.find((x) => x.anchor === anchor);
  if (!d) throw new Error(`OMBS practice ${anchor} missing from standards.json`);
  return d;
};

/** Every component the standard holds for one practice at one band. */
export const componentsFor = (anchor: string, bandId: string) =>
  practice(anchor).components.filter((c) => c.gradeBand === bandId);

/**
 * Ground truth item 7 — the footer count. Computed exactly the way the demo computes it
 * (docs/demo/index.html L713-720), so the sentence on screen and the sentence in the tool
 * are the same sentence.
 */
export const COUNTS = {
  descriptors: domains.reduce(
    (n, d) => n + d.dimensions.reduce((m, x) => m + x.components.length, 0),
    0,
  ),
  dimensions: domains.reduce((n, d) => n + d.dimensions.length, 0),
  forms: (spec as { evidenceLayer: { forms: unknown[] } }).evidenceLayer.forms.length,
  observers: (spec as { evidenceLayer: { observers: unknown[] } }).evidenceLayer.observers.length,
  admissibility: (spec as { evidenceLayer: { admissibility: unknown[] } }).evidenceLayer
    .admissibility.length,
};

export const builtLine = () =>
  `Built live from ${COUNTS.descriptors} evidence descriptors across ${COUNTS.dimensions} dimensions in OMBS v${VERSION} (${STATUS}). ` +
  `Plus an evidence layer of ${COUNTS.forms} evidence forms, ${COUNTS.observers} observer types and ${COUNTS.admissibility} admissibility rules.`;

/**
 * Interest chips, verbatim from docs/demo/index.html L547-560, including each chip's domain
 * lean. The lean is why a selected chip is orange or green — that is the colour rule the row
 * exists to teach.
 */
export const INTERESTS = [
  { id: "stories", label: "Stories", lean: "M" },
  { id: "drawing", label: "Drawing", lean: "M" },
  { id: "comics", label: "Comics", lean: "M" },
  { id: "music", label: "Music", lean: "M" },
  { id: "videos", label: "Videos", lean: "M" },
  { id: "costumes", label: "Costumes", lean: "M" },
  { id: "robots", label: "Robots", lean: "B" },
  { id: "models", label: "Models", lean: "B" },
  { id: "games", label: "Games", lean: "B" },
  { id: "apps", label: "Apps", lean: "B" },
  { id: "forts", label: "Dens & forts", lean: "B" },
  { id: "baking", label: "Baking", lean: "B" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];

/** Editorial paraphrases, verbatim from docs/demo/index.html L506-543. NOT the standard. */
export const GLOSS: Record<string, Record<string, string>> = {
  "OMBS.S.DF": {
    K2: "They can say what they're making and who it's for — even if you have to ask first.",
    35: "Before they start, they say or write three things: what it is, who it's for, and one way to tell if it worked.",
    68: "They set two or more ways to tell if it worked — and change that plan at least once as the project goes on.",
    912: "They weigh what they wanted against real limits, and can tell you what they chose not to do, and why.",
  },
  "OMBS.S.DR": {
    K2: "They make a rough version first, when someone reminds them to.",
    35: "They make two different versions, and can point at what changed between them.",
    68: "They rough things out at different sizes — an outline before the writing, cardboard before the real thing.",
    912: "Their drafts keep more than one option alive, and they record which ones they dropped and what made them drop it.",
  },
  "OMBS.S.TS": {
    K2: "They show it to someone who isn't their teacher, and tell you what that person did or said.",
    35: "They check it against the thing they said would count as working, and write down what actually happened.",
    68: "They design tests for their own criteria, run them with real people, and can tell a real finding from a fluke.",
    912: "They design a test that could prove them wrong, run it anyway, and report the bad news honestly.",
  },
  "OMBS.S.IT": {
    K2: "After feedback, they try again and something visibly changes.",
    35: "They can name one change they made and the feedback that caused it.",
    68: "They can say which feedback they took, which they set aside, and the reason for each.",
    912: "They try genuinely different directions, not just polish — and record what they abandoned and why.",
  },
  "OMBS.S.SH": {
    K2: "They show it to people beyond the teacher — classmates, family, the school.",
    35: "They change something about how they present it for a new audience, and can say what they changed.",
    68: "They reach the audience they named at the start, and record how that audience responded.",
    912: "They publish it properly — thinking about access, rights, and letting other people build on it.",
  },
  "OMBS.S.AI": {
    K2: "They can point at one part they decided themselves and one part the tool made.",
    35: "They say where they used AI, name one thing they kept and one they changed or rejected, and give their own reason for each.",
    68: "They keep a running record: what they asked, what came back, and what they kept, changed or rejected — each with a reason in their own words.",
    912: "They can argue the work would still stand without the AI parts — or say exactly what would be lost, and why that's acceptable.",
  },
};

/** The demo's own lean sentence (docs/demo/index.html L607-617), reproduced exactly. */
export const leanFor = (picks: readonly string[], who: string) => {
  const picked = INTERESTS.filter((i) => (picks as readonly string[]).includes(i.id));
  if (picked.length === 0) return null;
  const m = picked.filter((p) => p.lean === "M").length;
  const b = picked.filter((p) => p.lean === "B").length;
  if (m > b)
    return { who, word: "Making", tail: " — originating something for an audience", domain: "M" as const };
  if (b > m)
    return {
      who,
      word: "Building",
      tail: " — constructing something that has to hold up in use",
      domain: "B" as const,
    };
  return { who, word: "both Making and Building", tail: " in equal measure", domain: "S" as const };
};
