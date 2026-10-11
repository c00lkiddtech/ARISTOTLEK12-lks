/** Copyright (C) Sergeant Laboratories, Inc. 2026 All rights reserved.
 */
// First-party shim (not vendored from k12-script-injection, not touched by
// script-injection-update.yaml). Injected immediately before MAIN-world filter
// scripts that call DOMParser.parseFromString with a plain string. Sites that
// send `Content-Security-Policy: require-trusted-types-for 'script'` (e.g.
// youtube.com) block that call once we run in the page's own realm instead of
// the extension's isolated world, since isolated-world scripts are normally
// exempt from a page's Trusted Types enforcement. JIRA: K12-5403
(() => {
  if (!window.trustedTypes || !window.trustedTypes.createPolicy) {
    return;
  }

  try {
    const policy = window.trustedTypes.createPolicy("aristotle-k12-domparser", {
      createHTML: (html) => html,
    });
    const nativeParseFromString = DOMParser.prototype.parseFromString;
    DOMParser.prototype.parseFromString = function (str, type, ...rest) {
      if (typeof str === "string") {
        return nativeParseFromString.call(this, policy.createHTML(str), type, ...rest);
      }
      return nativeParseFromString.call(this, str, type, ...rest);
    };
  } catch (e) {
    // A `trusted-types` CSP directive may restrict allowed policy names, or a
    // policy with this name may already exist. Fail open and leave the
    // native parseFromString behavior (and its TrustedHTML requirement) intact.
  }
})();
