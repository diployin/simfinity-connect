import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TopNavbarState {
  isExpanded: boolean;
  isSearchOpen: boolean;
  activeMenuItem: string;
}

const initialState: TopNavbarState = {
  isExpanded: false, // For mobile menu
  isSearchOpen: false, // For search modal
  activeMenuItem: 'home', // Currently active menu item
};

const topNavbarSlice = createSlice({
  name: 'topNavbar',
  initialState,
  reducers: {
    // Toggle mobile menu
    toggleMobileMenu: (state) => {
      state.isExpanded = !state.isExpanded;
    },

    // Open/close mobile menu explicitly
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },

    // Toggle search modal
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },

    // Open/close search modal explicitly
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },

    // Set active menu item
    setActiveMenuItem: (state, action: PayloadAction<string>) => {
      state.activeMenuItem = action.payload;
    },

    // Reset to initial state
    resetNavbar: (state) => {
      state.isExpanded = true;
      state.isSearchOpen = true;
      state.activeMenuItem = 'home';
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  setActiveMenuItem,
  resetNavbar,
} = topNavbarSlice.actions;

export default topNavbarSlice.reducer;
