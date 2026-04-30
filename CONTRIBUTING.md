# Contributing to OMBS

Thank you for considering a contribution. OMBS is a draft standard. Community review is what turns it into a usable one.

## Types of contributions welcomed

- **Editorial** (typos, clarity, examples) — open a PR directly.
- **Crosswalk additions** (mapping OMBS codes to other frameworks) — open a PR with citation.
- **Evidence descriptor refinements** — open an issue first to discuss; PRs welcome with classroom or research grounding.
- **New dimensions or codes** — open an issue with rationale and at least one peer-reviewed citation. Expect substantive discussion.
- **Translations** — open an issue to coordinate; translations live in `v[VERSION]/translations/[locale]/`.
- **Crosswalks to international standards** (Australian Curriculum, IB, OECD, etc.) — explicitly invited.

## What we will not accept

- Removal of dimensions without a major version bump and deprecation pathway.
- Changes that narrow the standard to a single subject area, age band, or pedagogy.
- Branded content or product placement.
- Code IDs renamed without a deprecation alias.

## Pull request expectations

- Cite sources for any substantive claim.
- If the change affects machine-readable files (`standards.json`, `crosswalks.json`), update them in the same PR. CI verifies parity between the prose and the JSON.
- Add a `CHANGELOG.md` entry under "Unreleased."
- Sign off your commit (`git commit -s`) — the project follows Developer Certificate of Origin (DCO) v1.1.

## Discussion forums

- **Issues:** technical discussion of specific codes, descriptors, crosswalks.
- **Discussions:** broader questions of scope, governance, philosophy.

## Code of conduct

Adapted from the Contributor Covenant 2.1. Be respectful, assume good faith, prioritize learners' interests over institutional or vendor interests.
