
import { StoreState } from '../types';
import { INITIAL_STATE } from '../constants';

// Since we're in a frontend environment, we'll hit our Netlify Function proxy
const API_ENDPOINT = '/.netlify/functions/api';

export const fetchStoreData = async (): Promise<StoreState> => {
  try {
    const response = await fetch(`${API_ENDPOINT}?action=get`);
    if (!response.ok) throw new Error('Failed to fetch store data');
    const result = await response.json();
    return result && Object.keys(result).length > 0 ? result : INITIAL_STATE;
  } catch (error) {
    console.error("Fetch failed:", error);
    return INITIAL_STATE;
  }
};

export const saveStoreData = async (data: StoreState): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ action: 'save', data }),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.error("Save failed:", error);
    return false;
  }
};

export const adminVerify = async (email: string, pass: string): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ action: 'verify', email, pass }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    return result.authorized === true;
  } catch (error) {
    return false;
  }
};
