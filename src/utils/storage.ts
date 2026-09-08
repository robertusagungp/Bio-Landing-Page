import { UserProfile, StoredResults } from '../types/profile';

const PROFILE_KEY = 'robertus_user_profile_v2';
const RESULTS_KEY = 'robertus_user_results_v2';
const LEGACY_PROFILE_KEY = 'robertus_user_profile_v1';
const LEGACY_RESULTS_KEY = 'robertus_user_results_v1';

// Immediately clean up any stale legacy data from old persistent localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(LEGACY_PROFILE_KEY);
    localStorage.removeItem(LEGACY_RESULTS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(RESULTS_KEY);
  }
} catch (e) {
  // Ignore errors in sandboxed environments
}

// In-memory fallback if sessionStorage is restricted/disabled
let memoryProfile: UserProfile = {};
let memoryResults: StoredResults = {};

const getStorage = (): Storage | null => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch (e) {}
  return null;
};

export const getStoredProfile = (): UserProfile => {
  try {
    const storage = getStorage();
    if (storage) {
      const raw = storage.getItem(PROFILE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    }
    return memoryProfile;
  } catch (e) {
    console.error('Failed to load stored profile', e);
    return {};
  }
};

export const updateStoredProfile = (partial: Partial<UserProfile>): UserProfile => {
  try {
    const current = getStoredProfile();
    const updated = { ...current, ...partial };
    const storage = getStorage();
    if (storage) {
      storage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } else {
      memoryProfile = updated;
    }
    window.dispatchEvent(new Event('profile_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save profile', e);
    return getStoredProfile();
  }
};

export const getStoredResults = (): StoredResults => {
  try {
    const storage = getStorage();
    if (storage) {
      const raw = storage.getItem(RESULTS_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    }
    return memoryResults;
  } catch (e) {
    console.error('Failed to load stored results', e);
    return {};
  }
};

export const updateStoredResults = (partial: Partial<StoredResults>): StoredResults => {
  try {
    const current = getStoredResults();
    const updated = { ...current, ...partial };
    const storage = getStorage();
    if (storage) {
      storage.setItem(RESULTS_KEY, JSON.stringify(updated));
    } else {
      memoryResults = updated;
    }
    window.dispatchEvent(new Event('results_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save results', e);
    return getStoredResults();
  }
};

export const resetUserData = (): void => {
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(PROFILE_KEY);
      storage.removeItem(RESULTS_KEY);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LEGACY_PROFILE_KEY);
      localStorage.removeItem(LEGACY_RESULTS_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(RESULTS_KEY);
    }
    memoryProfile = {};
    memoryResults = {};
    window.dispatchEvent(new Event('profile_updated'));
    window.dispatchEvent(new Event('results_updated'));
  } catch (e) {
    console.error('Failed to reset data', e);
  }
};

