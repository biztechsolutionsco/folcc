# FOLCC bilingual static website starter

**Recommended URLs:** English `https://folcc.ca/`, Traditional Chinese `https://folcc.ca/zh/`.

This starter uses **one shared header and footer**, stored in `/includes/`, loaded through `/js/main.js`. Styles live in `/css/style.css`. Every English page is at the root; Chinese counterparts are under `/zh/`.

## Preview locally

Do **not** double-click the HTML files: shared components use `fetch()`, which can be blocked on `file://` URLs. From this folder run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Upload the contents of this folder to the GitHub repository root (not the outer ZIP directory). GitHub Pages: Settings → Pages → Deploy from a branch → main → / (root).

## Edit content

- `/includes/header.html`: shared desktop/mobile navigation, church brand and donation link.
- `/includes/footer.html`: shared footer.
- `/css/style.css`: shared design.
- `/js/main.js`: language dictionary, menu functionality, language switch and shared component loader.
- Root HTML files: English content.
- `/zh/*.html`: Traditional Chinese content.

## Important before launch

1. This is an initial conversion scaffold, **not** a complete archive or pixel-perfect copy. Some content remains intentionally marked for import.
2. Confirm the church logo/imagery rights and upload real assets to `/images/`; the current brand mark is a temporary placeholder.
3. Confirm service time and contact email. The current English Contact page lists a different start time than Services; starter uses the Services time (10am).
4. Download and import all original devotional PDFs and videos, update expired reading schedules, and preserve existing URLs with appropriate redirects where possible.
5. Donations continue through `https://give.folcc.ca/`; no payments are processed by this site.
6. Contact forms, event registration, and donation admin features are not implemented in this starter.
7. Language switch maps same-named pages, falling back to homepage only if a future page has no counterpart (currently every page has one).
8. For `ch.folcc.ca` → `/zh/`, set up a domain-level **301 redirect** on the old host or Cloudflare; GitHub Pages alone cannot redirect the separate subdomain automatically.
9. When migrating to the live domain, map old WordPress slugs (`/about-us/`, `/daily-devotion/`, etc.) to new URLs; consider retaining those paths to avoid broken links.
10. The `.nojekyll` marker is included so GitHub Pages serves files without Jekyll processing.
