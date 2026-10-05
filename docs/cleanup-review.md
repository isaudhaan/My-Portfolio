# Repository cleanup and performance review

Checkpoint: `d76f143`. The approved design and contact implementation are preserved.

## Dependency inventory

| Resource | Classification | Evidence / decision |
| --- | --- | --- |
| `style.css` | USED | Linked by index.html; active layout, typography, states, media queries and accessibility rules. Preserved unchanged. |
| `css/bootstrap.min.css` | USED | Linked by index.html. Disabling it in Chrome at all six widths changes contact form geometry and capability-heading line height. Retained; no rewrite to eliminate it. |
| `js/custom.js` | USED | Deferred script implements navigation, role rotation, reveals, disclosure and reduced motion. Preserved unchanged. |
| `js/contact_me.js` | USED | Deferred script implements the hardened form contract. Preserved byte-for-byte. No duplicate active contact handler. |
| `js/all.js` | UNUSED | Unlinked bundled jQuery/Bootstrap JavaScript. Neither active script uses jQuery or Bootstrap plugins. Deleted. |
| Remaining legacy JS | UNUSED | No active imports, script injection or references. Old carousel, lightbox, filtering, parallax/video, typed headlines, scrolling, animation, validation, map, retina and feature-detection functionality is absent or independently implemented. Deleted. |
| Remaining legacy CSS | UNUSED | Not linked or imported by the active resource graph; template versions, responsive rules, camera/carousel, animation, lightbox and icon styles. Deleted, including unloaded css/custom.css. |
| Font Awesome, Flaticon, Glyphicons fonts | UNUSED | No active @font-face rules or icon classes; arrows are text and controls use CSS. Deleted with unused font stylesheets. |
| System fonts | USED | Segoe UI/platform sans-serif, Cascadia Code/platform monospace, and Georgia quote mark. No downloaded font files or requests. Existing weights preserved. |
| Portrait and both dashboard screenshots | USED | Actual img references; intrinsic dimensions, lazy loading, async decoding and alt text preserved. |
| Both project login screenshots | RETAINED SOURCE ASSETS | Intentionally non-public project assets; preserved despite no public references. |
| images/prettyPhoto/** | UNUSED | Theme sprites, loaders and controls referenced only by the deleted lightbox code/styles. Deleted. |
| uploads/banner-01.jpg, uploads/background-banner.jpg | UNCERTAIN | No active references, but historical asset purpose is insufficiently established. Retained conservatively. |
| images/bg.png, images/country-quilt-dark.png, images/ajax-loader.gif | UNCERTAIN | No active references; retained rather than inferring provenance from names. |
| Project entry template | RETAINED | Intentional reusable structure from earlier work, not an obsolete template section. |
| CNAME and README.md | RETAINED | Hosting identity and repository documentation; no hosting changes. |

The exact 80 deleted files and their original byte sizes are listed in
`cleanup-deleted-files.json` (1,989,984 bytes total, approximately 1.90 MiB).
These files were already outside the public page's dependency graph: deleting
them reduces repository size, not the bytes requested by this page.

## Performance and regression results

- Before and after: two local CSS requests and two deferred local JS requests.
- No external frontend script, stylesheet or font requests to remove.
- No active CSS or JS was minified, bundled, refactored or replaced.
- Bootstrap removal was evaluated and rejected because it changes approved rendering.
- Project images retain dimensions, lazy loading and async decoding; no asset recompression.
- Tested at 375, 430, 768, 1024, 1280 and 1440 CSS pixels, with screenshot capture.
- Native menu/Escape/anchor behavior, active tracking, role rotation, disclosure keyboard operation, focus and reduced motion were regression checked.
- Contact frontend checks use mocked responses only; no real email was sent.
- PHP and contact JS are byte-for-byte unchanged from the checkpoint.
- No suspicious credential/configuration remnant was identified in the removed template code. Legacy map coordinates and placeholder office information were template examples, not new public content.

No deployment, SEO/content changes, build tooling, new dependencies or PHP/email verification was performed. Recommended next phase: a separate PHP runtime and email-delivery verification after review.
