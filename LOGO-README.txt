LOGO + BRAND COLORS — matched to your logo
===========================================
No new npm deps. No SQL.

COLORS (sampled from your logo file, not guessed)
- Navy  #082f59  -> now the site ACCENT (all CTAs, links, progress, focus rings).
  Contrast on ivory: 12.25:1 (excellent). White on navy: 13.45:1.
- Gold  #f8ae13  -> a DECORATIVE secondary. Used ONLY where contrast allows:
  the Final CTA button is now GOLD with NAVY text (navy-on-gold = 7.08:1, passes).
  Gold is NEVER used for text on the light background (1.73:1 = would fail) - that
  restraint is deliberate, not an oversight.
- Everything else (ivory bg, ink text) stays - it already complements navy+gold.

LOGO ASSETS (generated from your file)
- public/hope-logo.png  -> full lockup (used in the footer)
- public/hope-mark.png  -> just the heart/people/sun mark (header, mobile menu,
  preloader)
- src/app/icon.png      -> favicon (the mark). Next uses this automatically.

APPLY
1. Extract into project root, overwrite when asked. (Includes 3 PNGs - make sure
   public/hope-logo.png, public/hope-mark.png, src/app/icon.png all landed.)
2. ** DELETE src/app/favicon.ico ** (the old create-next-app default) so your Hope
   icon shows in the browser tab instead of the Next logo. A zip can't remove it.
3. npm run dev.

WHAT YOU'LL SEE
- Header: logo mark + "Hope" wordmark.
- Mobile menu: mark + "Hope".
- Preloader: the mark fades in/out on load.
- Footer: the full logo.
- Every button/link/funding bar is now the logo navy.
- The big Final CTA has a gold button that pops against the navy panel.
- Browser tab shows the Hope mark as the favicon.

VERIFY
- Load the site: colors should read navy + ivory with gold only on the final CTA.
- Check the tab icon updated (may need a hard refresh / clear cache).
- Re-run your keyboard + contrast checks if you want - navy is higher contrast
  than the old denim, so a11y only improved.

PUSH (separate lines - PowerShell)
   git add -A
   git commit -m "Brand: logo + navy/gold colors matched to logo"
   git push

NOTE: this was a brand pass, not a plan day. Your Day 1-38 build is done. The only
remaining step is still the real Ziina integration (the finale).
