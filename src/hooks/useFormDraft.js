import { useEffect, useRef, useCallback } from "react";

const DRAFT_PREFIX = "checklist-draft-";
const DEBOUNCE_MS = 600;

/**
 * Persists the builder's flat `fields` array + form meta to localStorage.
 * Rehydrates on mount if a matching draft exists.
 *
 * @param {string}   draftKey   – unique identifier (e.g. form id or "new")
 * @param {Array}    fields     – current flat fields array
 * @param {Function} setFields  – setter to rehydrate fields on mount
 * @param {object}   meta       – { title, description } — saved alongside fields
 * @returns {{ clearDraft, hasDraft, loadDraft }}
 */

export function useFormDraft(draftKey, fields, setFields, meta) {
  const storageKey = `${DRAFT_PREFIX}${draftKey}`;
  const saveTimer = useRef(null);
  const isMountRef = useRef(true);

  // ── Rehydrate on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isMountRef.current) return;
    isMountRef.current = false;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.fields) && parsed.fields.length > 0) {
          setFields(parsed.fields);
        }
      }
    } catch {
      // corrupt data – ignore
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced auto-save on every fields change ──────────────────────────
  useEffect(() => {
    if (isMountRef.current) return; // skip during initial mount hydration

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const draft = {
          fields,
          meta,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {
        // localStorage full or unavailable – silently skip
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, meta, storageKey]);

  const clearDraft = useCallback(() => {
    clearTimeout(saveTimer.current);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const hasDraft = useCallback(() => {
    return !!localStorage.getItem(storageKey);
  }, [storageKey]);

  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [storageKey]);

  return { clearDraft, hasDraft, loadDraft };
}
