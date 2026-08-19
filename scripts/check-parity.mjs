#!/usr/bin/env node
// OMBS parity checker.
//
// CONTRIBUTING.md promises "CI verifies parity between the prose and the JSON."
// This is that check. Zero dependencies; run with `node scripts/check-parity.mjs`
// from the repository root. Exits 0 when every invariant holds; otherwise it
// reports every violation it found and exits 1. Failure output names the
// offending code, so the fix is mechanical.
//
// Invariants asserted:
//   layout          exactly one published v*/ standard directory (the
//                   move-forward pattern), plus at most one v*-draft/ sibling
//                   holding a proposal awaiting steering review
//   version         every version string agrees with the directory name
//   ids             code IDs are well-formed, unique, and match their own metadata
//   self-describe   every node carries domain + dimension + gradeBand + evidence inline
//   bands           every dimension covers all four grade bands
//   parity          codes match prose -> JSON and JSON -> prose, both directions
//   descriptors     descriptor TEXT is identical between §8 prose and the JSON
//   evidence-parity evidence-layer definitions, warrants, rules and anchor
//                   statements are identical between the prose and the JSON
//   refs            crosswalk and boundary references resolve to real codes
//   evidence-layer  forms, observer types and admissibility rules are well-formed
//   citations       codes introduced in the current version cite an entry that
//                   carries a DOI or URL. NOTE: the checker never fetches a DOI.
//                   It checks that one is present and that the entry appears in
//                   §11. Whether a reference is real is human review's job.
//   conformance     the declared conformance levels match §1.7, and Core's
//                   required set is exactly the shared spine declared for that
//                   version in CORE_SPINE_BY_VERSION below
//
// Every check above runs against EVERY standard directory found — the published
// one and the draft, if a draft is present. A draft that cannot pass the same
// checks as the published standard is not reviewable as a standard, which is the
// whole reason a proposal ships as a full encoding rather than a prose sketch.
// Repository-level claims (README.md, the published-site copies under docs/)
// are asserted against the PUBLISHED directory only: README and the site
// describe what is released, not what is proposed.
//
// What this CANNOT catch, by construction. An internal-consistency checker has
// no baseline to compare against, so green never means "nothing was lost." Both
// of these remain PR review's job, permanently:
//
//   1. A code removed from BOTH the prose and the JSON in the same change.
//      Nothing here would notice.
//   2. A NEW component that omits `introducedIn`. The citation gate below fires
//      on `introducedIn === VERSION`, so a node that simply leaves the field out
//      inherits its dimension's version and is never asked for a citation. The
//      run stays green and the only visible trace is the component count on the
//      `citations` summary line moving down by one. `introducedIn` is required
//      on new components by convention, not by this script, because making it
//      mandatory on ALL components would force edits into published directories
//      whose files must not change. A reviewer checking that new codes are cited
//      should read the summary count, not the exit status.
//
// The second hole is the one that let sixteen uncited codes ship in the first
// v0.4.0 draft, when the gate fired at dimension level only. Firing per code
// closes the common case; it does not close this one.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const notes = [];

// ---------------------------------------------------------------- 1. layout

const directories = readdirSync(ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const publishedDirs = directories.filter((n) => /^v\d+\.\d+\.\d+$/.test(n));
const draftDirs = directories.filter((n) => /^v\d+\.\d+\.\d+-draft$/.test(n));

if (publishedDirs.length !== 1) {
  console.error(
    `[layout] expected exactly one published v<x.y.z>/ standard directory, found ${
      publishedDirs.length
    }: ${publishedDirs.join(", ") || "(none)"}\n` +
      "         Superseded versions are moved forward, not duplicated (CHANGELOG 0.2.0);\n" +
      "         prior versions stay citable through git tags and history.\n" +
      "         A version still under proposal belongs in v<x.y.z>-draft/, not in a second v<x.y.z>/.",
  );
  process.exit(1);
}

if (draftDirs.length > 1) {
  console.error(
    `[layout] expected at most one v<x.y.z>-draft/ directory, found ${draftDirs.length}: ${draftDirs.join(", ")}\n` +
      "         One proposal in flight at a time. Two drafts cannot both amend the same published version\n" +
      "         without the second silently deciding what the first meant.",
  );
  process.exit(1);
}

const TARGETS = [
  { versionDir: publishedDirs[0], version: publishedDirs[0].slice(1), isDraft: false },
  ...draftDirs.map((d) => ({ versionDir: d, version: d.slice(1, -"-draft".length), isDraft: true })),
];

for (const t of TARGETS) {
  for (const f of ["STANDARD.md", "standards.json", "crosswalks.json"]) {
    if (!existsSync(join(ROOT, t.versionDir, f))) {
      console.error(`[layout] ${t.versionDir}/${f} is missing`);
      process.exit(1);
    }
  }
}

const PUBLISHED = TARGETS.find((t) => !t.isDraft);
const DRAFT = TARGETS.find((t) => t.isDraft);

// Numeric segment compare. A string compare gets 0.10.0 < 0.9.0 wrong, and the
// first version past x.9.0 is exactly when nobody is looking at the layout check.
const cmpVersion = (a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
};

if (DRAFT && cmpVersion(DRAFT.version, PUBLISHED.version) <= 0) {
  console.error(
    `[layout] ${DRAFT.versionDir}/ proposes ${DRAFT.version}, which does not sort after the published ${PUBLISHED.version}.\n` +
      "         A draft amends the published version; it cannot restate or precede it.",
  );
  process.exit(1);
}

// Core's required set is the shared spine. It is declared here, by hand, per
// version — NOT read out of standards.json — because a check that derives its
// expectation from the file it is checking asserts nothing. Adding a dimension
// to the spine is a conformance break for every adopter, so it must be typed
// twice, once here and once in the JSON, by someone who meant it.
const CORE_SPINE_BY_VERSION = {
  "0.3.0": ["OMBS.S.DF", "OMBS.S.DR", "OMBS.S.TS", "OMBS.S.IT", "OMBS.S.SH"],
  // 0.4.0 adds OMBS.S.DG (Diagnose) and OMBS.S.RV (Revisit). Five -> seven is a
  // Core-conformance break, taken once in one version rather than across two
  // consecutive minors; see v0.4.0-draft/STANDARD.md §1.7 and
  // proposals/0001-building-under-uncertainty.md.
  "0.4.0": ["OMBS.S.DF", "OMBS.S.DR", "OMBS.S.TS", "OMBS.S.DG", "OMBS.S.RV", "OMBS.S.IT", "OMBS.S.SH"],
};

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const readme = readFileSync(join(ROOT, "README.md"), "utf8");

// The load-bearing ids, pinned. Deleting a code from BOTH the prose and the
// JSON is otherwise invisible (see the header note); for the rules and observer
// types that carry the warrant model, silent removal is not an acceptable
// failure mode. Additions are free; these five and four may not vanish.
const REQUIRED_RULES = ["OMBS.EV.DISC", "OMBS.EV.SEQ", "OMBS.EV.WARR", "OMBS.EV.CONS", "OMBS.EV.STAND"];
const REQUIRED_OBSERVERS = ["OMBS.OB.SF", "OMBS.OB.RC", "OMBS.OB.WT", "OMBS.OB.AT", "OMBS.OB.AD"];
const ATTESTER = "OMBS.OB.AT";

const stats = [];
for (const target of TARGETS) stats.push(checkStandard(target));

function checkStandard({ versionDir, version: VERSION, isDraft }) {
  const VERSION_DIR = versionDir;
  const DIR = join(ROOT, VERSION_DIR);
  // With two directories in play, a bare code in a failure message is ambiguous.
  const where = TARGETS.length > 1 ? `${VERSION_DIR} · ` : "";
  const fail = (check, message) => failures.push({ check, message: where + message });

  const standards = readJson(join(DIR, "standards.json"));
  const crosswalks = readJson(join(DIR, "crosswalks.json"));
  const prose = readFileSync(join(DIR, "STANDARD.md"), "utf8");

  // --------------------------------------------------------------- 2. version

  const versionClaims = [
    ["standards.json .version", standards.version],
    ["standards.json .ombsVersion", standards.ombsVersion],
    ["crosswalks.json .ombsVersion", crosswalks.ombsVersion],
    ["STANDARD.md header", (prose.match(/^\*\*Version:\*\*\s*([\d.]+)/m) || [])[1]],
    ["STANDARD.md footer", (prose.match(/End of OMBS v([\d.]+)/) || [])[1]],
    ["STANDARD.md Appendix A.5 example", (prose.match(/`OMBS@([\d.]+)`/) || [])[1]],
  ];

  // README.md and the published-site copies describe the RELEASED standard.
  // A draft must not drag them forward — that is what publishing is for.
  if (!isDraft) {
    versionClaims.push(
      ["README.md status line", (readme.match(/\*\*Status:\*\*\s*Draft v([\d.]+)/) || [])[1]],
      ["README.md citation line", (readme.match(/OMBS\), v([\d.]+)\./) || [])[1]],
      ["README.md cite-as line", (readme.match(/`OMBS v([\d.]+) \(\d{4}\)`/) || [])[1]],
    );
  }

  for (const [claimedIn, claimed] of versionClaims) {
    if (claimed !== VERSION) {
      fail(
        "version",
        `${claimedIn} reads ${claimed ?? "(not found)"}, expected ${VERSION} (from ${VERSION_DIR}/)`,
      );
    }
  }

  if (!isDraft) {
    for (const link of readme.match(/v\d+\.\d+\.\d+\/[A-Za-z.]+/g) || []) {
      if (!link.startsWith(`${VERSION_DIR}/`)) {
        fail("version", `README.md links ${link}, expected a ${VERSION_DIR}/ path`);
      }
    }
  }

  // ---------------------------------------------------- collect the code space

  const GRADE_BANDS = standards.gradeBands.map((b) => b.id);
  const evidenceLayer = standards.evidenceLayer ?? {};
  const FORM_IDS = new Set((evidenceLayer.forms ?? []).map((f) => f.id));
  const OBSERVER_IDS = new Set((evidenceLayer.observers ?? []).map((o) => o.id));
  const RULE_IDS = new Set((evidenceLayer.admissibility ?? []).map((r) => r.id));
  const BIBLIOGRAPHY = standards.bibliography ?? {};

  if (!evidenceLayer.forms?.length) fail("evidence-layer", "standards.json has no evidenceLayer.forms");
  if (!evidenceLayer.observers?.length) fail("evidence-layer", "standards.json has no evidenceLayer.observers");
  if (!evidenceLayer.admissibility?.length) fail("evidence-layer", "standards.json has no evidenceLayer.admissibility");

  // Every dimension and sub-dimension, flattened with its parent context.
  const units = [];
  for (const domain of standards.domains) {
    for (const dim of domain.dimensions) {
      units.push({ ...dim, domainId: domain.id, parent: null });
      for (const sub of dim.subDimensions ?? []) {
        units.push({ ...sub, domainId: domain.id, parent: dim.anchor });
      }
    }
  }

  const componentIds = new Set();
  const anchorIds = new Set(units.map((u) => u.anchor));
  const allJsonCodes = new Set([...anchorIds, ...FORM_IDS, ...OBSERVER_IDS, ...RULE_IDS]);

  // What the citation gate actually inspected, so the summary can say so
  // rather than implying it swept every new code.
  let newComponents = 0;
  const citationTodos = [];

  // ------------------------------------- 3/4/5. ids, self-description, bands

  const COMPONENT_ID = /^OMBS\.[SMB]\.[A-Z]{2}(?:\.[A-Z]{2})?\.(K2|35|68|912)\.\d+$/;

  for (const unit of units) {
    const label = unit.anchor;

    if (!Array.isArray(unit.components) || unit.components.length === 0) {
      fail("self-describe", `${label} has no components`);
      continue;
    }
    if (typeof unit.anchorStatement !== "string" || !unit.anchorStatement.trim()) {
      fail("self-describe", `${label} has no anchorStatement`);
    }
    if (unit.parent && !anchorIds.has(unit.parent)) {
      fail("self-describe", `${label} declares parent ${unit.parent}, which is not a dimension anchor`);
    }
    if (!unit.introducedIn) {
      fail("citations", `${label} has no introducedIn — every dimension must declare the version that introduced it`);
    }
    if (unit.introducedIn === VERSION && !(unit.citations?.length > 0)) {
      fail(
        "citations",
        `${label} is introduced in ${VERSION} but carries no citations (CONTRIBUTING.md requires at least one per new code)`,
      );
    }
    for (const key of unit.citations ?? []) {
      if (!BIBLIOGRAPHY[key]) {
        fail("citations", `${label} cites "${key}", which is not in standards.json bibliography`);
      }
    }
    if (unit.citationsTodo && unit.citations?.length) {
      // Belt and braces are fine; silently claiming both a citation and a gap is not.
      citationTodos.push(`${label} (dimension)`);
    }

    const bandsSeen = new Set();

    for (const c of unit.components) {
      if (componentIds.has(c.id)) fail("ids", `duplicate component id ${c.id}`);
      componentIds.add(c.id);
      allJsonCodes.add(c.id);

      if (!COMPONENT_ID.test(c.id)) {
        fail("ids", `${c.id} does not match the code format OMBS.<domain>.<dimension>[.<sub>].<gradeBand>.<component>`);
        continue;
      }
      if (!c.id.startsWith(`${unit.anchor}.`)) {
        fail("ids", `${c.id} is listed under ${unit.anchor} but its id does not descend from that anchor`);
      }

      // Self-describing: parent dimension, grade band and observer inline —
      // a leaf must be interpretable without walking back up the tree.
      if (c.dimension !== unit.anchor) {
        fail("self-describe", `${c.id} has dimension "${c.dimension ?? "(missing)"}", expected "${unit.anchor}"`);
      }
      if (c.domain !== unit.domainId) {
        fail("self-describe", `${c.id} has domain "${c.domain ?? "(missing)"}", expected "${unit.domainId}"`);
      }
      if (!GRADE_BANDS.includes(c.gradeBand)) {
        fail("self-describe", `${c.id} has gradeBand "${c.gradeBand ?? "(missing)"}", not one of ${GRADE_BANDS.join(", ")}`);
      }
      const idBand = c.id.split(".").at(-2);
      if (c.gradeBand !== idBand) {
        fail("self-describe", `${c.id} declares gradeBand "${c.gradeBand}" but its id encodes "${idBand}"`);
      }
      if (typeof c.descriptor !== "string" || !c.descriptor.trim()) {
        fail("self-describe", `${c.id} has an empty descriptor`);
      }

      // Per-CODE citation gate, not per-dimension. Until 0.4.0 this fired only
      // on `unit.introducedIn`, so a new component under an OLD dimension —
      // OMBS.B.ST.68.2 under a dimension introduced in 0.1.0 — was structurally
      // invisible to it, and sixteen uncited codes passed while the summary
      // line claimed "codes new in <version> carry citations." The rule the
      // failure text quotes is per code, so the check is now per code.
      //
      // A gap may be DECLARED rather than filled: `citationsTodo` is a written
      // reason, surfaced in the summary and counted, so a flagged gap is loud
      // and an unflagged absence fails. AGENTS.md prefers exactly that trade.
      if (c.introducedIn && !/^\d+\.\d+\.\d+$/.test(c.introducedIn)) {
        fail("citations", `${c.id} has introducedIn "${c.introducedIn}", which is not an x.y.z version`);
      }
      if (c.introducedIn && unit.introducedIn && cmpVersion(c.introducedIn, unit.introducedIn) < 0) {
        fail(
          "citations",
          `${c.id} declares introducedIn ${c.introducedIn}, older than its dimension ${unit.anchor} (${unit.introducedIn}) — a component cannot predate the dimension that contains it`,
        );
      }
      if (c.introducedIn === VERSION) {
        newComponents += 1;
        const cites = c.citations ?? [];
        const todo = typeof c.citationsTodo === "string" && c.citationsTodo.trim();
        if (!cites.length && !todo) {
          fail(
            "citations",
            `${c.id} is introduced in ${VERSION} but carries neither citations nor a citationsTodo note (CONTRIBUTING.md requires at least one per new code; an unfilled gap must be declared, not omitted)`,
          );
        }
        if (todo) citationTodos.push(c.id);
        for (const key of cites) {
          if (!BIBLIOGRAPHY[key]) {
            fail("citations", `${c.id} cites "${key}", which is not in standards.json bibliography`);
          }
        }
      }

      const ev = c.evidence;
      if (!ev || typeof ev !== "object") {
        fail("self-describe", `${c.id} has no evidence block (forms + observer must be inline on every node)`);
      } else {
        if (!Array.isArray(ev.forms) || ev.forms.length === 0) {
          fail("self-describe", `${c.id} names no admissible evidence forms`);
        }
        for (const f of ev.forms ?? []) {
          if (!FORM_IDS.has(f)) fail("self-describe", `${c.id} names evidence form ${f}, which is not defined in evidenceLayer.forms`);
        }
        if (!Array.isArray(ev.observer) || ev.observer.length === 0) {
          fail("self-describe", `${c.id} names no competent observer type`);
        }
        for (const o of ev.observer ?? []) {
          if (!OBSERVER_IDS.has(o)) fail("self-describe", `${c.id} names observer ${o}, which is not defined in evidenceLayer.observers`);
        }
      }

      bandsSeen.add(c.gradeBand);
    }

    for (const band of GRADE_BANDS) {
      if (!bandsSeen.has(band)) {
        fail("bands", `${label} has no component for grade band ${band} — every dimension covers all four bands`);
      }
    }
  }

  for (const form of evidenceLayer.forms ?? []) {
    if (!form.id?.startsWith("OMBS.EF.")) fail("evidence-layer", `evidence form id "${form.id}" must be namespaced OMBS.EF.<XX>`);
    if (!form.name || !form.definition) fail("evidence-layer", `${form.id} needs both a name and a definition`);
  }
  // OMBS.EV.STAND in one machine-checkable sentence: exactly one observer type
  // warrants band attainment, and it is the attester. Without this, a JSON-only
  // edit could hand a self, witness or automated observer the power to produce an
  // attested claim — the relabelling attack the rule exists to stop.
  const BAND_ATTAINMENT = "that the descriptor is satisfied at the named band";
  const holds = (xs) => (xs ?? []).some((x) => x.toLowerCase().includes(BAND_ATTAINMENT));

  for (const obs of evidenceLayer.observers ?? []) {
    if (!obs.id?.startsWith("OMBS.OB.")) fail("evidence-layer", `observer type id "${obs.id}" must be namespaced OMBS.OB.<XX>`);
    if (!obs.name || !obs.definition) fail("evidence-layer", `${obs.id} needs both a name and a definition`);
    if (!obs.warrants?.length) fail("evidence-layer", `${obs.id} does not say what it warrants`);
    if (!obs.doesNotWarrant?.length) fail("evidence-layer", `${obs.id} does not say what it does NOT warrant`);

    const isAttester = obs.id === ATTESTER;
    if (obs.warrantsBandAttainment !== isAttester) {
      fail(
        "standing",
        `${obs.id} declares warrantsBandAttainment=${obs.warrantsBandAttainment}; only ${ATTESTER} may warrant band attainment (OMBS.EV.STAND)`,
      );
    }
    if (holds(obs.warrants) !== isAttester) {
      fail(
        "standing",
        isAttester
          ? `${obs.id} no longer warrants band attainment — the attested tier would have no observer (OMBS.EV.STAND)`
          : `${obs.id} warrants "${BAND_ATTAINMENT}"; only ${ATTESTER} may (OMBS.EV.STAND)`,
      );
    }
    if (holds(obs.doesNotWarrant) === isAttester) {
      fail(
        "standing",
        isAttester
          ? `${obs.id} lists band attainment under doesNotWarrant, contradicting its own warrants (OMBS.EV.STAND)`
          : `${obs.id} must state that it does NOT warrant "${BAND_ATTAINMENT}" (OMBS.EV.STAND)`,
      );
    }
  }

  for (const id of REQUIRED_RULES) {
    if (!RULE_IDS.has(id)) fail("standing", `${id} is missing from evidenceLayer.admissibility — the warrant model depends on it`);
  }
  for (const id of REQUIRED_OBSERVERS) {
    if (!OBSERVER_IDS.has(id)) fail("standing", `${id} is missing from evidenceLayer.observers — the warrant model depends on it`);
  }
  for (const rule of evidenceLayer.admissibility ?? []) {
    if (!rule.id?.startsWith("OMBS.EV.")) fail("evidence-layer", `admissibility rule id "${rule.id}" must be namespaced OMBS.EV.<XXX>`);
    if (!rule.name || !rule.rule) fail("evidence-layer", `${rule.id} needs both a name and a rule statement`);
  }

  for (const [key, entry] of Object.entries(BIBLIOGRAPHY)) {
    if (!entry.citation) fail("citations", `bibliography entry "${key}" has no citation string`);
    if (!entry.title) fail("citations", `bibliography entry "${key}" has no title`);
    if (!entry.doi && !entry.url) {
      fail("citations", `bibliography entry "${key}" has neither a doi nor a url — a citation must be resolvable`);
    }
    if (entry.title && !prose.includes(entry.title)) {
      fail("citations", `bibliography entry "${key}" ("${entry.title}") does not appear in ${VERSION_DIR}/STANDARD.md §11`);
    }
  }

  // ----------------------------------------------------------- 6. prose parity

  // A code token in prose: OMBS. followed by dot-separated uppercase/numeric
  // segments. OMBS@0.3.0 does not match because of the "@". The trailing
  // lookahead drops namespace notation rather than codes: format templates
  // (`OMBS.EF.<form>`) and wildcards (`OMBS.OB.*`) name a namespace, and a
  // namespace has no entry of its own in standards.json.
  const CODE_IN_PROSE = /\bOMBS(?:\.[A-Z0-9]{1,5})+\b(?!\.[<*])/g;
  const proseCodes = new Set(prose.match(CODE_IN_PROSE) ?? []);

  const missingFromJson = [...proseCodes].filter((c) => !allJsonCodes.has(c)).sort();
  for (const code of missingFromJson) {
    fail("parity", `${code} appears in ${VERSION_DIR}/STANDARD.md but is not defined in standards.json`);
  }

  const missingFromProse = [...allJsonCodes].filter((c) => !proseCodes.has(c)).sort();
  for (const code of missingFromProse) {
    fail("parity", `${code} is defined in standards.json but never appears in ${VERSION_DIR}/STANDARD.md`);
  }

  // Descriptor text itself, not just the code. §8 is normative; standards.json
  // is what machines ingest. An adopter reading the JSON must get the same
  // descriptor as an adopter reading the prose, or the two produce different
  // data from the same standard. Markdown emphasis is normalized away.
  const descriptorSection = prose.slice(prose.indexOf("## 8. Evidence Descriptors"));
  const proseDescriptors = new Map();
  for (const line of descriptorSection.split("\n")) {
    const m = line.match(/^- `(OMBS[A-Z0-9.]+)` — (.+)$/);
    if (m) proseDescriptors.set(m[1], m[2].replace(/\*/g, ""));
  }

  for (const unit of units) {
    for (const c of unit.components) {
      const fromProse = proseDescriptors.get(c.id);
      if (fromProse === undefined) {
        fail("descriptors", `${c.id} has no evidence-descriptor line in ${VERSION_DIR}/STANDARD.md §8`);
      } else if (fromProse !== c.descriptor) {
        fail(
          "descriptors",
          `${c.id} descriptor differs between prose and JSON\n` +
            `             prose: ${fromProse}\n` +
            `             json : ${c.descriptor}`,
        );
      }
    }
  }
  for (const id of proseDescriptors.keys()) {
    if (!componentIds.has(id)) {
      fail("descriptors", `${VERSION_DIR}/STANDARD.md §8 lists a descriptor for ${id}, which is not a component in standards.json`);
    }
  }

  // The same treatment for the evidence layer's own semantic text. Without this
  // the layer is only existence-checked: its definitions, warrants and rules
  // could be reversed in the JSON and nothing would notice — including a flip of
  // the witness/attester split, which is the whole point of the layer.
  const section = (heading) => {
    const start = prose.indexOf(heading);
    if (start === -1) return "";
    const next = prose.indexOf("\n#", start + heading.length);
    return prose.slice(start, next === -1 ? prose.length : next);
  };

  // A prose table cell, normalised: markdown emphasis and code ticks removed.
  const cell = (s) => s.replace(/[`*]/g, "").trim();

  // A JSON string list, rendered the one way the prose is allowed to render it.
  const renderList = (xs) => {
    const joined = xs.join("; ");
    return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
  };

  const tableRows = (text) => {
    const rows = new Map();
    for (const line of text.split("\n")) {
      if (!line.startsWith("|")) continue;
      const cells = line.split("|").slice(1, -1).map(cell);
      if (cells[0]?.startsWith("OMBS.")) rows.set(cells[0], cells);
    }
    return rows;
  };

  const cmp = (id, field, expected, actual) => {
    if (actual === undefined) {
      fail("evidence-parity", `${id}: ${field} has no matching cell in ${VERSION_DIR}/STANDARD.md §8.1`);
    } else if (cell(String(expected)) !== actual) {
      fail(
        "evidence-parity",
        `${id}: ${field} differs between prose and JSON\n` +
          `             prose: ${actual}\n` +
          `             json : ${cell(String(expected))}`,
      );
    }
  };

  const formsProse = tableRows(section("#### 8.1.1 Evidence forms"));
  for (const f of evidenceLayer.forms ?? []) {
    const row = formsProse.get(f.id);
    if (!row) {
      fail("evidence-parity", `${f.id} has no row in the §8.1.1 evidence-forms table`);
      continue;
    }
    cmp(f.id, "name", f.name, row[1]);
    cmp(f.id, "definition", f.definition, row[2]);
    cmp(f.id, "exists", f.exists, row[3]);
  }
  for (const id of formsProse.keys()) {
    if (!FORM_IDS.has(id)) fail("evidence-parity", `§8.1.1 lists ${id}, which is not in evidenceLayer.forms`);
  }

  const observersSection = section("#### 8.1.2 Observer types");
  const observersProse = tableRows(observersSection);
  for (const o of evidenceLayer.observers ?? []) {
    const row = observersProse.get(o.id);
    if (!row) {
      fail("evidence-parity", `${o.id} has no row in the §8.1.2 observer-types table`);
      continue;
    }
    cmp(o.id, "name", o.name, row[1]);
    cmp(o.id, "warrants", renderList(o.warrants), row[2]);
    cmp(o.id, "doesNotWarrant", renderList(o.doesNotWarrant), row[3]);
    // definition and mustRecord live in the §8.1.2 bullet list, not the table.
    if (!cell(observersSection).includes(cell(o.definition))) {
      fail("evidence-parity", `${o.id}: definition does not appear verbatim in §8.1.2\n             json : ${o.definition}`);
    }
    const records = `Records: ${o.mustRecord.join("; ")}.`;
    if (!cell(observersSection).includes(cell(records))) {
      fail("evidence-parity", `${o.id}: mustRecord does not appear verbatim in §8.1.2\n             json : ${records}`);
    }
  }
  for (const id of observersProse.keys()) {
    if (!OBSERVER_IDS.has(id)) fail("evidence-parity", `§8.1.2 lists ${id}, which is not in evidenceLayer.observers`);
  }

  const rulesProse = tableRows(section("#### 8.1.3 Admissibility rules"));
  for (const r of evidenceLayer.admissibility ?? []) {
    const row = rulesProse.get(r.id);
    if (!row) {
      fail("evidence-parity", `${r.id} has no row in the §8.1.3 admissibility table`);
      continue;
    }
    cmp(r.id, "name", r.name, row[1]);
    cmp(r.id, "rule", r.rule, row[2]);
  }
  for (const id of rulesProse.keys()) {
    if (!RULE_IDS.has(id)) fail("evidence-parity", `§8.1.3 lists ${id}, which is not in evidenceLayer.admissibility`);
  }

  // Anchor statements are normative prose too, and appear in §4–§6.
  for (const unit of units) {
    if (unit.anchorStatement && !prose.includes(unit.anchorStatement)) {
      fail(
        "evidence-parity",
        `${unit.anchor}: anchorStatement does not appear verbatim in ${VERSION_DIR}/STANDARD.md\n` +
          `             json : ${unit.anchorStatement}`,
      );
    }
  }

  // ------------------------------------------------------------- 7. references

  for (const fw of crosswalks.frameworks ?? []) {
    for (const m of fw.mappings ?? []) {
      if (!allJsonCodes.has(m.ombs)) {
        fail("refs", `crosswalks.json framework "${fw.id}" maps ${m.ombs}, which is not a code in standards.json`);
      }
    }
  }
  for (const b of crosswalks.boundaries ?? []) {
    for (const code of b.ombs ?? []) {
      if (!allJsonCodes.has(code)) {
        fail("refs", `crosswalks.json boundary "${b.framework}" names ${code}, which is not a code in standards.json`);
      }
    }
  }

  // ── conformance levels (§1.7) ────────────────────────────────────────────
  // Core's required set is the shared spine. If a dimension is ever added to or
  // removed from that spine, this check forces the conformance block to move with
  // it rather than silently describing a spine that no longer exists.
  const CORE_SPINE = CORE_SPINE_BY_VERSION[VERSION];
  const conformance = standards.conformance;
  if (!CORE_SPINE) {
    fail(
      "conformance",
      `no Core spine is declared for ${VERSION} in scripts/check-parity.mjs (CORE_SPINE_BY_VERSION).\n` +
        "             The spine is what every Core declaration asserts, so a new version must state it\n" +
        "             in the checker as well as in standards.json — deriving it from the file under test\n" +
        "             would assert nothing. Add the entry and say in the CHANGELOG whether the spine moved.",
    );
  }
  if (!conformance?.levels?.length) {
    fail("conformance", "standards.json has no conformance.levels — §1.7 defines two levels");
  } else {
    const byId = new Map(conformance.levels.map((l) => [l.id, l]));
    for (const id of ["core", "extended"]) {
      if (!byId.has(id)) fail("conformance", `conformance.levels is missing "${id}" (§1.7 defines Core and Extended)`);
    }
    const anchors = new Set();
    for (const dom of standards.domains) for (const dim of dom.dimensions) anchors.add(dim.anchor);
    const domainIds = new Set(standards.domains.map((d) => d.id));

    for (const lvl of conformance.levels) {
      for (const a of [...(lvl.requiredDimensions ?? []), ...(lvl.conditionalDimensions ?? [])]) {
        if (!anchors.has(a)) fail("conformance", `conformance level "${lvl.id}" names ${a}, which is not a dimension anchor`);
      }
      for (const dm of lvl.requiredDomains ?? []) {
        if (!domainIds.has(dm)) fail("conformance", `conformance level "${lvl.id}" names domain "${dm}", which does not exist`);
      }
      if (!prose.includes(lvl.name)) {
        fail("conformance", `conformance level "${lvl.name}" does not appear in STANDARD.md prose`);
      }
    }
    const core = byId.get("core");
    if (core && CORE_SPINE) {
      const got = [...(core.requiredDimensions ?? [])].sort().join(",");
      if (got !== [...CORE_SPINE].sort().join(",")) {
        fail("conformance", `Core requiredDimensions must be exactly the shared spine declared for ${VERSION} (${CORE_SPINE.join(", ")}); got ${got || "nothing"}`);
      }
    }
    if (core) {
      if (core.requiredDomains?.length) fail("conformance", "Core must require no domains — that is what distinguishes it from Extended (§1.7)");
      if (core.requiresEvidenceLayer !== true) fail("conformance", "Core must require the evidence layer; without it claims are not comparable (OMBS.EV.DISC)");
    }
    const ext = byId.get("extended");
    if (ext) {
      if (ext.domainsTakenWhole !== true) fail("conformance", "Extended must take a domain whole — §1.7 forbids partial domains");
      if (!(ext.requiredDomains ?? []).length) fail("conformance", "Extended must name the domains it may be declared against");
    }
    if (!/### 1\.7 Conformance levels/.test(prose)) {
      fail("conformance", "STANDARD.md has no §1.7 Conformance levels section, but standards.json declares conformance levels");
    }
  }

  return {
    versionDir: VERSION_DIR,
    version: VERSION,
    isDraft,
    components: componentIds.size,
    dimensions: units.filter((u) => !u.parent).length,
    subDimensions: units.filter((u) => u.parent).length,
    anchors: units.length,
    codes: allJsonCodes.size,
    forms: FORM_IDS.size,
    observers: OBSERVER_IDS.size,
    rules: RULE_IDS.size,
    bibliography: Object.keys(BIBLIOGRAPHY).length,
    conformanceLevels: standards.conformance?.levels?.length ?? 0,
    newDimensions: units.filter((u) => u.introducedIn === VERSION).length,
    newComponents,
    citationTodos,
  };
}

// --------------------------------------------- published-site copies (note)
// docs/ mirrors what is PUBLISHED. A draft directory is not published, so it
// must not make the site look stale.

for (const f of ["standards.json", "crosswalks.json"]) {
  const p = join(ROOT, "docs", f);
  if (!existsSync(p)) continue;
  const siteVersion = readJson(p).ombsVersion ?? readJson(p).version;
  if (siteVersion !== PUBLISHED.version) {
    notes.push(
      `docs/${f} (the published-site copy) reads ${siteVersion}, current published standard is ${PUBLISHED.version}.`,
    );
  }
}
if (DRAFT) {
  notes.push(
    `${DRAFT.versionDir}/ is a proposal, not a release: it is checked as a standard but README.md and docs/ still describe ${PUBLISHED.versionDir}.`,
  );
}

// ------------------------------------------------------------------ report

// One number when both directories agree, "a/b" when they differ. The trailing
// "(dir, dir)" is printed once, on the layout line, rather than on every row.
const n = (fn) => [...new Set(stats.map(fn))].join("/");
const sum = (fn) => stats.reduce((a, s) => a + fn(s), 0);
const DIRS = stats.map((s) => s.versionDir).join(" / ");
const ALL_TODOS = stats.flatMap((s) => s.citationTodos);

const CHECKS = [
  [
    "layout",
    DRAFT
      ? `published ${PUBLISHED.versionDir}/ + draft ${DRAFT.versionDir}/ — every check below runs against both; counts read ${DIRS}`
      : `one standard directory: ${PUBLISHED.versionDir}/`,
  ],
  ["version", `${n((s) => s.version)} agree across standards.json, crosswalks.json, STANDARD.md; README.md and docs/ pinned to the published ${PUBLISHED.version}`],
  ["ids", `${n((s) => s.components)} component ids well-formed and unique (${sum((s) => s.components)} checked)`],
  ["self-describe", `${n((s) => s.components)} nodes carry domain + dimension + gradeBand + evidence forms + observer inline`],
  ["bands", `${n((s) => s.dimensions)} dimensions + ${n((s) => s.subDimensions)} sub-dimensions cover all four grade bands`],
  ["parity", `${n((s) => s.codes)} codes match between STANDARD.md prose and standards.json, both directions`],
  ["descriptors", `${n((s) => s.components)} descriptor texts identical between STANDARD.md §8 and standards.json`],
  [
    "evidence-parity",
    `${n((s) => s.forms + s.observers + s.rules)} evidence-layer definitions and ${n((s) => s.anchors)} anchor statements identical between prose and JSON`,
  ],
  ["standing", `only ${ATTESTER} warrants band attainment; the warrant model's ${REQUIRED_RULES.length} rules and ${REQUIRED_OBSERVERS.length} observer types are present`],
  ["refs", "crosswalk and boundary references resolve"],
  ["evidence-layer", `${n((s) => s.forms)} evidence forms, ${n((s) => s.observers)} observer types, ${n((s) => s.rules)} admissibility rules`],
  [
    "citations",
    `${n((s) => s.bibliography)} bibliography entries carry a DOI or URL and appear in §11; ` +
      `${n((s) => s.newDimensions)} dimensions + ${n((s) => s.newComponents)} components declaring introducedIn=${n((s) => s.version)} ` +
      `each carry a citation or a declared gap` +
      (ALL_TODOS.length ? ` (${ALL_TODOS.length} declared TODO(cite): ${ALL_TODOS.join(", ")})` : ""),
  ],
  [
    "conformance",
    `${n((s) => s.conformanceLevels)} conformance levels; Core is exactly the spine declared for ${n((s) => s.version)} (${n((s) => (CORE_SPINE_BY_VERSION[s.version] ?? []).length)} dimensions) and requires no domain`,
  ],
];

for (const [name, summary] of CHECKS) {
  const hits = failures.filter((f) => f.check === name);
  if (hits.length === 0) {
    console.log(`  ok   ${name.padEnd(14)} ${summary}`);
  } else {
    console.log(`  FAIL ${name.padEnd(14)} ${hits.length} problem${hits.length === 1 ? "" : "s"}`);
    for (const h of hits) console.log(`         - ${h.message}`);
  }
}

for (const n of notes) console.log(`  note ${"".padEnd(14)} ${n}`);

if (failures.length > 0) {
  console.error(`\ncheck-parity: ${failures.length} failure${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-parity: OMBS v${PUBLISHED.version}${DRAFT ? ` + v${DRAFT.version} (draft)` : ""} — all checks passed`,
);
