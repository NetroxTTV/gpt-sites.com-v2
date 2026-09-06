// Safe wrapper around localStorage. Only UI preferences (theme, language) are
// persisted here - never sensitive data. Every failure is logged, never swallowed.

const prefix = "[storage]";

export const storage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.warn(`${prefix} read failed for "${key}"`, error);
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`${prefix} write failed for "${key}"`, error);
      return false;
    }
  },
};
