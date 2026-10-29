import type { Campaign } from '../types';

const STORAGE_KEY = 'app_campaigns_v2';

export async function loadCampaignsFromStorage(): Promise<Campaign[] | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is Campaign =>
      !!item && typeof item === 'object' && typeof item.id === 'string' &&
      typeof item.title === 'string' && Array.isArray(item.posts) && Array.isArray(item.platforms)
    );
  } catch {
    return null;
  }
}

export async function saveCampaignsToStorage(campaigns: Campaign[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    console.error('Could not persist campaigns in this browser.', error);
    throw error;
  }
}
