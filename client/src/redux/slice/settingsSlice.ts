import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ✅ New interface matching API response
export interface SettingsState {
  site_name: string;
  site_description: string;
  timezone: string;
  platform_name: string;
  platform_tagline: string;
  currency: string;
  logo: string;
  favicon: string;
  theme_primary?: string;
  theme_primary_second?: string;
  theme_primary_light?: string;
  theme_primary_dark?: string;
  theme_font_heading?: string;
  theme_font_body?: string;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  updated_at?: string;

  website_url?: string | string[];
  social_facebook?: string | string[];
  social_instagram?: string | string[];
  social_twitter?: string | string[];
  social_linkedin?: string | string[];
  social_youtube?: string | string[];
}

const initialState: SettingsState = {
  site_name: '',
  site_description: '',
  timezone: '',
  platform_name: '',
  platform_tagline: '',
  currency: '',
  logo: '',
  favicon: '',
  isLoading: false,
  error: null,
  lastFetched: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (
      state,
      action: PayloadAction<Omit<SettingsState, 'isLoading' | 'error' | 'lastFetched'>>,
    ) => {
      Object.assign(state, action.payload);
      state.lastFetched = Date.now();
      state.error = null;
    },
    updateSettingByKey: (
      state,
      action: PayloadAction<{
        key: keyof Omit<SettingsState, 'isLoading' | 'error' | 'lastFetched'>;
        value: string;
      }>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const { setSettings, updateSettingByKey, setLoading, setError, clearSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
