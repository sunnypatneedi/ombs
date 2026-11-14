# Open Making and Building Standard (OMBS)

An open framework for recognizing evidence of learner agency through making.

**Status:** v0.4.0 draft for community review, not a validated assessment or certification.
**Current core draft:** [v0.4.0/STANDARD.md](v0.4.0/STANDARD.md)
**License:** [CC BY-SA 4.0](LICENSE.md)

## What the core contains

- Five maker practices: Define, Investigate, Make, Iterate, Share.
- Eight shifts across a body of work, without universal levels or grade bands.
- Reports connecting claim, evidence, context and interpretation.
- Language for authorship, support, human confirmation and optional review.

OMBS is not a curriculum, rubric or assessment. The Design Guide is in preparation;
the Tool Guide is planned. **No v0.4.0 machine-readable schema ships here.**
Do not relabel the v0.3.0 codes, JSON or crosswalks as v0.4.0.

## Earlier material

The [site](https://sunnypatneedi.github.io/ombs/) and its demo are frozen at v0.3.0.
The [v0.3.0 directory](v0.3.0/) remains here to support those legacy tools;
its [tagged snapshot](https://github.com/sunnypatneedi/ombs/tree/v0.3.0) remains citable.
The incompatible [earlier v0.4 proposal](proposals/0001-building-under-uncertainty.md)
is retained as historical material, not the current core draft.

## Review and verification

See [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md).
Run `node scripts/check-transition.mjs` for repository transition checks.
These checks verify structure and labels, not educational validity, consent compliance,
research claims, governance approval or a completed release. The legacy
`check-parity.mjs` script remains historical tooling for the earlier encoded layout;
it is not the v0.4.0 validator.

Open discussion: withdrawal and retention; attribution of mixed human/AI records;
and the scope and independence of review. This packaging change does not resolve
those design questions, create a release tag or change governance rules.

## Versioning

Semantic versioning. **Breaking changes** (rename/remove codes, change ID format) require a major version bump and a one-version deprecation window. **Additive changes** (new dimensions, new evidence descriptors) bump the minor version. **Editorial changes** (clarifications, typos, crosswalks) bump the patch version.

## Citation

> Open Making and Building Standard (OMBS), v0.4.0, draft for community review. 2026. CC BY-SA 4.0.

Cite the exact commit when referring to an evolving draft.
