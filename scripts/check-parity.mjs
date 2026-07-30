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
//   layout          exactly one v*/ standard directory (the move-forward pattern)
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
//
// What this CANNOT catch, by construction: a code removed from BOTH the prose
// and the JSON in the same change. An internal-consistency checker has no
// baseline to compare against, so green never means "nothing was deleted."
// That remains PR review's job, permanently.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const notes = [];
const fail = (check, message) => failures.push({ check, message });

// ---------------------------------------------------------------- 1. layout

const versionDirs = readdirSync(ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^v\d+\.\d+\.\d+$/.test(e.name))
  .map((e) => e.name)
  .sort();

if (versionDirs.length !== 1) {
  console.error(
    `[layout] expected exactly one v<x.y.z>/ standard directory, found ${
      versionDirs.length
    }: ${versionDirs.join(", ") || "(none)"}\n` +
      "         Superseded versions are moved forward, not duplicated (CHANGELOG 0.2.0);\n" +
      "         prior versions stay citable through git tags and history.",
  );
  process.exit(1);
}

const VERSION_DIR = versionDirs[0];
const VERSION = VERSION_DIR.slice(1);
const DIR = join(ROOT, VERSION_DIR);

for (const f of ["STANDARD.md", "standards.json", "crosswalks.json"]) {
  if (!existsSync(join(DIR, f))) {
    console.error(`[layout] ${VERSION_DIR}/${f} is missing`);
    process.exit(1);
  }
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const standards = readJson(join(DIR, "standards.json"));
const crosswalks = readJson(join(DIR, "crosswalks.json"));
const prose = readFileSync(join(DIR, "STANDARD.md"), "utf8");
const readme = readFileSync(join(ROOT, "README.md"), "utf8");

// --------------------------------------------------------------- 2. version

const versionClaims = [
  ["standards.json .version", standards.version],
  ["standards.json .ombsVersion", standards.ombsVersion],
  ["crosswalks.json .ombsVersion", crosswalks.ombsVersion],
  ["STANDARD.md header", (prose.match(/^\*\*Version:\*\*\s*([\d.]+)/m) || [])[1]],
  ["STANDARD.md footer", (prose.match(/End of OMBS v([\d.]+)/) || [])[1]],
  ["STANDARD.md Appendix A.5 example", (prose.match(/`OMBS@([\d.]+)`/) || [])[1]],
  ["README.md status line", (readme.match(/\*\*Status:\*\*\s*Draft v([\d.]+)/) || [])[1]],
  ["README.md citation line", (readme.match(/OMBS\), v([\d.]+)\./) || [])[1]],
  ["README.md cite-as line", (readme.match(/`OMBS v([\d.]+) \(\d{4}\)`/) || [])[1]],
];

for (const [where, claimed] of versionClaims) {
  if (claimed !== VERSION) {
    fail(
      "version",
      `${where} reads ${claimed ?? "(not found)"}, expected ${VERSION} (from ${VERSION_DIR}/)`,
    );
  }
}

for (const link of readme.match(/v\d+\.\d+\.\d+\/[A-Za-z.]+/g) || []) {
  if (!link.startsWith(`${VERSION_DIR}/`)) {
    fail("version", `README.md links ${link}, expected a ${VERSION_DIR}/ path`);
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
const ATTESTER = "OMBS.OB.AT";
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

// The load-bearing ids, pinned. Deleting a code from BOTH the prose and the
// JSON is otherwise invisible (see the header note); for the rules and observer
// types that carry the warrant model, silent removal is not an acceptable
// failure mode. Additions are free; these five and four may not vanish.
const REQUIRED_RULES = ["OMBS.EV.DISC", "OMBS.EV.SEQ", "OMBS.EV.WARR", "OMBS.EV.CONS", "OMBS.EV.STAND"];
const REQUIRED_OBSERVERS = ["OMBS.OB.SF", "OMBS.OB.RC", "OMBS.OB.WT", "OMBS.OB.AT", "OMBS.OB.AD"];
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

// --------------------------------------------- published-site copies (note)

for (const f of ["standards.json", "crosswalks.json"]) {
  const p = join(ROOT, "docs", f);
  if (!existsSync(p)) continue;
  const siteVersion = readJson(p).ombsVersion ?? readJson(p).version;
  if (siteVersion !== VERSION) {
    notes.push(
      `docs/${f} (the published-site copy) reads ${siteVersion}, current standard is ${VERSION}.`,
    );
  }
}

// ------------------------------------------------------------------ report

const CHECKS = [
  ["layout", `one standard directory: ${VERSION_DIR}/`],
  ["version", `version ${VERSION} agrees across standards.json, crosswalks.json, STANDARD.md, README.md`],
  ["ids", `${componentIds.size} component ids well-formed and unique`],
  ["self-describe", `${componentIds.size} nodes carry domain + dimension + gradeBand + evidence forms + observer inline`],
  [
    "bands",
    `${units.filter((u) => !u.parent).length} dimensions + ${units.filter((u) => u.parent).length} sub-dimensions cover all four grade bands`,
  ],
  ["parity", `${allJsonCodes.size} codes match between STANDARD.md prose and standards.json, both directions`],
  ["descriptors", `${componentIds.size} descriptor texts identical between STANDARD.md §8 and standards.json`],
  [
    "evidence-parity",
    `${FORM_IDS.size + OBSERVER_IDS.size + RULE_IDS.size} evidence-layer definitions and ${units.length} anchor statements identical between prose and JSON`,
  ],
  ["standing", `only ${ATTESTER} warrants band attainment; the warrant model's ${REQUIRED_RULES.length} rules and ${REQUIRED_OBSERVERS.length} observer types are present`],
  ["refs", "crosswalk and boundary references resolve"],
  ["evidence-layer", `${FORM_IDS.size} evidence forms, ${OBSERVER_IDS.size} observer types, ${RULE_IDS.size} admissibility rules`],
  [
    "citations",
    `${Object.keys(BIBLIOGRAPHY).length} bibliography entries carry a DOI or URL and appear in §11; codes new in ${VERSION} carry citations`,
  ],
  [
    "conformance",
    `${standards.conformance?.levels?.length ?? 0} conformance levels; Core is exactly the shared spine and requires no domain`,
  ],
];

// ── conformance levels (§1.7) ────────────────────────────────────────────
// Core's required set is the shared spine. If a dimension is ever added to or
// removed from that spine, this check forces the conformance block to move with
// it rather than silently describing a spine that no longer exists.
const CORE_SPINE = ["OMBS.S.DF", "OMBS.S.DR", "OMBS.S.TS", "OMBS.S.IT", "OMBS.S.SH"];
const conformance = standards.conformance;
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
  if (core) {
    const got = [...(core.requiredDimensions ?? [])].sort().join(",");
    if (got !== [...CORE_SPINE].sort().join(",")) {
      fail("conformance", `Core requiredDimensions must be exactly the shared spine (${CORE_SPINE.join(", ")}); got ${got || "nothing"}`);
    }
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

console.log(`\ncheck-parity: OMBS v${VERSION} — all checks passed`);
