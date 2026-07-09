const DRAFT_PREFIX = "checklist-draft-";

/**
 * Scan all field ids in a draft and return the highest numeric suffix found.
 * This lets FormBuilder seed nextId so new fields never collide with
 * ids that were already persisted in localStorage before a hard refresh.
 *
 * Field ids are expected to follow the pattern  f<number>  (e.g. "f203").
 * Returns 200 (the default start) when the draft is empty or absent.
 */
export function getMaxId(draftKey) {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${draftKey}`);
    if (!raw) return 200;
    const parsed = JSON.parse(raw);
    const fields = Array.isArray(parsed.fields) ? parsed.fields : [];
    let max = 200;

    for (const f of fields) {
      const n = parseInt(String(f.id).replace(/^\D+/, ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return max;
  } catch {
    return 200;
  }
}

/**
 * Return a stable session key for "new" (unsaved) forms.
 * We store a UUID in sessionStorage so that:
 *  - the same browser tab across a hard-refresh reuses the same draft key
 *    (sessionStorage survives Ctrl+Shift+R within the tab)
 *  - a brand-new tab starts with a fresh key and won't overwrite a draft
 *    that another tab is still working on
 */

export function getNewFormSessionKey() {
  const SK = "checklist-new-session-id";
  let id = sessionStorage.getItem(SK);

  if (!id) {
    id = `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem(SK, id);
  }
  return id;
}

/**
 * Read the draft synchronously from localStorage.
 * Call this inside useState() lazy initializer so fields are restored
 * before the very first render — no flash of empty canvas.
 */
export function readDraft(draftKey) {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${draftKey}`);

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.fields) && parsed.fields.length > 0) return parsed.fields;
  } catch {
    // corrupt data — ignore
  }
  return null;
}

/**
 * Write fields to localStorage immediately — no debounce, no async.
 * Called directly from updateFields() in FormBuilder so every drag,
 * delete, or property change is persisted before the user can refresh.
 */
export function writeDraft(draftKey, fields, meta) {
  try {
    localStorage.setItem(
      `${DRAFT_PREFIX}${draftKey}`,
      JSON.stringify({ fields, meta, savedAt: new Date().toISOString() }),
    );
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

/**
 * Remove the draft from localStorage.
 */
export function clearDraft(draftKey) {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${draftKey}`);
  } catch {}
}

/**
 * Check whether a draft exists for the given key.
 */
export function hasDraft(draftKey) {
  return !!localStorage.getItem(`${DRAFT_PREFIX}${draftKey}`);
}
