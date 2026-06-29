const DRAFT_PREFIX = "checklist-draft-";

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
