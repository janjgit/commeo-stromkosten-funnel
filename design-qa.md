# Design QA — COMM Funnel Draft 1

- Source visual truth: `/Users/janjelinek/Documents/Codex/2026-07-20/wir/work/comm-concept.png`
- Implementation screenshots: `/Users/janjelinek/Documents/Codex/2026-07-20/wir/work/comm-desktop-top.png`, `/Users/janjelinek/Documents/Codex/2026-07-20/wir/work/comm-mobile-top.png`, `/Users/janjelinek/Documents/Codex/2026-07-20/wir/work/comm-quiz-success.png`
- Viewports: desktop 1440 × 1000; mobile 390 × 844
- States: landing hero, mobile landing hero, quiz steps 1–6, required-field validation, success state
- Browser: Codex in-app browser at the local prototype URL
- Console: no warnings or errors in the final desktop pass

## Full-view comparison evidence

The concept and implementation were opened together in one visual comparison pass. The implementation preserves the intended dark-petrol/white/red cadence, quiet navigation, two-column industrial hero, three-part proof rail, open white challenge section, dark three-step process, solution system section, FAQ and dedicated dark quiz surface.

## Focused region comparison evidence

Focused comparison covered the desktop hero and first section, mobile hero, and mobile quiz success state. These regions were selected because they contain the highest-risk typography wrapping, responsive CTA behavior, product-image crop, progress state and conversion controls.

## Required fidelity surfaces

- Fonts and typography: the implementation uses a disciplined sans-serif system with equivalent hierarchy, weight and wrapping. The exact generated font is unavailable, but the fallback remains visually consistent and readable. Small controls use explicit sizes and weights.
- Spacing and layout rhythm: hero proportions, proof rail, white-space cadence, dark process band and mobile stacking match the concept. No horizontal overflow at 390 px.
- Colors and tokens: deep petrol, true white, muted steel and red accents are centralized as CSS variables and visually match the concept. No unapproved gradients are used as section decoration; the hero edge blend is limited to image integration.
- Image quality and asset fidelity: official Commeo logo and current source-site product assets are used locally. Images are sharp, correctly contained and do not rely on placeholders or hotlinks.
- Copy and content: hero headline, CTA labels, trust claims, problem framing and quiz labels match the approved concept/user brief. No unsupported savings amount, ROI promise, customer logo or numerical performance claim was added.

## Findings

- No actionable P0/P1/P2 findings remain.
- [P3] The concept depicts a red/black indoor cabinet, while the available current source asset in the hero is a white outdoor system. This is an intentional asset-fidelity choice: using an official current Commeo product is safer than synthesizing an unverified product variant.
- [P3] The generated concept includes illustrative line icons. The implementation uses restrained typographic symbols in the challenge strip; meaning, weight and red accent are preserved without introducing a mismatched third-party icon family.

## Comparison history

- Initial desktop comparison showed the official product render occupying slightly more of the right hero than the concept. Its final containment and bottom alignment were adjusted in CSS and re-captured at 1440 × 1000.
- Initial full-page mobile capture was distorted by the browser's tall-page capture renderer. This was isolated as a capture artifact; a normal 390 × 844 viewport capture confirmed correct width, wrapping, CTA stacking and absence of horizontal overflow.

## Primary interactions tested

- Landing CTA opens `/check.html`.
- Answer selection enables the next action.
- Progress advances through all six questions.
- Back navigation is present after step one.
- Contact fields enforce required values before enabling completion.
- Completion renders the success state and return link.

## Follow-up polish

- Replace the typographic challenge symbols with a final approved COMM icon set if the brand team supplies one.
- Wire the final submit action to the selected CRM/form endpoint once field mapping and consent wording are approved.

final result: passed
