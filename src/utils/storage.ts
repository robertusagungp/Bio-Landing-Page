import { UserProfile, StoredResults } from '../types/profile';

const PROFILE_KEY = 'robertus_user_profile_v1';
const RESULTS_KEY = 'robertus_user_results_v1';

export const getStoredProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored profile', e);
    return {};
  }
};

export const updateStoredProfile = (partial: Partial<UserProfile>): UserProfile => {
  try {
    const current = getStoredProfile();
    const updated = { ...current, ...partial };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('profile_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save profile', e);
    return getStoredProfile();
  }
};

export const getStoredResults = (): StoredResults => {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored results', e);
    return {};
  }
};

export const updateStoredResults = (partial: Partial<StoredResults>): StoredResults => {
  try {
    const current = getStoredResults();
    const updated = { ...current, ...partial };
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('results_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save results', e);
    return getStoredResults();
  }
};

export const resetUserData = (): void => {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(RESULTS_KEY);
    window.dispatchEvent(new Event('profile_updated'));
    window.dispatchEvent(new Event('results_updated'));
  } catch (e) {
    console.error('Failed to reset data', e);
  }
};
